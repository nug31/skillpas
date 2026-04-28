import { KRSSubmission } from '../types';
import mockData from '../mocks/mockData';
import { supabase, isMockMode } from './supabase';
import { notificationStore } from './notificationStore';

export const KRS_UPDATED_EVENT = 'krs-updated';

const getSekolahId = () => {
    try {
        const stored = localStorage.getItem('skill_passport_auth');
        if (stored) {
            const user = JSON.parse(stored);
            return user.sekolah_id;
        }
    } catch (e) {
        console.error('Failed to get sekolah_id from storage', e);
    }
    return null;
};

export const krsStore = {
    async getSubmissions(siswaIds?: string[]): Promise<KRSSubmission[]> {
        if (isMockMode) {
            const saved = localStorage.getItem('skillpas_krs_submissions');
            let data: KRSSubmission[] = saved ? JSON.parse(saved) : [];
            if (siswaIds && siswaIds.length > 0) {
                data = data.filter(s => siswaIds.includes(s.siswa_id));
            }
            return data;
        }

        let query = supabase
            .from('krs')
            .select('*')
            .order('created_at', { ascending: false })
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache');

        const sekolahId = getSekolahId();
        if (sekolahId) {
            query = query.eq('sekolah_id', sekolahId);
        }

        if (siswaIds && siswaIds.length > 0) {
            query = query.in('siswa_id', siswaIds);
        }

        const { data, error } = await query;

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
            const query = supabase
                .from('skill_siswa')
                .select('skor')
                .eq('siswa_id', siswaId)
                .setHeader('pragma', 'no-cache')
                .setHeader('cache-control', 'no-cache');

            const sekolahId = getSekolahId();
            if (sekolahId) query.eq('sekolah_id', sekolahId);

            const { data, error } = await query.maybeSingle();

            if (error || !data) return 0;
            return data.skor;
        }
    },

    async getStudentSubmission(siswaId: string): Promise<KRSSubmission | undefined> {
        if (isMockMode) {
            const submissions = await this.getSubmissions();
            return submissions.find(s => s.siswa_id === siswaId);
        }

        const query = supabase
            .from('krs')
            .select('*')
            .eq('siswa_id', siswaId)
            .order('updated_at', { ascending: false })
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache');

        const sekolahId = getSekolahId();
        if (sekolahId) query.eq('sekolah_id', sekolahId);

        const { data, error } = await query;

        if (error || !data || data.length === 0) return undefined;
        // Return latest if multiple exist
        return data[0] as KRSSubmission;
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
            notes: '',
            sekolah_id: getSekolahId()
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

        // Check if entries exist - fetch ALL to handle duplicates
        const { data: existingRecords } = await supabase
            .from('krs')
            .select('id')
            .eq('siswa_id', submission.siswa_id)
            .order('updated_at', { ascending: false })
            .setHeader('pragma', 'no-cache')
            .setHeader('cache-control', 'no-cache');

        let result;
        if (existingRecords && existingRecords.length > 0) {
            // Update the most recent one
            const latestId = existingRecords[0].id;
            const { data, error } = await supabase
                .from('krs')
                .update({
                    ...newSubmission,
                    status: 'pending_produktif'
                })
                .eq('id', latestId)
                .select()
                .single();
            if (error) { console.error(error); return null; }
            result = data;

            // Cleanup: Delete other duplicates if any
            if (existingRecords.length > 1) {
                const otherIds = existingRecords.slice(1).map((r: any) => r.id);
                await supabase.from('krs').delete().in('id', otherIds);
            }
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

    async cleanupDuplicates() {
        if (isMockMode) return;

        try {
            // 1. Fetch ALL submissions record ID and updated_at
            const query = supabase
                .from('krs')
                .select('id, siswa_id, updated_at')
                .order('updated_at', { ascending: false });

            const sekolahId = getSekolahId();
            if (sekolahId) query.eq('sekolah_id', sekolahId);

            const { data: all, error } = await query;

            if (error || !all) return;

            // 2. Map newest per student, collect others
            const latestPerStudent = new Map<string, string>();
            const idsToDelete: string[] = [];

            all.forEach((row: any) => {
                if (!latestPerStudent.has(row.siswa_id)) {
                    latestPerStudent.set(row.siswa_id, row.id);
                } else {
                    idsToDelete.push(row.id);
                }
            });

            // 3. Delete duplicates from DB
            if (idsToDelete.length > 0) {
                console.log(`[krsStore] Cleaning up ${idsToDelete.length} duplicate records.`);
                
                // Chunk deletion if too many
                const chunkSize = 50;
                for (let i = 0; i < idsToDelete.length; i += chunkSize) {
                    const chunk = idsToDelete.slice(i, i + chunkSize);
                    await supabase.from('krs').delete().in('id', chunk);
                }

                // Also try to clear non-read notifications that might have piled up for these students
                // to help clear the teacher's/student's backlog
                for (const studentId of Array.from(latestPerStudent.keys())) {
                    // For each student who had duplicates, we might want to clear their pending notifications
                    // or for the system-wide notifications. 
                    // This is rough but helps clear the 35+ count
                    const notifQuery = supabase.from('notifications')
                        .delete()
                        .eq('user_id', studentId) // If they are student-facing
                        .eq('read', false);
                    
                    const sekolahId = getSekolahId();
                    if (sekolahId) notifQuery.eq('sekolah_id', sekolahId);
                    
                    await notifQuery;
                    
                    // Also clear for the teacher/role if they don't have user_id specified but are piled up
                    // But we don't have an easy way to target 'all' without a user_id here.
                }
            }
        } catch (err) {
            console.error('[krsStore] Error during cleanupDuplicates:', err);
        }
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

    async approveBulkKRS(submissionIds: string[], role: string, notes?: string, examDate?: string): Promise<boolean> {
        if (submissionIds.length === 0) return true;

        const now = new Date().toISOString();
        const updates: any = { updated_at: now };

        if (role === 'teacher_produktif') {
            updates.status = 'pending_hod';
            updates.guru_produktif_approved_at = now;
        } else if (role === 'hod') {
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
            submissionIds.forEach(id => {
                const idx = subs.findIndex(s => s.id === id);
                if (idx !== -1) {
                    subs[idx] = { ...subs[idx], ...updates };
                }
            });
            localStorage.setItem('skillpas_krs_submissions', JSON.stringify(subs));
        } else {
            const { error } = await supabase
                .from('krs')
                .update(updates)
                .in('id', submissionIds);

            if (error) {
                console.error("Error bulk approving KRS", error);
                return false;
            }
        }

        this.notifyUpdate();

        notificationStore.actions.addNotification({
            type: 'success',
            title: 'Sertifikasi Massal Disetujui',
            message: `${submissionIds.length} pendaftaran telah disetujui sekaligus.`,
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
            const skillQuery = supabase
                .from('skill_siswa')
                .update({
                    skor: score,
                    level_id: levelObj.id,
                    updated_at: now
                })
                .eq('siswa_id', dbSiswaId);

            const sekolahId = getSekolahId();
            if (sekolahId) skillQuery.eq('sekolah_id', sekolahId);

            const { error: skillError } = await skillQuery;

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
                catatan: notes || '',
                sekolah_id: getSekolahId()
            };

            await supabase.from('competency_history').insert(historyEntry);
        }

        this.notifyUpdate();

        // 3. Send Notification to Student
        try {
            let studentUserId = submission.siswa_id; // Default assumption
            if (!isMockMode) {
                const { data: userData } = await supabase.from('users').select('id').eq('nisn', submission.siswa_id).maybeSingle();
                if (userData) studentUserId = userData.id;
            }

            notificationStore.actions.addNotification({
                user_id: studentUserId,
                type: result === 'Lulus' ? 'success' : 'warning',
                title: 'Hasil Ujian Sertifikasi',
                message: `Halo ${submission.siswa_nama}, ujian Anda telah selesai dengan hasil: ${result.toUpperCase()}. Skor Akhir: ${score}.`,
            });
        } catch (e) {
            console.warn("Failed to send student notification", e);
        }

        notificationStore.actions.addNotification({
            type: 'success',
            title: 'Penilaian Disimpan',
            message: `Hasil ujian ${submission.siswa_nama} telah berhasil diverifikasi.`,
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

    async updateEvidence(submissionId: string, photos: string[], videos: string[]): Promise<boolean> {
        if (isMockMode) {
            const subs = await this.getSubmissions();
            const idx = subs.findIndex(s => s.id === submissionId);
            if (idx !== -1) {
                subs[idx].evidence_photos = photos;
                subs[idx].evidence_videos = videos;
                subs[idx].updated_at = new Date().toISOString();
                localStorage.setItem('skillpas_krs_submissions', JSON.stringify(subs));
                this.notifyUpdate();
                return true;
            }
            return false;
        }

        const { error } = await supabase
            .from('krs')
            .update({
                evidence_photos: photos,
                evidence_videos: videos,
                updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);

        if (error) {
            console.error("Error updating evidence", error);
            return false;
        }

        this.notifyUpdate();
        return true;
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
