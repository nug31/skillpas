import { KRSSubmission } from '../types';
import mockData from '../mocks/mockData';
import { supabase, isMockMode } from './supabase';
import { notificationStore } from './notificationStore';

export const KRS_UPDATED_EVENT = 'krs-updated';

export const krsStore = {
    async getSubmissions(): Promise<KRSSubmission[]> {
        if (isMockMode) {
            const saved = localStorage.getItem('skillpas_krs_submissions');
            return saved ? JSON.parse(saved) : [];
        }

        const { data, error } = await supabase
            .from('krs')
            .select('*')
            .order('created_at', { ascending: false })
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache');

        if (error) {
            console.error('Failed to fetch KRS submissions', error);
            return [];
        }

        return data as KRSSubmission[];
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
                .setHeader('pragma', 'no-cache')
                .setHeader('cache-control', 'no-cache')
                .maybeSingle();

            if (error || !data) return 0;
            return data.skor;
        }
    },

    async getStudentSubmission(siswaId: string): Promise<KRSSubmission | undefined> {
        if (isMockMode) {
            const submissions = await this.getSubmissions();
            return submissions.find(s => s.siswa_id === siswaId);
        }

        const { data, error } = await supabase
            .from('krs')
            .select('*')
            .eq('siswa_id', siswaId)
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache')
            .maybeSingle();

        if (error) return undefined;
        return data as KRSSubmission;
    },

    async submitKRS(submission: Omit<KRSSubmission, 'status' | 'submitted_at' | 'updated_at'>): Promise<KRSSubmission | null> {
        const newSubmission = {
            siswa_id: submission.siswa_id,
            siswa_nama: submission.siswa_nama,
            kelas: submission.kelas,
            jurusan_id: submission.jurusan_id,
            items: submission.items,
            status: 'pending_produktif',
            submitted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notes: ''
        };

        if (isMockMode) {
            const submissions = await this.getSubmissions();
            const existingIdx = submissions.findIndex(s => s.siswa_id === submission.siswa_id);
            const mockSub = { ...newSubmission, id: submission.id || `krs-${Date.now()}` } as KRSSubmission; // Cast to satisfy type

            if (existingIdx >= 0) {
                submissions[existingIdx] = mockSub;
            } else {
                submissions.push(mockSub);
            }
            localStorage.setItem('skillpas_krs_submissions', JSON.stringify(submissions));
            this.notifyUpdate();

            notificationStore.actions.addNotification({
                type: 'success',
                title: 'KRS Terkirim',
                message: `KRS untuk ${submission.siswa_nama} telah berhasil diajukan ke Guru Produktif (Mock).`,
            });

            return mockSub;
        }

        // Check if exists
        const { data: existing } = await supabase
            .from('krs')
            .select('id')
            .eq('siswa_id', submission.siswa_id)
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache')
            .maybeSingle();

        let result;
        if (existing) {
            const { data, error } = await supabase
                .from('krs')
                .update({
                    ...newSubmission,
                    status: 'pending_produktif'
                })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) { console.error(error); return null; }
            result = data;
        } else {
            const { data, error } = await supabase
                .from('krs')
                .insert(newSubmission)
                .select()
                .single();
            if (error) { console.error(error); return null; }
            result = data;
        }

        this.notifyUpdate();

        notificationStore.actions.addNotification({
            type: 'success',
            title: 'Sertifikasi Terdaftar',
            message: `Pendaftaran Sertifikasi untuk ${submission.siswa_nama} telah berhasil diajukan ke Guru Produktif.`,
        });

        return result as KRSSubmission;
    },

    async approveKRS(submissionId: string, role: string, notes?: string, examDate?: string): Promise<boolean> {
        let submission: KRSSubmission | undefined;

        if (isMockMode) {
            const subs = await this.getSubmissions();
            submission = subs.find(s => s.id === submissionId);
        } else {
            const { data } = await supabase.from('krs')
                .select('*')
                .eq('id', submissionId)
                .setHeader('pragma', 'no-cache')
                .setHeader('cache-control', 'no-cache')
                .single();
            if (data) submission = data as KRSSubmission;
        }

        if (!submission) return false;

        const now = new Date().toISOString();
        const updates: any = { updated_at: now };

        if (role === 'teacher_produktif' && submission.status === 'pending_produktif') {
            updates.status = 'pending_hod';
            updates.guru_produktif_approved_at = now;
        } else if (role === 'hod' && submission.status === 'pending_hod') {
            updates.status = 'approved';
            updates.hod_approved_at = now;
            if (examDate) {
                updates.status = 'scheduled';
                updates.exam_date = examDate;
            }
        } else {
            return false;
        }

        if (notes) updates.notes = notes;

        if (isMockMode) {
            const subs = await this.getSubmissions();
            const idx = subs.findIndex(s => s.id === submissionId);
            if (idx !== -1) {
                subs[idx] = { ...subs[idx], ...updates };
                localStorage.setItem('skillpas_krs_submissions', JSON.stringify(subs));
            }
        } else {
            const { error } = await supabase.from('krs').update(updates).eq('id', submissionId);
            if (error) {
                console.error("Error approving KRS", error);
                return false;
            }
        }

        this.notifyUpdate();

        let notifTitle = 'Sertifikasi Disetujui';
        let notifMsg = `Sertifikasi ${submission.siswa_nama} telah disetujui di tahap ${role.replace('_', ' ')}.`;

        if (updates.status === 'scheduled') {
            notifTitle = 'Jadwal Ujian Ditetapkan';
            notifMsg = `Ujian Sertifikasi ${submission.siswa_nama} dijadwalkan pada ${updates.exam_date}.`;
        }

        notificationStore.actions.addNotification({
            type: 'info',
            title: notifTitle,
            message: notifMsg,
        });

        return true;
    },

    async rejectKRS(submissionId: string, notes: string): Promise<boolean> {
        if (isMockMode) {
            const subs = await this.getSubmissions();
            const idx = subs.findIndex(s => s.id === submissionId);
            if (idx !== -1) {
                subs[idx].status = 'rejected';
                subs[idx].notes = notes;
                subs[idx].updated_at = new Date().toISOString();
                localStorage.setItem('skillpas_krs_submissions', JSON.stringify(subs));
            }
        } else {
            const { error } = await supabase
                .from('krs')
                .update({
                    status: 'rejected',
                    notes: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', submissionId);

            if (error) return false;
        }

        let name = 'Siswa';
        if (!isMockMode) {
            const { data } = await supabase.from('krs').select('siswa_nama').eq('id', submissionId).maybeSingle();
            if (data) name = data.siswa_nama;
        }

        this.notifyUpdate();

        notificationStore.actions.addNotification({
            type: 'error',
            title: 'Sertifikasi Ditolak',
            message: `Pendaftaran Sertifikasi ${name} telah ditolak. Catatan: ${notes}`,
        });

        return true;
    },

    async completeKRS(submissionId: string, score: number, result: 'Lulus' | 'Tidak Lulus', notes?: string, examinerName?: string): Promise<boolean> {
        let submission: KRSSubmission | undefined;
        // Fetch fresh data
        if (isMockMode) {
            const subs = await this.getSubmissions();
            submission = subs.find(s => s.id === submissionId);
        } else {
            const { data } = await supabase.from('krs')
                .select('*')
                .eq('id', submissionId)
                .setHeader('pragma', 'no-cache')
                .setHeader('cache-control', 'no-cache')
                .single();
            if (data) submission = data as KRSSubmission;
        }

        if (!submission || submission.status !== 'scheduled') return false;

        const now = new Date().toISOString();
        const isoDate = now.split('T')[0];
        const displayDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

        const krsUpdates: any = {
            status: 'completed',
            updated_at: now,
            final_score: score,
            exam_date: null,
            notes: notes || submission.notes
        };

        // 1. Update KRS
        if (isMockMode) {
            const subs = await this.getSubmissions();
            const idx = subs.findIndex(s => s.id === submissionId);
            if (idx !== -1) {
                subs[idx] = { ...subs[idx], ...krsUpdates };
                delete subs[idx].exam_date;
                localStorage.setItem('skillpas_krs_submissions', JSON.stringify(subs));
            }
        } else {
            await supabase.from('krs').update(krsUpdates).eq('id', submissionId);
        }

        // 2. Logic for Skill Update
        const levelIdx = mockData.mockLevels.findIndex(l => score >= l.min_skor && score <= l.max_skor);
        const levelObj = levelIdx >= 0 ? mockData.mockLevels[levelIdx] : mockData.mockLevels[0];
        const pointsAwarded = Math.floor(score / 2);

        if (isMockMode) {
            const skillIdx = mockData.mockSkillSiswa.findIndex(s => s.siswa_id === submission!.siswa_id);
            if (skillIdx >= 0) {
                mockData.mockSkillSiswa[skillIdx].skor = score;
                mockData.mockSkillSiswa[skillIdx].poin += pointsAwarded;
                mockData.mockSkillSiswa[skillIdx].level_id = levelObj.id;
                mockData.mockSkillSiswa[skillIdx].updated_at = now;
            }
            // Add history
            mockData.mockCompetencyHistory.push({
                id: `hist-${Date.now()}`,
                siswa_id: submission.siswa_id,
                level_id: levelObj.id,
                unit_kompetensi: (submission.items || []).join(', '),
                aktivitas_pembuktian: 'Ujian Sertifikasi Terverifikasi',
                penilai: examinerName || 'Guru Produktif',
                hasil: result,
                tanggal: displayDate,
                catatan: notes || ''
            });

        } else {
            const dbSiswaId = submission.siswa_id;

            // Update skill_siswa
            const { error: skillError } = await supabase
                .from('skill_siswa')
                .update({
                    skor: score,
                    level_id: levelObj.id,
                    updated_at: now
                })
                .eq('siswa_id', dbSiswaId);

            // Update Poin
            if (!skillError) {
                const { data: currentSkill } = await supabase.from('skill_siswa').select('poin').eq('siswa_id', dbSiswaId).maybeSingle();
                const currentPoin = currentSkill?.poin || 0;
                await supabase.from('skill_siswa').update({ poin: currentPoin + pointsAwarded }).eq('siswa_id', dbSiswaId);
            }

            // Get DB Level ID
            let dbLevelId = levelObj.id;
            const { data: levelRecord } = await supabase
                .from('level_skill')
                .select('id')
                .gte('max_skor', score)
                .lte('min_skor', score)
                .maybeSingle();
            if (levelRecord) dbLevelId = levelRecord.id;

            const historyEntry = {
                siswa_id: dbSiswaId,
                level_id: dbLevelId,
                unit_kompetensi: (submission.items || []).join(', '), // Should be Array validation
                aktivitas_pembuktian: 'Ujian Sertifikasi Terverifikasi',
                penilai: examinerName || 'Guru Produktif',
                hasil: result,
                tanggal: isoDate,
                catatan: notes || ''
            };

            await supabase.from('competency_history').insert(historyEntry);
        }

        this.notifyUpdate();

        notificationStore.actions.addNotification({
            type: 'success',
            title: 'Ujian Selesai',
            message: `Penilaian untuk ${submission.siswa_nama} telah disimpan. Hasil: ${result}.`,
        });

        return true;
    },

    async ensureBaselineHistory(siswaId: string, score: number) {
        if (!siswaId) return;

        try {
            if (isMockMode) {
                const levels = mockData.mockLevels.sort((a, b) => a.urutan - b.urutan);
                const reachedLevels = levels.filter((l: any) => score >= l.min_skor);
                const now = new Date().toISOString();

                reachedLevels.forEach((rl: any) => {
                    const exists = mockData.mockCompetencyHistory.some((h: any) => h.siswa_id === siswaId && h.level_id === rl.id);
                    if (!exists) {
                        mockData.mockCompetencyHistory.push({
                            id: `h-sync-${siswaId}-${rl.id}`,
                            siswa_id: siswaId,
                            level_id: rl.id,
                            unit_kompetensi: 'Kompetensi Dasar (Sync)',
                            aktivitas_pembuktian: 'Verifikasi Dashboard',
                            penilai: 'Sistem',
                            hasil: 'Lulus',
                            tanggal: now.split('T')[0],
                            catatan: 'Otomatis diperbaiki oleh sistem'
                        });
                    }
                });
            } else {
                // Fetch all levels
                const { data: allLevels } = await supabase.from('level_skill').select('*').order('urutan');
                if (!allLevels) return;

                const reachingLevels = allLevels.filter((l: any) => score >= l.min_skor);

                // Fetch existing history
                const { data: existingHist } = await supabase
                    .from('competency_history')
                    .select('level_id')
                    .eq('siswa_id', siswaId);

                const existingLevelIds = new Set(existingHist?.map((h: any) => h.level_id) || []);
                const historyRows: any[] = [];
                const today = new Date().toISOString().split('T')[0];

                reachingLevels.forEach((rl: any) => {
                    if (!existingLevelIds.has(rl.id)) {
                        historyRows.push({
                            siswa_id: siswaId,
                            level_id: rl.id,
                            unit_kompetensi: 'Kompetensi Dasar (Sync)',
                            aktivitas_pembuktian: 'Verifikasi Dashboard',
                            penilai: 'Sistem',
                            hasil: 'Lulus',
                            tanggal: today,
                            catatan: 'Otomatis diperbaiki oleh sistem'
                        });
                    }
                });

                if (historyRows.length > 0) {
                    console.log(`[krsStore] Repairing ${historyRows.length} history records for student ${siswaId}`);
                    await supabase.from('competency_history').insert(historyRows);
                }
            }
        } catch (err) {
            console.error('[krsStore] Error in ensureBaselineHistory:', err);
        }
    },

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent(KRS_UPDATED_EVENT));
    },

    async notifyWalas(kelas: string, siswaNama: string, examDate: string) {
        const title = 'Jadwal Ujian Siswa';
        const message = `Siswa Anda, ${siswaNama} (${kelas}), telah dijadwalkan ujian pada ${examDate}.`;

        if (isMockMode) {
            const { mockUsers } = await import('../mocks/mockUsers');
            const walas = mockUsers.find(u => u.role === 'wali_kelas' && u.kelas && u.kelas.includes(kelas));
            if (walas) {
                notificationStore.actions.addNotification({
                    user_id: walas.id,
                    type: 'info',
                    title,
                    message
                });
            }
        } else {
            const { data: walasUsers } = await supabase
                .from('users')
                .select('id')
                .eq('role', 'wali_kelas')
                .ilike('kelas', `%${kelas}%`);

            if (walasUsers) {
                for (const walas of walasUsers) {
                    await notificationStore.actions.addNotification({
                        user_id: walas.id,
                        type: 'info',
                        title,
                        message
                    });
                }
            }
        }
    }
};
