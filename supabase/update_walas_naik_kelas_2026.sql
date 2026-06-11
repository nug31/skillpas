-- ===================================================================
-- Update Wali Kelas accounts: Naik Kelas Tahun Ajaran 2026
-- Berdasarkan data terbaru (foto tabel wali kelas)
-- Script ini MENGHAPUS semua walas lama dan memasukkan data baru.
-- ===================================================================

-- 1. Hapus semua data Wali Kelas yang lama
DELETE FROM public.users WHERE role = 'wali_kelas';

-- 2. Insert semua data Wali Kelas yang baru (sudah naik kelas)
INSERT INTO public.users (username, password, name, role, kelas, jurusan_id)
VALUES

    -- ==========================================
    -- KAMPUS MM (01 & 02)
    -- ==========================================

    -- XI CLASSES (naik dari X)
    ('walas_viany_xi_ak1', '123', 'Viany Lingga Revi, S.E', 'wali_kelas', 'XI AK 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_devin_xi_ak2', '123', 'Devin Eldwin, S.Ak', 'wali_kelas', 'XI AK 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_viany_xi_ak3', '123', 'Viany Lingga Revi, S.E', 'wali_kelas', 'XI AK 3', '550e8400-e29b-41d4-a716-446655440007'),

    ('walas_maharani_xi_elin1', '123', 'Maharani Benedicta AP, S.Pd', 'wali_kelas', 'XI ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_serli_xi_elin2', '123', 'Serli Aprodita, S.S', 'wali_kelas', 'XI ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_iqbal_xi_elin3', '123', 'Muhamad Iqbal, S.Pd', 'wali_kelas', 'XI ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_maris_xi_elin4', '123', 'Maristya Catur Dwi Pratiwi', 'wali_kelas', 'XI ELIND 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_maris_xi_elin5', '123', 'Maristya Catur Dwi Pratiwi', 'wali_kelas', 'XI ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),

    ('walas_iwan_xi_hotel', '123', 'Iwan Sutiawan, A.MD', 'wali_kelas', 'XI HOTEL', '550e8400-e29b-41d4-a716-446655440008'),

    ('walas_amalia_xi_titl1', '123', 'Amalia Dewi Lestari, S.Pd', 'wali_kelas', 'XI TITL 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_amalia_xi_titl2', '123', 'Amalia Dewi Lestari, S.Pd', 'wali_kelas', 'XI TITL 2', '550e8400-e29b-41d4-a716-446655440005'),

    ('walas_gesti_xi_mesin1', '123', 'Gesti Khoriunnisa, M.Pd', 'wali_kelas', 'XI MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_pandu_xi_mesin2', '123', 'Pandu Andariansyah, S.Pd', 'wali_kelas', 'XI MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dikky_xi_mesin3', '123', 'M. Dikky Apri Setia Nugraha, S.Pd', 'wali_kelas', 'XI MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),

    ('walas_enggar_xi_tkr1', '123', 'Enggar Fata, S.Pd', 'wali_kelas', 'XI TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_munandar_xi_tkr2', '123', 'Munandar, S.Pd', 'wali_kelas', 'XI TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_sultan_xi_tkr3', '123', 'Sultan Saladdin, S.Pd', 'wali_kelas', 'XI TKR 3', '550e8400-e29b-41d4-a716-446655440002'),

    ('walas_fadly_xi_tsm1', '123', 'Fadly Narendra Utomo, S.Pd', 'wali_kelas', 'XI TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_fadly_xi_tsm2', '123', 'Fadly Narendra Utomo, S.Pd', 'wali_kelas', 'XI TSM 2', '550e8400-e29b-41d4-a716-446655440003'),

    ('walas_haya_xi_tki1', '123', 'Haya Suhaela, S.Pd', 'wali_kelas', 'XI TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_aldy_xi_tki2', '123', 'Moh. Aldy Akbar Supriyadi, S', 'wali_kelas', 'XI TKI 2', '550e8400-e29b-41d4-a716-446655440006'),

    -- XII CLASSES (naik dari XI)
    ('walas_ditta_xii_ak1', '123', 'Ditta Octaviani, S.Pd', 'wali_kelas', 'XII AK 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_retno_xii_ak2', '123', 'Retno Dwi Astuti', 'wali_kelas', 'XII AK 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_fuji_xii_ak3', '123', 'Fuji Sampan Sujana', 'wali_kelas', 'XII AK 3', '550e8400-e29b-41d4-a716-446655440007'),

    ('walas_raihan_xii_elin1', '123', 'Raihan Nurhakim, S.Pd', 'wali_kelas', 'XII ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_eldha_xii_elin2', '123', 'Eldha Luvy Zha', 'wali_kelas', 'XII ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_azzam_xii_elin3', '123', 'Azzam Izzudin Ramadhan', 'wali_kelas', 'XII ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_azzam_xii_elin4', '123', 'Azzam Izzudin Ramadhan', 'wali_kelas', 'XII ELIND 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_fadli_xii_elin5', '123', 'Fadli Maulana, S.Pd', 'wali_kelas', 'XII ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_tidtaya_xii_elin6', '123', 'Tidtaya Puteri Larasanty', 'wali_kelas', 'XII ELIND 6', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_salsa_xii_elin7', '123', 'Salsa Fatia Azhar, S.Pd', 'wali_kelas', 'XII ELIND 7', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_nurmayanti_xii_elin8', '123', 'Nurmayanti, S.Kom', 'wali_kelas', 'XII ELIND 8', '550e8400-e29b-41d4-a716-446655440004'),

    ('walas_putri_xii_hotel', '123', 'Putri Nur Azizah', 'wali_kelas', 'XII HOTEL', '550e8400-e29b-41d4-a716-446655440008'),

    ('walas_tisul_xii_titl1', '123', 'Tri Sulistyaningsih', 'wali_kelas', 'XII TITL 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_tedi_xii_titl2', '123', 'Tedi Setiadi, S.Pd', 'wali_kelas', 'XII TITL 2', '550e8400-e29b-41d4-a716-446655440005'),

    ('walas_nia_xii_mesin1', '123', 'Nia Desnata Hati', 'wali_kelas', 'XII MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_tini_xii_mesin2', '123', 'Tini Nurmala', 'wali_kelas', 'XII MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dwi_xii_mesin3', '123', 'Dwi Nugroho', 'wali_kelas', 'XII MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_nia_xii_mesin4', '123', 'Nia Desnata Hati', 'wali_kelas', 'XII MESIN 4', '550e8400-e29b-41d4-a716-446655440001'),

    ('walas_hafidz_xii_tkr1', '123', 'M. Hafidz Ghufron, S.Pd', 'wali_kelas', 'XII TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_dodi_xii_tkr2', '123', 'Dodi Perdana P', 'wali_kelas', 'XII TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_trisno_xii_tkr3', '123', 'Trisno Ngestuti, S.Pd', 'wali_kelas', 'XII TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_trisno_xii_tkr4', '123', 'Trisno Ngestuti, S.Pd', 'wali_kelas', 'XII TKR 4', '550e8400-e29b-41d4-a716-446655440002'),

    ('walas_diva_xii_tki1', '123', 'Diva Alysha', 'wali_kelas', 'XII TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_isti_xii_tki2', '123', 'Istiqomah', 'wali_kelas', 'XII TKI 2', '550e8400-e29b-41d4-a716-446655440006'),

    ('walas_tri_xii_tsm1', '123', 'Tri Lestari, S.Pd', 'wali_kelas', 'XII TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_nanda_xii_tsm2', '123', 'Nanda Diansyah Dwi Saputro', 'wali_kelas', 'XII TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dede_xii_tsm3', '123', 'Dede Rukmayanti', 'wali_kelas', 'XII TSM 3', '550e8400-e29b-41d4-a716-446655440003'),

    -- ==========================================
    -- KAMPUS 03
    -- ==========================================

    -- XI CLASSES 03 (naik dari X 03)
    ('walas_berty_xi_ak_03', '123', 'Berty Efira, S.S', 'wali_kelas', 'XI AK (03)', '550e8400-e29b-41d4-a716-446655440007'),

    ('walas_ihsan_xi_eli1_03', '123', 'Muhammad Al Ihsan', 'wali_kelas', 'XI ELIND 1 (03)', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_adhista_xi_eli2_03', '123', 'Adhista Cindy Rahmayani, S.Pd', 'wali_kelas', 'XI ELIND 2 (03)', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_adhista_xi_eli3_03', '123', 'Adhista Cindy Rahmayani, S.Pd', 'wali_kelas', 'XI ELIND 3 (03)', '550e8400-e29b-41d4-a716-446655440004'),

    ('walas_imadudin_xi_mes1_03', '123', 'Imadudin Abil Fidaa Ismail', 'wali_kelas', 'XI MESIN 1 (03)', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_novita_xi_mes2_03', '123', 'Novita Hani Pratiwi, S.Tr.T', 'wali_kelas', 'XI MESIN 2 (03)', '550e8400-e29b-41d4-a716-446655440001'),

    ('walas_aji_xi_tkr1_03', '123', 'M Teguh', 'wali_kelas', 'XI TKR 1 (03)', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_bagus_xi_tkr2_03', '123', 'Diah Maulias DP', 'wali_kelas', 'XI TKR 2 (03)', '550e8400-e29b-41d4-a716-446655440002'),

    ('walas_tiara_xi_tsm1_03', '123', 'Tiara Kusuma Dewi, S.Pd', 'wali_kelas', 'XI TSM 1 (03)', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_syafrudin_xi_tsm2_03', '123', 'Syafrudin, S.S', 'wali_kelas', 'XI TSM 2 (03)', '550e8400-e29b-41d4-a716-446655440003'),

    -- XII CLASSES 03 (naik dari XI 03)
    ('walas_diah_xii_ak4_03', '123', 'Diah Maulias Dewi Putri', 'wali_kelas', 'XII AK 4 (03)', '550e8400-e29b-41d4-a716-446655440007'),

    ('walas_danu_xii_eli9_03', '123', 'Danu Purwanto', 'wali_kelas', 'XII ELIND 9 (03)', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ridwan_xii_eli10_03', '123', 'Ridwan, S.Pd', 'wali_kelas', 'XII ELIND 10 (03)', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_lia_xii_eli11_03', '123', 'Lia Yulianti, S.Pd', 'wali_kelas', 'XII ELIND 11 (03)', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_cecep_xii_eli12_03', '123', 'Cecep Bemana Sakti G, S.Pd', 'wali_kelas', 'XII ELIND 12 (03)', '550e8400-e29b-41d4-a716-446655440004'),

    ('walas_ayu_xii_mes5_03', '123', 'Ayu W', 'wali_kelas', 'XII MESIN 5 (03)', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_intan_xii_mes6_03', '123', 'Intan Chaya Nitias', 'wali_kelas', 'XII MESIN 6 (03)', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_intan_xii_mes7_03', '123', 'Intan Chaya Nitias', 'wali_kelas', 'XII MESIN 7 (03)', '550e8400-e29b-41d4-a716-446655440001'),

    ('walas_rahmat_xii_tkr5_03', '123', 'Rahmat Hidayat', 'wali_kelas', 'XII TKR 5 (03)', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_adynda_xii_tkr6_03', '123', 'Adynda Ray Razika, S.Sos', 'wali_kelas', 'XII TKR 6 (03)', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_adynda_xii_tkr7_03', '123', 'Adynda Ray Razika, S.Sos', 'wali_kelas', 'XII TKR 7 (03)', '550e8400-e29b-41d4-a716-446655440002'),

    ('walas_arya_xii_tsm4_03', '123', 'Arya Yudha Satriatama, S.Pd', 'wali_kelas', 'XII TSM 4 (03)', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_arya_xii_tsm5_03', '123', 'Arya Yudha Satriatama, S.Pd', 'wali_kelas', 'XII TSM 5 (03)', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_heri_xii_tsm6_03', '123', 'Heri Supriyanto', 'wali_kelas', 'XII TSM 6 (03)', '550e8400-e29b-41d4-a716-446655440003');
