import { KRSSubmission } from '../types';
import mockData from '../mocks/mockData';

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

    completeKRS(submissionId: string, score: number, result: string, notes?: string, examinerName?: string): boolean {
        const submissions = this.getSubmissions();
        const idx = submissions.findIndex(s => s.id === submissionId);
        if (idx === -1) return false;

        const submission = submissions[idx];
        if (submission.status !== 'scheduled') return false;

        const now = new Date().toISOString();
        const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        submission.status = 'completed';
        submission.updated_at = now;
        submission.final_score = score;
        if (notes) submission.notes = notes;

        // 1. Update Student Score and Poin in Mock Skill Siswa
        const skillIdx = mockData.mockSkillSiswa.findIndex(s => s.siswa_id === submission.siswa_id);
        const levelObj = mockData.mockLevels.find(l => score >= l.min_skor && score <= l.max_skor) || mockData.mockLevels[0];
        const pointsAwarded = Math.floor(score / 2); // Award half the score as XP points

        if (skillIdx >= 0) {
            mockData.mockSkillSiswa[skillIdx].skor = score;
            mockData.mockSkillSiswa[skillIdx].poin += pointsAwarded;
            mockData.mockSkillSiswa[skillIdx].level_id = levelObj.id;
            mockData.mockSkillSiswa[skillIdx].updated_at = now;
        }

        // 2. Add to Competency History
        const newHistory = {
            id: `hist-${Date.now()}`,
            siswa_id: submission.siswa_id,
            level_id: levelObj.id,
            unit_kompetensi: submission.items.join(', '),
            aktivitas_pembuktian: 'Ujian KRS Terverifikasi',
            penilai: examinerName || 'Guru Produktif',
            hasil: result,
            tanggal: dateStr,
            catatan: notes
        };

        mockData.mockCompetencyHistory.push(newHistory);

        // 3. Update Discipline (Engagement)
        const discIdx = mockData.mockDiscipline.findIndex(d => d.siswa_id === submission.siswa_id);
        if (discIdx >= 0) {
            mockData.mockDiscipline[discIdx].attitude_scores = mockData.mockDiscipline[discIdx].attitude_scores.map(s => ({
                ...s,
                score: Math.min(s.score + 5, 100)
            }));
            mockData.mockDiscipline[discIdx].updated_at = now;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return true;
    },

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent(KRS_UPDATED_EVENT));
    }
};
