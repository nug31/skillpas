import { KRSSubmission, KRSStatus, StudentDiscipline } from '../types';
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

    completeKRS(submissionId: string): boolean {
        const submissions = this.getSubmissions();
        const idx = submissions.findIndex(s => s.id === submissionId);
        if (idx === -1) return false;

        const submission = submissions[idx];
        if (submission.status !== 'scheduled') return false;

        submission.status = 'completed';
        submission.updated_at = new Date().toISOString();

        // Calculate points based on level (simplified logic: get from mockLevels or default)
        // Assume submission.items contains criteria. We can infer level from the first item or pass level info.
        // For now, let's just award a fixed amount per "Exam" or try to find the level.
        // We'll award +10 points for now as a baseline for any completed exam.
        const pointsAwarded = 10;

        // Update mock discipline data (in-memory)
        // In a real app, this would be a DB call to `discipline_scores` table
        const discIdx = mockData.mockDiscipline.findIndex(d => d.siswa_id === submission.siswa_id);
        if (discIdx >= 0) {
            mockData.mockDiscipline[discIdx].attitude_scores = mockData.mockDiscipline[discIdx].attitude_scores.map(s => ({
                ...s,
                score: Math.min(s.score + pointsAwarded, 1000) // Cap at 1000 instead of 100 to show accumulation
            }));
        } else {
            // Create new if not exists
            mockData.mockDiscipline.push({
                id: `disc-${submission.siswa_id}`,
                siswa_id: submission.siswa_id,
                attendance_pcent: 100,
                attitude_scores: [
                    { aspect: 'Disiplin', score: pointsAwarded },
                    { aspect: 'Tanggung Jawab', score: pointsAwarded },
                    { aspect: 'Jujur', score: pointsAwarded },
                    { aspect: 'Kerjasama', score: pointsAwarded },
                    { aspect: 'Peduli', score: pointsAwarded }
                ],
                updated_at: new Date().toISOString()
            });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
        this.notifyUpdate();
        return true;
    },

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent(KRS_UPDATED_EVENT));
    }
};
