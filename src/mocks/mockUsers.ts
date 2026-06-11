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
    sekolah_id?: string;
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
    { id: 't2', username: 'guru2', password: '123', name: 'Siti Aminah, M.Pd.', role: 'wali_kelas', kelas: 'ALUMNI TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't3', username: 'hod1', password: '123', name: 'Dr. Ir. Heru Prasetyo', role: 'hod', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't4', username: 'admin', password: '123', name: 'Super Admin', role: 'admin' },
    // Student user for specific testing
    { id: 's-j1-user', username: 'siswa', password: '123', name: 'Raka Aditya', role: 'student', nisn: '0012345678', kelas: 'ALUMNI TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
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
    { id: 't-joko-tkr', username: 'joko_tkr', password: '123', name: 'Joko Setyo Nugroho, S.T', role: 'wali_kelas', kelas: 'ALUMNI TKR 3', jurusan_id: JURUSAN_IDS.TKR },
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
    // XI CLASSES (naik dari X)
    { id: 'w-v-xi-ak1', username: 'walas_viany_xi_ak1', password: '123', name: 'Viany Lingga Revi, S.E', role: 'wali_kelas', kelas: 'XI AK 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-d-xi-ak2', username: 'walas_devin_xi_ak2', password: '123', name: 'Devin Eldwin, S.Ak', role: 'wali_kelas', kelas: 'XI AK 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-v-xi-ak3', username: 'walas_viany_xi_ak3', password: '123', name: 'Viany Lingga Revi, S.E', role: 'wali_kelas', kelas: 'XI AK 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-m-xi-eli1', username: 'walas_maharani_xi_elin1', password: '123', name: 'Maharani Benedicta AP, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xi-eli2', username: 'walas_serli_xi_elin2', password: '123', name: 'Serli Aprodita, S.S', role: 'wali_kelas', kelas: 'XI ELIND 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-i-xi-eli3', username: 'walas_iqbal_xi_elin3', password: '123', name: 'Muhamad Iqbal, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-m-xi-eli4', username: 'walas_maris_xi_elin4', password: '123', name: 'Maristya Catur Dwi Pratiwi', role: 'wali_kelas', kelas: 'XI ELIND 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-m-xi-eli5', username: 'walas_maris_xi_elin5', password: '123', name: 'Maristya Catur Dwi Pratiwi', role: 'wali_kelas', kelas: 'XI ELIND 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-i-xi-hotel', username: 'walas_iwan_xi_hotel', password: '123', name: 'Iwan Sutiawan, A.MD', role: 'wali_kelas', kelas: 'XI HOTEL', jurusan_id: JURUSAN_IDS.HOTEL },
    { id: 'w-a-xi-titl1', username: 'walas_amalia_xi_titl1', password: '123', name: 'Amalia Dewi Lestari, S.Pd', role: 'wali_kelas', kelas: 'XI TITL 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-xi-titl2', username: 'walas_amalia_xi_titl2', password: '123', name: 'Amalia Dewi Lestari, S.Pd', role: 'wali_kelas', kelas: 'XI TITL 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-g-xi-mes1', username: 'walas_gesti_xi_mesin1', password: '123', name: 'Gesti Khoriunnisa, M.Pd', role: 'wali_kelas', kelas: 'XI MESIN 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-p-xi-mes2', username: 'walas_pandu_xi_mesin2', password: '123', name: 'Pandu Andariansyah, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-d-xi-mes3', username: 'walas_dikky_xi_mesin3', password: '123', name: 'M. Dikky Apri Setia Nugraha, S.Pd', role: 'wali_kelas', kelas: 'XI MESIN 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-e-xi-tkr1', username: 'walas_enggar_xi_tkr1', password: '123', name: 'Enggar Fata, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-m-xi-tkr2', username: 'walas_munandar_xi_tkr2', password: '123', name: 'Munandar, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-s-xi-tkr3', username: 'walas_sultan_xi_tkr3', password: '123', name: 'Sultan Saladdin, S.Pd', role: 'wali_kelas', kelas: 'XI TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-f-xi-tsm1', username: 'walas_fadly_xi_tsm1', password: '123', name: 'Fadly Narendra Utomo, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-f-xi-tsm2', username: 'walas_fadly_xi_tsm2', password: '123', name: 'Fadly Narendra Utomo, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-h-xi-tki1', username: 'walas_haya_xi_tki1', password: '123', name: 'Haya Suhaela, S.Pd', role: 'wali_kelas', kelas: 'XI TKI 1', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-a-xi-tki2', username: 'walas_aldy_xi_tki2', password: '123', name: 'Moh. Aldy Akbar Supriyadi, S', role: 'wali_kelas', kelas: 'XI TKI 2', jurusan_id: JURUSAN_IDS.KIMIA },

    // XII CLASSES (naik dari XI)
    { id: 'w-ditta-xii-ak1', username: 'walas_ditta_xii_ak1', password: '123', name: 'Ditta Octaviani, S.Pd', role: 'wali_kelas', kelas: 'XII AK 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-retno-xii-ak2', username: 'walas_retno_xii_ak2', password: '123', name: 'Retno Dwi Astuti', role: 'wali_kelas', kelas: 'XII AK 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-fuji-xii-ak3', username: 'walas_fuji_xii_ak3', password: '123', name: 'Fuji Sampan Sujana', role: 'wali_kelas', kelas: 'XII AK 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-raihan-xii-eli1', username: 'walas_raihan_xii_elin1', password: '123', name: 'Raihan Nurhakim, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-eldha-xii-eli2', username: 'walas_eldha_xii_elin2', password: '123', name: 'Eldha Luvy Zha', role: 'wali_kelas', kelas: 'XII ELIND 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-azzam-xii-eli3', username: 'walas_azzam_xii_elin3', password: '123', name: 'Azzam Izzudin Ramadhan', role: 'wali_kelas', kelas: 'XII ELIND 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-azzam-xii-eli4', username: 'walas_azzam_xii_elin4', password: '123', name: 'Azzam Izzudin Ramadhan', role: 'wali_kelas', kelas: 'XII ELIND 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-fadli-xii-eli5', username: 'walas_fadli_xii_elin5', password: '123', name: 'Fadli Maulana, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-tidtaya-xii-eli6', username: 'walas_tidtaya_xii_elin6', password: '123', name: 'Tidtaya Puteri Larasanty', role: 'wali_kelas', kelas: 'XII ELIND 6', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-salsa-xii-eli7', username: 'walas_salsa_xii_elin7', password: '123', name: 'Salsa Fatia Azhar, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 7', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-nurma-xii-eli8', username: 'walas_nurmayanti_xii_elin8', password: '123', name: 'Nurmayanti, S.Kom', role: 'wali_kelas', kelas: 'XII ELIND 8', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-putri-xii-hotel', username: 'walas_putri_xii_hotel', password: '123', name: 'Putri Nur Azizah', role: 'wali_kelas', kelas: 'XII HOTEL', jurusan_id: JURUSAN_IDS.HOTEL },
    { id: 'w-tisul-xii-titl1', username: 'walas_tisul_xii_titl1', password: '123', name: 'Tri Sulistyaningsih', role: 'wali_kelas', kelas: 'XII TITL 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-tedi-xii-titl2', username: 'walas_tedi_xii_titl2', password: '123', name: 'Tedi Setiadi, S.Pd', role: 'wali_kelas', kelas: 'XII TITL 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-nia-xii-mes1', username: 'walas_nia_xii_mesin1', password: '123', name: 'Nia Desnata Hati', role: 'wali_kelas', kelas: 'XII MESIN 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-tini-xii-mes2', username: 'walas_tini_xii_mesin2', password: '123', name: 'Tini Nurmala', role: 'wali_kelas', kelas: 'XII MESIN 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-dwi-xii-mes3', username: 'walas_dwi_xii_mesin3', password: '123', name: 'Dwi Nugroho', role: 'wali_kelas', kelas: 'XII MESIN 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-nia-xii-mes4', username: 'walas_nia_xii_mesin4', password: '123', name: 'Nia Desnata Hati', role: 'wali_kelas', kelas: 'XII MESIN 4', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-hafidz-xii-tkr1', username: 'walas_hafidz_xii_tkr1', password: '123', name: 'M. Hafidz Ghufron, S.Pd', role: 'wali_kelas', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-dodi-xii-tkr2', username: 'walas_dodi_xii_tkr2', password: '123', name: 'Dodi Perdana P', role: 'wali_kelas', kelas: 'XII TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-trisno-xii-tkr3', username: 'walas_trisno_xii_tkr3', password: '123', name: 'Trisno Ngestuti, S.Pd', role: 'wali_kelas', kelas: 'XII TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-trisno-xii-tkr4', username: 'walas_trisno_xii_tkr4', password: '123', name: 'Trisno Ngestuti, S.Pd', role: 'wali_kelas', kelas: 'XII TKR 4', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-diva-xii-tki1', username: 'walas_diva_xii_tki1', password: '123', name: 'Diva Alysha', role: 'wali_kelas', kelas: 'XII TKI 1', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-isti-xii-tki2', username: 'walas_isti_xii_tki2', password: '123', name: 'Istiqomah', role: 'wali_kelas', kelas: 'XII TKI 2', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'w-tri-xii-tsm1', username: 'walas_tri_xii_tsm1', password: '123', name: 'Tri Lestari, S.Pd', role: 'wali_kelas', kelas: 'XII TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-nanda-xii-tsm2', username: 'walas_nanda_xii_tsm2', password: '123', name: 'Nanda Diansyah Dwi Saputro', role: 'wali_kelas', kelas: 'XII TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-dede-xii-tsm3', username: 'walas_dede_xii_tsm3', password: '123', name: 'Dede Rukmayanti', role: 'wali_kelas', kelas: 'XII TSM 3', jurusan_id: JURUSAN_IDS.TSM },

    { id: 'w-n-xii-tsm1', username: 'walas_nasrul_xii_tsm1', password: '123', name: 'Ahmad Nasrul, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI TSM 1', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-d-xii-tsm2', username: 'walas_dafiq_xii_tsm2', password: '123', name: 'Ah. Dafiq Najiyullah, S.Pd.I', role: 'wali_kelas', kelas: 'ALUMNI TSM 2', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-m-xii-tkr1', username: 'walas_maulana_xii_tkr1', password: '123', name: 'Maulana Evendi', role: 'wali_kelas', kelas: 'ALUMNI TKR 1', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-e-xii-tkr2', username: 'walas_esa_xii_tkr2', password: '123', name: 'Esa Apriyadi, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI TKR 2', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-f-xii-eli1', username: 'walas_feri_xii_elin1', password: '123', name: 'Feri Hapsara, S.Pd. Gr', role: 'wali_kelas', kelas: 'ALUMNI ELIND 1', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli2', username: 'walas_septi_xii_elin2', password: '123', name: 'Septiawan Filtra Santosa, S.Pd, Gr', role: 'wali_kelas', kelas: 'ALUMNI ELIND 2', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli3', username: 'walas_suhaimi_xii_elin3', password: '123', name: 'Ahmad Suhaimi, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI ELIND 3', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-a-xii-eli4', username: 'walas_ambar_xii_elin4', password: '123', name: 'Ambar Tri Laksono, S.Pd,Gr.', role: 'wali_kelas', kelas: 'ALUMNI ELIND 4', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-s-xii-eli5', username: 'walas_septi_xii_elin5', password: '123', name: 'Septiawan Filtra Santosa, S.Pd, Gr', role: 'wali_kelas', kelas: 'ALUMNI ELIND 5', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-r-xii-lis1', username: 'walas_ressa_xii_lis1', password: '123', name: 'Ressa Hadi Purwoko, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI LISTRIK 1', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-xii-lis2', username: 'walas_astri_xii_lis2', password: '123', name: 'Astri Afmi Wulandari, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI LISTRIK 2', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'w-a-xii-mes1', username: 'walas_azhari_xii_mesin1', password: '123', name: 'Azhari Budiriyanto, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI MESIN 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-a-xii-mes2', username: 'walas_azhari_xii_mesin2', password: '123', name: 'Azhari Budiriyanto, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI MESIN 2', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-d-xii-mes3', username: 'walas_dwinu_xii_mesin3', password: '123', name: 'Dwi Nugroho, S.T./Dynda', role: 'wali_kelas', kelas: 'ALUMNI MESIN 3', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-a-xii-ak1', username: 'walas_alyfia_xii_ak1', password: '123', name: 'Alyfia Azahra', role: 'wali_kelas', kelas: 'ALUMNI AK 1', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-a-xii-ak2', username: 'walas_alyfia_xii_ak2', password: '123', name: 'Alyfia Azahra', role: 'wali_kelas', kelas: 'ALUMNI AK 2', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-n-xii-ak3', username: 'walas_nida_xii_ak3', password: '123', name: 'Nida Apriliatul Hasanah, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI AK 3', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-a-xii-hotel', username: 'walas_aula_xii_hotel', password: '123', name: 'Aula Al Layali, S.Pd', role: 'wali_kelas', kelas: 'ALUMNI HOTEL 1', jurusan_id: JURUSAN_IDS.HOTEL },

    // KAMPUS 03 - XI CLASSES (naik dari X 03)
    { id: 'w-berty-xi-ak-03', username: 'walas_berty_xi_ak_03', password: '123', name: 'Berty Efira, S.S', role: 'wali_kelas', kelas: 'XI AK (03)', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-ihsan-xi-eli1-03', username: 'walas_ihsan_xi_eli1_03', password: '123', name: 'Muhammad Al Ihsan', role: 'wali_kelas', kelas: 'XI ELIND 1 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-adhista-xi-eli2-03', username: 'walas_adhista_xi_eli2_03', password: '123', name: 'Adhista Cindy Rahmayani, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 2 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-adhista-xi-eli3-03', username: 'walas_adhista_xi_eli3_03', password: '123', name: 'Adhista Cindy Rahmayani, S.Pd', role: 'wali_kelas', kelas: 'XI ELIND 3 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-imadudin-xi-mes1-03', username: 'walas_imadudin_xi_mes1_03', password: '123', name: 'Imadudin Abil Fidaa Ismail', role: 'wali_kelas', kelas: 'XI MESIN 1 (03)', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-novita-xi-mes2-03', username: 'walas_novita_xi_mes2_03', password: '123', name: 'Novita Hani Pratiwi, S.Tr.T', role: 'wali_kelas', kelas: 'XI MESIN 2 (03)', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-teguh-xi-tkr1-03', username: 'walas_teguh_xi_tkr1_03', password: '123', name: 'M Teguh', role: 'wali_kelas', kelas: 'XI TKR 1 (03)', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-diah-xi-tkr2-03', username: 'walas_diah_xi_tkr2_03', password: '123', name: 'Diah Maulias DP', role: 'wali_kelas', kelas: 'XI TKR 2 (03)', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-tiara-xi-tsm1-03', username: 'walas_tiara_xi_tsm1_03', password: '123', name: 'Tiara Kusuma Dewi, S.Pd', role: 'wali_kelas', kelas: 'XI TSM 1 (03)', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-syafrudin-xi-tsm2-03', username: 'walas_syafrudin_xi_tsm2_03', password: '123', name: 'Syafrudin, S.S', role: 'wali_kelas', kelas: 'XI TSM 2 (03)', jurusan_id: JURUSAN_IDS.TSM },
    // KAMPUS 03 - XII CLASSES (naik dari XI 03)
    { id: 'w-diah-xii-ak4-03', username: 'walas_diah_xii_ak4_03', password: '123', name: 'Diah Maulias Dewi Putri', role: 'wali_kelas', kelas: 'XII AK 4 (03)', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'w-danu-xii-eli9-03', username: 'walas_danu_xii_eli9_03', password: '123', name: 'Danu Purwanto', role: 'wali_kelas', kelas: 'XII ELIND 9 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-ridwan-xii-eli10-03', username: 'walas_ridwan_xii_eli10_03', password: '123', name: 'Ridwan, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 10 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-lia-xii-eli11-03', username: 'walas_lia_xii_eli11_03', password: '123', name: 'Lia Yulianti, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 11 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-cecep-xii-eli12-03', username: 'walas_cecep_xii_eli12_03', password: '123', name: 'Cecep Bemana Sakti G, S.Pd', role: 'wali_kelas', kelas: 'XII ELIND 12 (03)', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'w-ayu-xii-mes5-03', username: 'walas_ayu_xii_mes5_03', password: '123', name: 'Ayu W', role: 'wali_kelas', kelas: 'XII MESIN 5 (03)', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-intan-xii-mes6-03', username: 'walas_intan_xii_mes6_03', password: '123', name: 'Intan Chaya Nitias', role: 'wali_kelas', kelas: 'XII MESIN 6 (03)', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-intan-xii-mes7-03', username: 'walas_intan_xii_mes7_03', password: '123', name: 'Intan Chaya Nitias', role: 'wali_kelas', kelas: 'XII MESIN 7 (03)', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'w-rahmat-xii-tkr5-03', username: 'walas_rahmat_xii_tkr5_03', password: '123', name: 'Rahmat Hidayat', role: 'wali_kelas', kelas: 'XII TKR 5 (03)', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-adynda-xii-tkr6-03', username: 'walas_adynda_xii_tkr6_03', password: '123', name: 'Adynda Ray Razika, S.Sos', role: 'wali_kelas', kelas: 'XII TKR 6 (03)', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-adynda-xii-tkr7-03', username: 'walas_adynda_xii_tkr7_03', password: '123', name: 'Adynda Ray Razika, S.Sos', role: 'wali_kelas', kelas: 'XII TKR 7 (03)', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'w-arya-xii-tsm4-03', username: 'walas_arya_xii_tsm4_03', password: '123', name: 'Arya Yudha Satriatama, S.Pd', role: 'wali_kelas', kelas: 'XII TSM 4 (03)', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-arya-xii-tsm5-03', username: 'walas_arya_xii_tsm5_03', password: '123', name: 'Arya Yudha Satriatama, S.Pd', role: 'wali_kelas', kelas: 'XII TSM 5 (03)', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'w-heri-xii-tsm6-03', username: 'walas_heri_xii_tsm6_03', password: '123', name: 'Heri Supriyanto', role: 'wali_kelas', kelas: 'XII TSM 6 (03)', jurusan_id: JURUSAN_IDS.TSM },
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
