import { KRSSubmission } from '../types';
import mockData from '../mocks/mockData';
import { supabase, isMockMode } from './supabase';

const STORAGE_KEY = 'skillpas_krs_submissions';

export const KRS_UPDATED_EVENT = 'krs-updated';

export const krsStore = {
    getSubmissions(): KRSSubmission[] {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse KRS submissions', e);
            return [];
        }
    },

    async getStudentScore(siswaId: string): Promise<number> {
        if (isMockMode) {
            const skill = mockData.mockSkillSiswa.find(s => s.siswa_id === siswaId);
            return skill?.skor || 0;
        } else {
            const { data, error } = await supabase
                .from('skill_siswa')
                .select('skor')
                .eq('siswa_id', siswaId)
                .maybeSingle();

            if (error || !data) return 0;
            return data.skor;
        }
    },

    getStudentSubmission(siswaId: string): KRSSubmission | undefined {
        const submissions = this.getSubmissions();
        return submissions.find(s => s.siswa_id === siswaId);
    },

    submitKRS(submission: Omit<KRSSubmission, 'status' | 'submitted_at' | 'updated_at'>): KRSSubmission {
        const submissions = this.getSubmissions();
        const existingIdx = submissions.findIndex(s => s.siswa_id === submission.siswa_id);

        const newSubmission: KRSSubmission = {
            ...submission,
            status: 'pending_produktif',
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        if (existingIdx >= 0) {
            submissions[existingIdx] = newSubmission;
        } else {
            submissions.push(newSubmission);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return newSubmission;
    },

    approveKRS(submissionId: string, role: string, notes?: string, examDate?: string): boolean {
        const submissions = this.getSubmissions();
        const idx = submissions.findIndex(s => s.id === submissionId);
        if (idx === -1) return false;

        const submission = submissions[idx];
        const now = new Date().toISOString();

        if (role === 'teacher_produktif' && submission.status === 'pending_produktif') {
            submission.status = 'pending_wali';
            submission.guru_produktif_approved_at = now;
        } else if (role === 'wali_kelas' && submission.status === 'pending_wali') {
            submission.status = 'pending_hod';
            submission.wali_kelas_approved_at = now;
        } else if (role === 'hod' && submission.status === 'pending_hod') {
            submission.status = 'approved';
            submission.hod_approved_at = now;
            if (examDate) {
                submission.status = 'scheduled';
                submission.exam_date = examDate;
            }
        } else {
            return false; // Invalid role or status for approval
        }

        if (notes) submission.notes = notes;
        submission.updated_at = now;

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return true;
    },

    rejectKRS(submissionId: string, notes: string): boolean {
        const submissions = this.getSubmissions();
        const idx = submissions.findIndex(s => s.id === submissionId);
        if (idx === -1) return false;

        submissions[idx].status = 'rejected';
        submissions[idx].notes = notes;
        submissions[idx].updated_at = new Date().toISOString();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return true;
    },

    async completeKRS(submissionId: string, score: number, result: string, notes?: string, examinerName?: string): Promise<boolean> {
        const submissions = this.getSubmissions();
        const idx = submissions.findIndex(s => s.id === submissionId);
        if (idx === -1) return false;

        const submission = submissions[idx];
        if (submission.status !== 'scheduled') return false;

        const now = new Date().toISOString();
        const isoDate = now.split('T')[0]; // YYYY-MM-DD for database
        const displayDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        submission.status = 'completed';
        submission.updated_at = now;
        submission.final_score = score;
        delete submission.exam_date;
        if (notes) submission.notes = notes;

        // 1. Update Student Score and Poin
        const levelIdx = mockData.mockLevels.findIndex(l => score >= l.min_skor && score <= l.max_skor);
        const levelObj = levelIdx >= 0 ? mockData.mockLevels[levelIdx] : mockData.mockLevels[0];
        const pointsAwarded = Math.floor(score / 2); // Award half the score as XP points

        if (isMockMode) {
            const skillIdx = mockData.mockSkillSiswa.findIndex(s => s.siswa_id === submission.siswa_id);
            if (skillIdx >= 0) {
                mockData.mockSkillSiswa[skillIdx].skor = score;
                mockData.mockSkillSiswa[skillIdx].poin += pointsAwarded;
                mockData.mockSkillSiswa[skillIdx].level_id = levelObj.id;
                mockData.mockSkillSiswa[skillIdx].updated_at = now;
            }
        } else {
            // Supabase Persistence
            const { error: skillError } = await supabase
                .from('skill_siswa')
                .update({
                    skor: score,
                    level_id: levelObj.id,
                    updated_at: now
                })
                .eq('siswa_id', submission.siswa_id);

            if (skillError) {
                console.error('Failed to update skill_siswa in Supabase', skillError);
                return false;
            }

            // Increment points separately since it's a relative update
            const { data: currentSkill } = await supabase.from('skill_siswa').select('poin').eq('siswa_id', submission.siswa_id).maybeSingle();
            const currentPoin = currentSkill?.poin || 0;
            await supabase.from('skill_siswa').update({ poin: currentPoin + pointsAwarded }).eq('siswa_id', submission.siswa_id);
        }

        // 2. Add to Competency History
        const historyEntry = {
            siswa_id: submission.siswa_id,
            level_id: levelObj.id,
            unit_kompetensi: submission.items.join(', '),
            aktivitas_pembuktian: 'Ujian KRS Terverifikasi',
            penilai: examinerName || 'Guru Produktif',
            hasil: result,
            tanggal: isMockMode ? displayDate : isoDate,
            catatan: notes || ''
        };

        if (isMockMode) {
            mockData.mockCompetencyHistory.push({
                id: `hist-${Date.now()}`,
                ...historyEntry
            });
        } else {
            const { error: histError } = await supabase
                .from('competency_history')
                .insert(historyEntry);

            if (histError) {
                console.warn('Failed to insert competency history in Supabase', histError);
                // Continue anyway since skill was updated
            }
        }

        // 3. Update Discipline (Engagement) - Mock only for now
        if (isMockMode) {
            const discIdx = mockData.mockDiscipline.findIndex(d => d.siswa_id === submission.siswa_id);
            if (discIdx >= 0) {
                mockData.mockDiscipline[discIdx].attitude_scores = mockData.mockDiscipline[discIdx].attitude_scores.map(s => ({
                    ...s,
                    score: Math.min(s.score + 5, 100)
                }));
                mockData.mockDiscipline[discIdx].updated_at = now;
            }
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return true;
    },

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent(KRS_UPDATED_EVENT));
    }
};
