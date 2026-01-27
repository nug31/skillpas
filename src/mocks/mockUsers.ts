export type UserRole = 'student' | 'teacher_produktif' | 'wali_kelas' | 'hod' | 'admin' | 'teacher';

export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    jurusan_id?: string;
    kelas?: string;
    nisn?: string;
    avatar_url?: string;
    photo_url?: string;
}

import { JURUSAN_IDS } from './mockData';

// Mock users for authentication
export const mockUsers: User[] = [
    // Student accounts (one per jurusan)
    { id: 'u-s1', username: 'siswa_mesin', password: '123', name: 'Siswa Mesin', role: 'student', jurusan_id: JURUSAN_IDS.MESIN, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
    { id: 'u-s2', username: 'siswa_tkr', password: '123', name: 'Siswa TKR', role: 'student', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'u-s3', username: 'siswa_tsm', password: '123', name: 'Siswa TSM', role: 'student', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'u-s4', username: 'siswa_elind', password: '123', name: 'Siswa Elind', role: 'student', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'u-s5', username: 'siswa_listrik', password: '123', name: 'Siswa Listrik', role: 'student', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'u-s6', username: 'siswa_kimia', password: '123', name: 'Siswa Kimia', role: 'student', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'u-s7', username: 'siswa_akuntansi', password: '123', name: 'Siswa Akuntansi', role: 'student', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'u-s8', username: 'siswa_hotel', password: '123', name: 'Siswa Perhotelan', role: 'student', jurusan_id: JURUSAN_IDS.HOTEL },

    // Teacher accounts (one per jurusan)
    { id: 'u-g1', username: 'guru_mesin', password: '123', name: 'Guru Mesin', role: 'teacher', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'u-g2', username: 'guru_tkr', password: '123', name: 'Guru TKR', role: 'teacher', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'u-g3', username: 'guru_tsm', password: '123', name: 'Guru TSM', role: 'teacher', jurusan_id: JURUSAN_IDS.TSM },
    // New roles for approval workflow testing
    { id: 't1', username: 'guru1', password: '123', name: 'Budi Santoso, S.T.', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't2', username: 'guru2', password: '123', name: 'Siti Aminah, M.Pd.', role: 'wali_kelas', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't3', username: 'hod1', password: '123', name: 'Dr. Ir. Heru Prasetyo', role: 'hod', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't4', username: 'admin', password: '123', name: 'Super Admin', role: 'admin' },
    // Student user for specific testing
    { id: 's-j1-user', username: 'siswa', password: '123', name: 'Raka Aditya', role: 'student', nisn: '0012345678', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'u-g4', username: 'guru_elind', password: '123', name: 'Guru Elind', role: 'teacher', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'u-g5', username: 'guru_listrik', password: '123', name: 'Guru Listrik', role: 'teacher', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'u-g6', username: 'guru_kimia', password: '123', name: 'Guru Kimia', role: 'teacher', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'u-g7', username: 'guru_akuntansi', password: '123', name: 'Guru Akuntansi', role: 'teacher', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'u-g8', username: 'guru_hotel', password: '123', name: 'Guru Perhotelan', role: 'teacher', jurusan_id: JURUSAN_IDS.HOTEL },

    // Admin teacher (can see all)
    { id: 'u-guru', username: 'guru', password: '123', name: 'Guru', role: 'teacher', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },

    // Admin account (can edit all departments)
    { id: 'u-admin', username: 'admin', password: '123', name: 'Administrator', role: 'admin' },

    // HOD Coordinator (can edit all departments)
    { id: 'u-koord-hod', username: 'koord_hod', password: '123', name: 'Aprilia Rahayu Wilujeng, S.Pd Gr', role: 'admin' },

    // HOD Accounts from user request
    { id: 'hod-tsm', username: 'hod_tsm', password: '123', name: 'Okxy Ixganda, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'hod-tkr', username: 'hod_tkr', password: '123', name: 'Abdillah Putra, A.Md', role: 'hod', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'hod-mesin', username: 'hod_mesin', password: '123', name: 'Dwi Nugroho, S.T', role: 'hod', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'hod-elektro', username: 'hod_elektro', password: '123', name: 'Heru Triatmo,S.Pd. Gr', role: 'hod', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'hod-akuntansi', username: 'hod_akuntansi', password: '123', name: 'Kiki Widia Swara,S.Pd. Gr', role: 'hod', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'hod-hotel', username: 'hod_hotel', password: '123', name: 'Refty Royan Juniarti, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.HOTEL },
    { id: 'hod-tki', username: 'hod_tki', password: '123', name: 'Ryo Maytana, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'hod-elin03', username: 'hod_elin03', password: '123', name: 'Eldha Luvy Zha, A.Md', role: 'hod', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'hod-tsm03', username: 'hod_tsm03', password: '123', name: 'Heri Supriyanto,S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'hod-tkr03', username: 'hod_tkr03', password: '123', name: 'Rahmat Hidayat, S.Pd.Gr', role: 'hod', jurusan_id: JURUSAN_IDS.TKR },
    { id: 't-joko-tkr', username: 'joko_tkr', password: '123', name: 'Joko Setyo Nugroho, S.T', role: 'wali_kelas', kelas: 'XII TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'hod-listrik-astri', username: 'hod_listrik', password: '123', name: 'Astri Afmi Wulandari, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.LISTRIK },

    // Default Teacher Produktif accounts for all majors
    { id: 'p-mesin', username: 'prod_mesin', password: '123', name: 'Guru Produktif Mesin', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'p-tkr', username: 'prod_tkr', password: '123', name: 'Guru Produktif TKR', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'p-tsm', username: 'prod_tsm', password: '123', name: 'Guru Produktif TSM', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'p-elind', username: 'prod_elind', password: '123', name: 'Guru Produktif Elind', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'p-listrik', username: 'prod_listrik', password: '123', name: 'Guru Produktif Listrik', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'p-kimia', username: 'prod_kimia', password: '123', name: 'Guru Produktif Kimia', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'p-akuntansi', username: 'prod_akuntansi', password: '123', name: 'Guru Produktif Akuntansi', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'p-hotel', username: 'prod_hotel', password: '123', name: 'Guru Produktif Perhotelan', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.HOTEL },

    // Consolidated Walas from KAMPUS 01, 02, & 03 (Total 100 Rows)
    { id: 'w-f-x-tsm1', username: 'walas_fadly_x_tsm1', password: '123', name: 'Fadly Narendra U, S.Pd', role: 'wali_kelas', kelas: 'X TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-f-x-tsm2', username: 'walas_fadly_x_tsm2', password: '123', name: 'Fadly Narendra U, S.Pd', role: 'wali_kelas', kelas: 'X TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-e-x-tkr1', username: 'walas_enggar_x_tkr1', password: '123', name: 'Enggar Fata, S.Pd', role: 'wali_kelas', kelas: 'X TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-m-x-tkr2', username: 'walas_munandar_x_tkr2', password: '123', name: 'Munandar, S.Pd', role: 'wali_kelas', kelas: 'X TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-s-x-tkr3', username: 'walas_solkin_x_tkr3', password: '123', name: 'Muhammad Solkin', role: 'wali_kelas', kelas: 'X TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-g-x-mes1', username: 'walas_gesti_x_mesin1', password: '123', name: 'Gesti Khoriunnisa', role: 'wali_kelas', kelas: 'X MESIN 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-p-x-mes2', username: 'walas_pandu_x_mesin2', password: '123', name: 'Pandu Andariansyah', role: 'wali_kelas', kelas: 'X MESIN 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-d-x-mes3', username: 'walas_dikky_x_mesin3', password: '123', name: 'M. Dikky Apri Setia Nugraha S.Pd', role: 'wali_kelas', kelas: 'X MESIN 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-v-x-ak1', username: 'walas_viany_x_ak1', password: '123', name: 'Viany Lingga Revi,S.E', role: 'wali_kelas', kelas: 'X AKUNTANSI 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-d-x-ak2', username: 'walas_devin_x_ak2', password: '123', name: 'Devin Eldwin, S.Ak', role: 'wali_kelas', kelas: 'X AKUNTANSI 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-v-x-ak3', username: 'walas_viany_x_ak3', password: '123', name: 'Viany Lingga Revi,S.E', role: 'wali_kelas', kelas: 'X AKUNTANSI 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-a-x-lis1', username: 'walas_amalia_x_lis1', password: '123', name: 'Amalia Dewi Lestari, S.Pd', role: 'wali_kelas', kelas: 'X LISTRIK 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-x-lis2', username: 'walas_amalia_x_lis2', password: '123', name: 'Amalia Dewi Lestari, S.Pd', role: 'wali_kelas', kelas: 'X LISTRIK 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-m-x-eli1', username: 'walas_maharani_x_elin1', password: '123', name: 'Maharani', role: 'wali_kelas', kelas: 'X ELIND 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-x-eli2', username: 'walas_serli_x_elin2', password: '123', name: 'Serli Aprodita, S.S', role: 'wali_kelas', kelas: 'X ELIND 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-i-x-eli3', username: 'walas_iqbal_x_elin3', password: '123', name: 'Muhamad Iqbal, S.Pd', role: 'wali_kelas', kelas: 'X ELIND 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-m-x-eli4', username: 'walas_maris_x_elin4', password: '123', name: 'Maris Catur Dwi Pratiwi', role: 'wali_kelas', kelas: 'X ELIND 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-m-x-eli5', username: 'walas_maris_x_elin5', password: '123', name: 'Maris Catur Dwi Pratiwi', role: 'wali_kelas', kelas: 'X ELIND 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-i-x-hotel', username: 'walas_iwan_x_hotel', password: '123', name: 'Iwan Sutiawan', role: 'wali_kelas', kelas: 'X HOTEL', jurusan_id: JURUSAN_IDS.HOTEL },
    { id: 'w-h-x-tki1', username: 'walas_haya_x_tki1', password: '123', name: 'Haya Suhaela', role: 'wali_kelas', kelas: 'X TKI 1', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-a-x-tki2', username: 'walas_aldy_x_tki2', password: '123', name: 'M. Aldy Akbar Suopriadi, S.Pd', role: 'wali_kelas', kelas: 'X TKI 2', jurusan_id: JURUSAN_IDS.KIMIA },

    { id: 'w-t-xi-tsm1', username: 'walas_tri_xi_tsm1', password: '123', name: 'Tri Lestari, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-n-xi-tsm2', username: 'walas_nanda_xi_tsm2', password: '123', name: 'Nanda Diansyah, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-d-xi-tsm3', username: 'walas_dede_xi_tsm3', password: '123', name: 'Dede Rukmayanti, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 3', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-r-xi-eli1', username: 'walas_raihan_xi_elin1', password: '123', name: 'Raihan Nurhakim, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-e-xi-eli2', username: 'walas_eldha_xi_elin2', password: '123', name: 'Eldha Luvy Zha, A.Md', role: 'wali_kelas', kelas: 'XI ELIND 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-a-xi-eli3', username: 'walas_azzam_xi_elin3', password: '123', name: 'Azzam Izzudin Ramadhan, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-a-xi-eli4', username: 'walas_azzam_xi_elin4', password: '123', name: 'Azzam Izzudin Ramadhan, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-f-xi-eli5', username: 'walas_fadli_xi_elin5', password: '123', name: 'M. Fadli Maulana, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-t-xi-eli6', username: 'walas_tidtaya_xi_elin6', password: '123', name: 'Tidtaya Puteri Larasanty', role: 'wali_kelas', kelas: 'XI ELIND 6', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xi-eli7', username: 'walas_salsa_xi_elin7', password: '123', name: 'Salsa fatia Azhar', role: 'wali_kelas', kelas: 'XI ELIND 7', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-n-xi-eli8', username: 'walas_nurmayanti_xi_elin8', password: '123', name: 'Nurmayanti, S.Kom', role: 'wali_kelas', kelas: 'XI ELIND 8', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-t-xi-tit1', username: 'walas_tisul_xi_titl1', password: '123', name: 'Tri Sulistyaningsih, S.S', role: 'wali_kelas', kelas: 'XI TITL 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-t-xi-tit2', username: 'walas_tedi_xi_titl2', password: '123', name: 'Tedi Stiadi, S.Pd', role: 'wali_kelas', kelas: 'XI TITL 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-n-xi-mes1', username: 'walas_nia_xi_mesin1', password: '123', name: 'Nia Desnata Hati, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-t-xi-mes2', username: 'walas_tini_xi_mesin2', password: '123', name: 'Tini Nurmala, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-d-xi-mes3', username: 'walas_dita_xi_mesin3', password: '123', name: 'Dita Ardianto, S.T', role: 'wali_kelas', kelas: 'XI MESIN 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-n-xi-mes4', username: 'walas_nia_xi_mesin4', password: '123', name: 'Nia Desnata Hati, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 4', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-h-xi-tkr1', username: 'walas_hafidz_xi_tkr1', password: '123', name: 'M. Hafidz Ghufron, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-d-xi-tkr2', username: 'walas_dodi_xi_tkr2', password: '123', name: 'Dodi Perdana Putra, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-t-xi-tkr3', username: 'walas_trisno_xi_tkr3', password: '123', name: 'Trisno Ngestuti, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-t-xi-tkr4', username: 'walas_trisno_xi_tkr4', password: '123', name: 'Trisno Ngestuti, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 4', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-d-xi-tki1', username: 'walas_diva_xi_tki1', password: '123', name: 'Diva Alysha', role: 'wali_kelas', kelas: 'XI TKI 1', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-i-xi-tki2', username: 'walas_isti_xi_tki2', password: '123', name: 'Istiqomah, S.Pd', role: 'wali_kelas', kelas: 'XI TKI 2', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-d-xi-ak1', username: 'walas_ditta_xi_ak1', password: '123', name: 'Ditta Oktaviani', role: 'wali_kelas', kelas: 'XI AKUNTANSI 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-r-xi-ak2', username: 'walas_retno_xi_ak2', password: '123', name: 'Retno Dwi Astuti', role: 'wali_kelas', kelas: 'XI AKUNTANSI 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-f-xi-ak3', username: 'walas_fuji_xi_ak3', password: '123', name: 'Fuji Sampan Sujana, S.Pd', role: 'wali_kelas', kelas: 'XI AKUNTANSI 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-p-xi-hotel', username: 'walas_putri_xi_hotel', password: '123', name: 'Putri Nur Azizah, S.S', role: 'wali_kelas', kelas: 'XI PERHOTELAN', jurusan_id: JURUSAN_IDS.HOTEL },

    { id: 'w-n-xii-tsm1', username: 'walas_nasrul_xii_tsm1', password: '123', name: 'Ahmad Nasrul, S.Pd', role: 'wali_kelas', kelas: 'XII TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-d-xii-tsm2', username: 'walas_dafiq_xii_tsm2', password: '123', name: 'Ah. Dafiq Najiyullah, S.Pd.I', role: 'wali_kelas', kelas: 'XII TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-m-xii-tkr1', username: 'walas_maulana_xii_tkr1', password: '123', name: 'Maulana Evendi', role: 'wali_kelas', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-e-xii-tkr2', username: 'walas_esa_xii_tkr2', password: '123', name: 'Esa Apriyadi, S.Pd', role: 'wali_kelas', kelas: 'XII TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-f-xii-eli1', username: 'walas_feri_xii_elin1', password: '123', name: 'Feri Hapsara, S.Pd. Gr', role: 'wali_kelas', kelas: 'XII ELIN 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli2', username: 'walas_septi_xii_elin2', password: '123', name: 'Septiawan Filtra Santosa, S.Pd, Gr', role: 'wali_kelas', kelas: 'XII ELIN 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli3', username: 'walas_suhaimi_xii_elin3', password: '123', name: 'Ahmad Suhaimi, S.Pd', role: 'wali_kelas', kelas: 'XII ELIN 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-a-xii-eli4', username: 'walas_ambar_xii_elin4', password: '123', name: 'Ambar Tri Laksono, S.Pd,Gr.', role: 'wali_kelas', kelas: 'XII ELIN 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli5', username: 'walas_septi_xii_elin5', password: '123', name: 'Septiawan Filtra Santosa, S.Pd, Gr', role: 'wali_kelas', kelas: 'XII ELIN 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-r-xii-lis1', username: 'walas_ressa_xii_lis1', password: '123', name: 'Ressa Hadi Purwoko, S.Pd', role: 'wali_kelas', kelas: 'XII Listrik 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-xii-lis2', username: 'walas_astri_xii_lis2', password: '123', name: 'Astri Afmi Wulandari, S.Pd', role: 'wali_kelas', kelas: 'XII Listrik 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-xii-mes1', username: 'walas_azhari_xii_mesin1', password: '123', name: 'Azhari Budiriyanto, S.Pd', role: 'wali_kelas', kelas: 'XII Mesin 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-a-xii-mes2', username: 'walas_azhari_xii_mesin2', password: '123', name: 'Azhari Budiriyanto, S.Pd', role: 'wali_kelas', kelas: 'XII Mesin 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-d-xii-mes3', username: 'walas_dwinu_xii_mesin3', password: '123', name: 'Dwi Nugroho, S.T./Dynda', role: 'wali_kelas', kelas: 'XII Mesin 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-a-xii-ak1', username: 'walas_alyfia_xii_ak1', password: '123', name: 'Alyfia Azahra', role: 'wali_kelas', kelas: 'XII Akuntansi 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-a-xii-ak2', username: 'walas_alyfia_xii_ak2', password: '123', name: 'Alyfia Azahra', role: 'wali_kelas', kelas: 'XII Akuntansi 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-n-xii-ak3', username: 'walas_nida_xii_ak3', password: '123', name: 'Nida Apriliatul Hasanah, S.Pd', role: 'wali_kelas', kelas: 'XII Akuntansi 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-a-xii-hotel', username: 'walas_aula_xii_hotel', password: '123', name: 'Aula Al Layali, S.Pd', role: 'wali_kelas', kelas: 'XII Perhotelan', jurusan_id: JURUSAN_IDS.HOTEL },

    // KAMPUS 03 (34 Rows)
    { id: 'w-tiara-x-tsm1-03', username: 'walas_tiara_x_tsm1_03', password: '123', name: 'Tiara Kusuma Dewi', role: 'wali_kelas', kelas: 'X TSM 1 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-syafrudin-x-tsm2-03', username: 'walas_syafrudin_x_tsm2_03', password: '123', name: 'Syafrudin', role: 'wali_kelas', kelas: 'X TSM 2 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-aji-x-tkr1-03', username: 'walas_aji_x_tkr1_03', password: '123', name: 'Aji Rangga Yasa', role: 'wali_kelas', kelas: 'X TKR 1 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-bagus-x-tkr2-03', username: 'walas_bagus_x_tkr2_03', password: '123', name: 'Bagus Kurniawan, S.Pd', role: 'wali_kelas', kelas: 'X TKR 2 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-imadudin-x-mes1-03', username: 'walas_imadudin_x_mes1_03', password: '123', name: 'Imadudin Abil Fidaa Ismail', role: 'wali_kelas', kelas: 'X MESIN 1 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-novita-x-mes2-03', username: 'walas_novita_x_mes2_03', password: '123', name: 'Novita Hani Pratiwi, S.T', role: 'wali_kelas', kelas: 'X MESIN 2 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-berty-x-ak-03', username: 'walas_berty_x_ak_03', password: '123', name: 'Berty Efira F', role: 'wali_kelas', kelas: 'X AKUNTANSI 03', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-ihsan-x-eli1-03', username: 'walas_ihsan_x_eli1_03', password: '123', name: 'Muhammad Al Ihsan, S.Pd', role: 'wali_kelas', kelas: 'X ELIND 1 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-adhista-x-eli2-03', username: 'walas_adhista_x_eli2_03', password: '123', name: 'Adhista Cindy Rahmayani, S.Pd/Eldha', role: 'wali_kelas', kelas: 'X ELIND 2 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-adhista-x-eli3-03', username: 'walas_adhista_x_eli3_03', password: '123', name: 'Adhista Cindy Rahmayani, S.Pd', role: 'wali_kelas', kelas: 'X ELIND 3 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-arya-xi-tsm4-03', username: 'walas_arya_xi_tsm4_03', password: '123', name: 'Arya Yudha Satria Tama, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 4 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-arya-xi-tsm5-03', username: 'walas_arya_xi_tsm5_03', password: '123', name: 'Arya Yudha Satria Tama, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 5 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-heri-xi-tsm6-03', username: 'walas_heri_xi_tsm6_03', password: '123', name: 'Heri Supriyanto, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 6 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-rahmat-xi-tkr5-03', username: 'walas_rahmat_xi_tkr5_03', password: '123', name: 'Rahmat Hidayat, S.Pd.Gr', role: 'wali_kelas', kelas: 'XI TKR 5 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-adynda-xi-tkr6-03', username: 'walas_adynda_xi_tkr6_03', password: '123', name: 'Adynda Ray R, S.Sos', role: 'wali_kelas', kelas: 'XI TKR 6 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-adynda-xi-tkr7-03', username: 'walas_adynda_xi_tkr7_03', password: '123', name: 'Adynda Ray R, S.Sos', role: 'wali_kelas', kelas: 'XI TKR 7 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-ayu-xi-mes5-03', username: 'walas_ayu_xi_mes5_03', password: '123', name: 'Ayu Warestu, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 5 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-intan-xi-mes6-03', username: 'walas_intan_xi_mes6_03', password: '123', name: 'Intan Chaya Ningtyas', role: 'wali_kelas', kelas: 'XI MESIN 6 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-intan-xi-mes7-03', username: 'walas_intan_xi_mes7_03', password: '123', name: 'Intan Chaya Ningtyas', role: 'wali_kelas', kelas: 'XI MESIN 7 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-danu-xi-eli9-03', username: 'walas_danu_xi_eli9_03', password: '123', name: 'Danu Purwanto, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 9 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-ridwan-xi-eli10-03', username: 'walas_ridwan_xi_eli10_03', password: '123', name: 'Ridwan, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 10 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-lia-xi-eli11-03', username: 'walas_lia_xi_eli11_03', password: '123', name: 'Lia Yulianti, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 11 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-cecep-xi-eli12-03', username: 'walas_cecep_xi_eli12_03', password: '123', name: 'Cecep Bemana Sakti G, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 12 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-diah-xi-ak4-03', username: 'walas_diah_xi_ak4_03', password: '123', name: 'Diah Maulias Dewi P, S.Pd', role: 'wali_kelas', kelas: 'XI AKUNTANSI 4 03', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-hafidz-xii-tbsm3-03', username: 'walas_hafidz_xii_tbsm3_03', password: '123', name: 'Muhamad Hafidz Firdaus Priatama, S.Pd', role: 'wali_kelas', kelas: 'XII TBSM 3 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-hafidz-xii-tbsm4-03', username: 'walas_hafidz_xii_tbsm4_03', password: '123', name: 'Muhamad Hafidz Firdaus Priatama, S.Pd', role: 'wali_kelas', kelas: 'XII TBSM 4 03', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-joko-xii-tkr3-03', username: 'walas_joko_xii_tkr3_03', password: '123', name: 'Joko Setyo Nugroho, S.Pd', role: 'wali_kelas', kelas: 'XII TKR 3 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-teguh-xii-tkr4-03', username: 'walas_teguh_xii_tkr4_03', password: '123', name: 'M. Teguh Suprihatin, S.Psi', role: 'wali_kelas', kelas: 'XII TKR 4 03', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-noval-xii-eli6-03', username: 'walas_noval_xii_eli6_03', password: '123', name: 'Noval Al Mahdy, S.Pd', role: 'wali_kelas', kelas: 'XII ELIN 6 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-yanda-xii-eli7-03', username: 'walas_yanda_xii_eli7_03', password: '123', name: 'Yanda Eko Putra, S.Pd', role: 'wali_kelas', kelas: 'XII ELIN 7 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-yanda-xii-eli8-03', username: 'walas_yanda_xii_eli8_03', password: '123', name: 'Yanda Eko Putra, S.Pd', role: 'wali_kelas', kelas: 'XII ELIN 8 03', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-syaiful-xii-mes4-03', username: 'walas_syaiful_xii_mes4_03', password: '123', name: 'Syaifulloh, S.Pd', role: 'wali_kelas', kelas: 'XII MESIN 4 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-syaiful-xii-mes5-03', username: 'walas_syaiful_xii_mes5_03', password: '123', name: 'Syaifulloh, S.Pd', role: 'wali_kelas', kelas: 'XII MESIN 5 03', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-dwifajar-xii-ak4-03', username: 'walas_dwifajar_xii_ak4_03', password: '123', name: 'Dwi fajar, S.Pd', role: 'wali_kelas', kelas: 'XII AKUNTANSI 4 03', jurusan_id: JURUSAN_IDS.AKUNTANSI },
];

export function authenticateUser(username: string, password: string, selectedRole?: 'student' | 'teacher'): User | null {
    const user = mockUsers.find((u) => {
        const isUsernameMatch = u.username === username || u.name === username || (u.nisn && u.nisn === username);

        if (u.role === 'student') {
            // For students, NISN is the password
            const isPasswordMatch = u.password === password || (u.nisn && u.nisn === password);
            return isUsernameMatch && isPasswordMatch;
        } else {
            // For teachers/others, use their defined password
            return isUsernameMatch && u.password === password;
        }
    });

    if (user && selectedRole) {
        if (selectedRole === 'student' && user.role !== 'student') return null;
        if (selectedRole === 'teacher' && user.role === 'student') return null;
    }

    return user || null;
}
