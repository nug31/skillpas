-- ===================================================================
-- Batch update Wali Kelas accounts: KAMPUS 01, 02, & 03 (Total 100 Rows)
-- This script WIPES existing walas accounts and replaces them.
-- ===================================================================

-- 1. Clear existing Wali Kelas data
DELETE FROM public.users WHERE role = 'wali_kelas';

-- 2. Insert all Wali Kelas accounts
INSERT INTO public.users (username, password, name, role, kelas, jurusan_id)
VALUES 
    -- ==========================================
    -- KAMPUS 01 & 02 (66 Rows)
    -- ==========================================
    -- X CLASSES
    ('walas_fadly_x_tsm1', '123', 'Fadly Narendra U, S.Pd', 'wali_kelas', 'X TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_fadly_x_tsm2', '123', 'Fadly Narendra U, S.Pd', 'wali_kelas', 'X TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_enggar_x_tkr1', '123', 'Enggar Fata, S.Pd', 'wali_kelas', 'X TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_munandar_x_tkr2', '123', 'Munandar, S.Pd', 'wali_kelas', 'X TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_solkin_x_tkr3', '123', 'Muhammad Solkin', 'wali_kelas', 'X TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_gesti_x_mesin1', '123', 'Gesti Khoriunnisa', 'wali_kelas', 'X MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_pandu_x_mesin2', '123', 'Pandu Andariansyah', 'wali_kelas', 'X MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dikky_x_mesin3', '123', 'M. Dikky Apri Setia Nugraha S.Pd', 'wali_kelas', 'X MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_viany_x_ak1', '123', 'Viany Lingga Revi,S.E', 'wali_kelas', 'X AKUNTANSI 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_devin_x_ak2', '123', 'Devin Eldwin, S.Ak', 'wali_kelas', 'X AKUNTANSI 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_viany_x_ak3', '123', 'Viany Lingga Revi,S.E', 'wali_kelas', 'X AKUNTANSI 3', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_amalia_x_lis1', '123', 'Amalia Dewi Lestari, S.Pd', 'wali_kelas', 'X LISTRIK 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_amalia_x_lis2', '123', 'Amalia Dewi Lestari, S.Pd', 'wali_kelas', 'X LISTRIK 2', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_maharani_x_elin1', '123', 'Maharani', 'wali_kelas', 'X ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_serli_x_elin2', '123', 'Serli Aprodita, S.S', 'wali_kelas', 'X ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_iqbal_x_elin3', '123', 'Muhamad Iqbal, S.Pd', 'wali_kelas', 'X ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_maris_x_elin4', '123', 'Maris Catur Dwi Pratiwi', 'wali_kelas', 'X ELIND 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_maris_x_elin5', '123', 'Maris Catur Dwi Pratiwi', 'wali_kelas', 'X ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_iwan_x_hotel', '123', 'Iwan Sutiawan', 'wali_kelas', 'X HOTEL', '550e8400-e29b-41d4-a716-446655440008'),
    ('walas_haya_x_tki1', '123', 'Haya Suhaela', 'wali_kelas', 'X TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_aldy_x_tki2', '123', 'M. Aldy Akbar Suopriadi, S.Pd', 'wali_kelas', 'X TKI 2', '550e8400-e29b-41d4-a716-446655440006'),

    -- XI CLASSES
    ('walas_tri_xi_tsm1', '123', 'Tri Lestari, S.Pd', 'wali_kelas', 'XI TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_nanda_xi_tsm2', '123', 'Nanda Diansyah, S.Pd', 'wali_kelas', 'XI TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dede_xi_tsm3', '123', 'Dede Rukmayanti, S.Pd', 'wali_kelas', 'XI TSM 3', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_raihan_xi_elin1', '123', 'Raihan Nurhakim, S.Pd', 'wali_kelas', 'XI ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_eldha_xi_elin2', '123', 'Eldha Luvy Zha, A.Md', 'wali_kelas', 'XI ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_azzam_xi_elin3', '123', 'Azzam Izzudin Ramadhan, S.Pd', 'wali_kelas', 'XI ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_azzam_xi_elin4', '123', 'Azzam Izzudin Ramadhan, S.Pd', 'wali_kelas', 'XI ELIND 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_fadli_xi_elin5', '123', 'M. Fadli Maulana, S.Pd', 'wali_kelas', 'XI ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_tidtaya_xi_elin6', '123', 'Tidtaya Puteri Larasanty', 'wali_kelas', 'XI ELIND 6', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_salsa_xi_elin7', '123', 'Salsa fatia Azhar', 'wali_kelas', 'XI ELIND 7', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_nurmayanti_xi_elin8', '123', 'Nurmayanti, S.Kom', 'wali_kelas', 'XI ELIND 8', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_tisul_xi_titl1', '123', 'Tri Sulistyaningsih, S.S', 'wali_kelas', 'XI TITL 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_tedi_xi_titl2', '123', 'Tedi Stiadi, S.Pd', 'wali_kelas', 'XI TITL 2', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_nia_xi_mesin1', '123', 'Nia Desnata Hati, S.Pd', 'wali_kelas', 'XI MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_tini_xi_mesin2', '123', 'Tini Nurmala, S.Pd', 'wali_kelas', 'XI MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dita_xi_mesin3', '123', 'Dita Ardianto, S.T', 'wali_kelas', 'XI MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_nia_xi_mesin4', '123', 'Nia Desnata Hati, S.Pd', 'wali_kelas', 'XI MESIN 4', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_hafidz_xi_tkr1', '123', 'M. Hafidz Ghufron, S.Pd', 'wali_kelas', 'XI TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_dodi_xi_tkr2', '123', 'Dodi Perdana Putra, S.Pd', 'wali_kelas', 'XI TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_trisno_xi_tkr3', '123', 'Trisno Ngestuti, S.Pd', 'wali_kelas', 'XI TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_trisno_xi_tkr4', '123', 'Trisno Ngestuti, S.Pd', 'wali_kelas', 'XI TKR 4', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_diva_xi_tki1', '123', 'Diva Alysha', 'wali_kelas', 'XI TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_isti_xi_tki2', '123', 'Istiqomah, S.Pd', 'wali_kelas', 'XI TKI 2', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_ditta_xi_ak1', '123', 'Ditta Oktaviani', 'wali_kelas', 'XI AKUNTANSI 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_retno_xi_ak2', '123', 'Retno Dwi Astuti', 'wali_kelas', 'XI AKUNTANSI 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_fuji_xi_ak3', '123', 'Fuji Sampan Sujana, S.Pd', 'wali_kelas', 'XI AKUNTANSI 3', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_putri_xi_hotel', '123', 'Putri Nur Azizah, S.S', 'wali_kelas', 'XI PERHOTELAN', '550e8400-e29b-41d4-a716-446655440008'),

    -- XII CLASSES
    ('walas_nasrul_xii_tsm1', '123', 'Ahmad Nasrul, S.Pd', 'wali_kelas', 'XII TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dafiq_xii_tsm2', '123', 'Ah. Dafiq Najiyullah, S.Pd.I', 'wali_kelas', 'XII TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_maulana_xii_tkr1', '123', 'Maulana Evendi', 'wali_kelas', 'XII TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_esa_xii_tkr2', '123', 'Esa Apriyadi, S.Pd', 'wali_kelas', 'XII TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_feri_xii_elin1', '123', 'Feri Hapsara, S.Pd. Gr', 'wali_kelas', 'XII ELIN 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_septi_xii_elin2', '123', 'Septiawan Filtra Santosa, S.Pd, Gr', 'wali_kelas', 'XII ELIN 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_suhaimi_xii_elin3', '123', 'Ahmad Suhaimi, S.Pd', 'wali_kelas', 'XII ELIN 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ambar_xii_elin4', '123', 'Ambar Tri Laksono, S.Pd,Gr.', 'wali_kelas', 'XII ELIN 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_septi_xii_elin5', '123', 'Septiawan Filtra Santosa, S.Pd, Gr', 'wali_kelas', 'XII ELIN 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ressa_xii_lis1', '123', 'Ressa Hadi Purwoko, S.Pd', 'wali_kelas', 'XII Listrik 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_astri_xii_lis2', '123', 'Astri Afmi Wulandari, S.Pd', 'wali_kelas', 'XII Listrik 2', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_azhari_xii_mesin1', '123', 'Azhari Budiriyanto, S.Pd', 'wali_kelas', 'XII Mesin 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_azhari_xii_mesin2', '123', 'Azhari Budiriyanto, S.Pd', 'wali_kelas', 'XII Mesin 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dwinu_xii_mesin3', '123', 'Dwi Nugroho, S.T./Dynda', 'wali_kelas', 'XII Mesin 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_alyfia_xii_ak1', '123', 'Alyfia Azahra', 'wali_kelas', 'XII Akuntansi 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_alyfia_xii_ak2', '123', 'Alyfia Azahra', 'wali_kelas', 'XII Akuntansi 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_nida_xii_ak3', '123', 'Nida Apriliatul Hasanah, S.Pd', 'wali_kelas', 'XII Akuntansi 3', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_aula_xii_hotel', '123', 'Aula Al Layali, S.Pd', 'wali_kelas', 'XII Perhotelan', '550e8400-e29b-41d4-a716-446655440008'),

    -- ==========================================
    -- KAMPUS 03 (34 Rows) - Added "03" to classes
    -- ==========================================
    ('walas_tiara_x_tsm1_03', '123', 'Tiara Kusuma Dewi', 'wali_kelas', 'X TSM 1 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_syafrudin_x_tsm2_03', '123', 'Syafrudin', 'wali_kelas', 'X TSM 2 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_aji_x_tkr1_03', '123', 'Aji Rangga Yasa', 'wali_kelas', 'X TKR 1 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_bagus_x_tkr2_03', '123', 'Bagus Kurniawan, S.Pd', 'wali_kelas', 'X TKR 2 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_imadudin_x_mes1_03', '123', 'Imadudin Abil Fidaa Ismail', 'wali_kelas', 'X MESIN 1 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_novita_x_mes2_03', '123', 'Novita Hani Pratiwi, S.T', 'wali_kelas', 'X MESIN 2 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_berty_x_ak_03', '123', 'Berty Efira F', 'wali_kelas', 'X AKUNTANSI 03', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_ihsan_x_eli1_03', '123', 'Muhammad Al Ihsan, S.Pd', 'wali_kelas', 'X ELIND 1 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_adhista_x_eli2_03', '123', 'Adhista Cindy Rahmayani, S.Pd/Eldha', 'wali_kelas', 'X ELIND 2 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_adhista_x_eli3_03', '123', 'Adhista Cindy Rahmayani, S.Pd', 'wali_kelas', 'X ELIND 3 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_arya_xi_tsm4_03', '123', 'Arya Yudha Satria Tama, S.Pd', 'wali_kelas', 'XI TSM 4 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_arya_xi_tsm5_03', '123', 'Arya Yudha Satria Tama, S.Pd', 'wali_kelas', 'XI TSM 5 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_heri_xi_tsm6_03', '123', 'Heri Supriyanto, S.Pd', 'wali_kelas', 'XI TSM 6 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_rahmat_xi_tkr5_03', '123', 'Rahmat Hidayat, S.Pd.Gr', 'wali_kelas', 'XI TKR 5 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_adynda_xi_tkr6_03', '123', 'Adynda Ray R, S.Sos', 'wali_kelas', 'XI TKR 6 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_adynda_xi_tkr7_03', '123', 'Adynda Ray R, S.Sos', 'wali_kelas', 'XI TKR 7 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_ayu_xi_mes5_03', '123', 'Ayu Warestu, S.Pd', 'wali_kelas', 'XI MESIN 5 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_intan_xi_mes6_03', '123', 'Intan Chaya Ningtyas', 'wali_kelas', 'XI MESIN 6 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_intan_xi_mes7_03', '123', 'Intan Chaya Ningtyas', 'wali_kelas', 'XI MESIN 7 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_danu_xi_eli9_03', '123', 'Danu Purwanto, S.Pd', 'wali_kelas', 'XI ELIND 9 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ridwan_xi_eli10_03', '123', 'Ridwan, S.Pd', 'wali_kelas', 'XI ELIND 10 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_lia_xi_eli11_03', '123', 'Lia Yulianti, S.Pd', 'wali_kelas', 'XI ELIND 11 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_cecep_xi_eli12_03', '123', 'Cecep Bemana Sakti G, S.Pd', 'wali_kelas', 'XI ELIND 12 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_diah_xi_ak4_03', '123', 'Diah Maulias Dewi P, S.Pd', 'wali_kelas', 'XI AKUNTANSI 4 03', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_hafidz_xii_tbsm3_03', '123', 'Muhamad Hafidz Firdaus Priatama, S.Pd', 'wali_kelas', 'XII TBSM 3 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_hafidz_xii_tbsm4_03', '123', 'Muhamad Hafidz Firdaus Priatama, S.Pd', 'wali_kelas', 'XII TBSM 4 03', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_joko_xii_tkr3_03', '123', 'Joko Setyo Nugroho, S.Pd', 'wali_kelas', 'XII TKR 3 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_teguh_xii_tkr4_03', '123', 'M. Teguh Suprihatin, S.Psi', 'wali_kelas', 'XII TKR 4 03', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_noval_xii_eli6_03', '123', 'Noval Al Mahdy, S.Pd', 'wali_kelas', 'XII ELIN 6 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_yanda_xii_eli7_03', '123', 'Yanda Eko Putra, S.Pd', 'wali_kelas', 'XII ELIN 7 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_yanda_xii_eli8_03', '123', 'Yanda Eko Putra, S.Pd', 'wali_kelas', 'XII ELIN 8 03', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_syaiful_xii_mes4_03', '123', 'Syaifulloh, S.Pd', 'wali_kelas', 'XII MESIN 4 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_syaiful_xii_mes5_03', '123', 'Syaifulloh, S.Pd', 'wali_kelas', 'XII MESIN 5 03', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dwifajar_xii_ak4_03', '123', 'Dwi fajar, S.Pd', 'wali_kelas', 'XII AKUNTANSI 4 03', '550e8400-e29b-41d4-a716-446655440007');
