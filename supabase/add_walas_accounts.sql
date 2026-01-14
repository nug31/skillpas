-- Batch insert Wali Kelas accounts from class list images
INSERT INTO public.users (username, password, name, role, kelas, jurusan_id)
VALUES 
    -- TSM (Jurusan ID: 550e8400-e29b-41d4-a716-446655440003)
    ('walas_okxy', '123', 'Okxy Ixganda, S.Pd', 'wali_kelas', 'X TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dodi', '123', 'Dodi Perdana Putra, S.Pd', 'wali_kelas', 'X TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_tri_lestari', '123', 'Tri Lestari, S.Pd', 'wali_kelas', 'XI TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_nanda', '123', 'Nanda Diansyah, S.Pd', 'wali_kelas', 'XI TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dede', '123', 'Dede Rukmayanti, S.Pd', 'wali_kelas', 'XI TSM 3', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_nasrul', '123', 'Ahmad Nasrul, S.Pd', 'wali_kelas', 'XII TSM 1', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_dafiq', '123', 'Ah. Dafiq Najiyullah, S.Pd.I', 'wali_kelas', 'XII TSM 2', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_hafidz_firdaus', '123', 'Muhamad Hafidz Firdaus Priatama, S.Pd', 'wali_kelas', 'X TSM 1, XII TBSM 3', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_arya_yudha', '123', 'Arya Yudha Satria Tama, S.Pd', 'wali_kelas', 'X TSM 2, XI TSM 5', '550e8400-e29b-41d4-a716-446655440003'),
    ('walas_heri_s', '123', 'Heri Supriyanto, S.Pd', 'wali_kelas', 'XI TSM 6', '550e8400-e29b-41d4-a716-446655440003'),

    -- TKR (Jurusan ID: 550e8400-e29b-41d4-a716-446655440002)
    ('walas_enggar', '123', 'Enggar Fata, S.Pd', 'wali_kelas', 'X TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_tedi', '123', 'Tedi Stiadi, S.Pd', 'wali_kelas', 'X TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_solikin', '123', 'Muhammad Solikin', 'wali_kelas', 'X TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_hafidz_ghufron', '123', 'M. Hafidz Ghufron, S.Pd', 'wali_kelas', 'XI TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_syaifulloh', '123', 'Syaifulloh, S.Pd', 'wali_kelas', 'XI TKR 2, XII Mesin 4', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_abdillah', '123', 'Abdillah Putra, A.Md', 'wali_kelas', 'XI TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_trisno', '123', 'Trisno Ngestuti, S.Pd', 'wali_kelas', 'XI TKR 4, XII TBSM 4', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_maulana', '123', 'Maulana Evendi', 'wali_kelas', 'XII TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_esa', '123', 'Esa Apriyadi, S.Pd', 'wali_kelas', 'XII TKR 2', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_cecep', '123', 'Cecep Bemana Sakti G, S.Pd', 'wali_kelas', 'X TKR 1', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_yanda', '123', 'Yanda Eko Putra, S.Pd', 'wali_kelas', 'X TKR 2, XI ELIND 12', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_rahmat_h', '123', 'Rahmat Hidayat, S.Pd.Gr', 'wali_kelas', 'XI TKR 5', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_syafrudin', '123', 'Syafrudin, S.S', 'wali_kelas', 'XI TKR 7', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_joko', '123', 'Joko Setyo Nugroho, S.Pd', 'wali_kelas', 'XII TKR 3', '550e8400-e29b-41d4-a716-446655440002'),
    ('walas_teguh', '123', 'M. Teguh Suprihatin, S.Psi', 'wali_kelas', 'XII TKR 4', '550e8400-e29b-41d4-a716-446655440002'),

    -- MESIN (Jurusan ID: 550e8400-e29b-41d4-a716-446655440001)
    ('walas_amalia', '123', 'Amalia Dewi Lestari, S.Pd', 'wali_kelas', 'X MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_pandu', '123', 'Pandu Andariansyah', 'wali_kelas', 'X MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dikky', '123', 'M. Dikky Apri Setia Nugraha S.Pd', 'wali_kelas', 'X MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_azhari', '123', 'Azhari Budiriyanto, S.Pd', 'wali_kelas', 'XI MESIN 1, XII Mesin 5', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_tini', '123', 'Tini Nurmala, S.Pd', 'wali_kelas', 'XI MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dita_a', '123', 'Dita Ardianto, S.T', 'wali_kelas', 'XI MESIN 3', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_intan', '123', 'Intan Chaya Ningtyas', 'wali_kelas', 'XII Mesin 1, XI MESIN 6', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_dwi_n', '123', 'Dwi Nugroho, S.T', 'wali_kelas', 'XII Mesin 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_adynda', '123', 'Adynda Ray Razika, S.Sos', 'wali_kelas', 'XII Mesin 3, XI TKR 6', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_imadudin', '123', 'Imadudin Abil Fidaa Ismail', 'wali_kelas', 'X MESIN 1', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_tiara', '123', 'Tiara Kusuma Dewi', 'wali_kelas', 'X MESIN 2', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_ayu', '123', 'Ayu Warestu, S.Pd', 'wali_kelas', 'XI MESIN 5', '550e8400-e29b-41d4-a716-446655440001'),
    ('walas_novita', '123', 'Novita Hani Pratiwi, S.T', 'wali_kelas', 'XI MESIN 7', '550e8400-e29b-41d4-a716-446655440001'),

    -- ELIND (Jurusan ID: 550e8400-e29b-41d4-a716-446655440004)
    ('walas_maharani', '123', 'Maharani', 'wali_kelas', 'X ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_serli', '123', 'Serli Aprodita, S.S', 'wali_kelas', 'X ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_iqbal', '123', 'Muhamad Iqbal, S.Pd', 'wali_kelas', 'X ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_septiawan', '123', 'Septiawan Filtra Santosa, S.Pd, Gr', 'wali_kelas', 'X ELIND 4, XII ELIN 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_aldy', '123', 'M. Aldy Akbar Suopriadi, S.Pd', 'wali_kelas', 'X ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_maris', '123', 'Maris Catur Dwi Pratiwi', 'wali_kelas', 'XI ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_bagus', '123', 'Bagus Kurniawan', 'wali_kelas', 'XI ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_suhaimi', '123', 'Ahmad Suhaimi, S.Pd', 'wali_kelas', 'XI ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ditta', '123', 'Ditta Oktaviani', 'wali_kelas', 'XI ELIND 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_fadli', '123', 'M. Fadli Maulana, S.Pd', 'wali_kelas', 'XI ELIND 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_tidtaya', '123', 'Tidtaya Puteri Larasanty', 'wali_kelas', 'XI ELIND 6', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_salsa', '123', 'Salsa fatia Azhar', 'wali_kelas', 'XI ELIND 7', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_nurmayanti', '123', 'Nurmayanti, S.Kom', 'wali_kelas', 'XI ELIND 8', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_feri', '123', 'Feri Hapsara, S.Pd. Gr', 'wali_kelas', 'XII ELIN 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_azzam', '123', 'Azzam Izzudin Ramadhan, S.Pd', 'wali_kelas', 'XII ELIN 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ambar', '123', 'Ambar Tri Laksono, S.Pd, Gr', 'wali_kelas', 'XII ELIN 4', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_raihan', '123', 'Raihan Nurhakim, S.Pd', 'wali_kelas', 'XII ELIN 5', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_berty', '123', 'Berty Efira', 'wali_kelas', 'X ELIND 1', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_eldha', '123', 'Eldha Luvy Zha, A.Md', 'wali_kelas', 'X ELIND 2', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_adhista', '123', 'Adhista Cindy Rahmayani, S.Pd', 'wali_kelas', 'X ELIND 3', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_danu', '123', 'Danu Purwanto, S.Pd', 'wali_kelas', 'XI ELIND 9', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ridwan', '123', 'Ridwan, S.Pd', 'wali_kelas', 'XI ELIND 10', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_lia_y', '123', 'Lia Yulianti', 'wali_kelas', 'XI ELIND 11', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_noval', '123', 'Noval Al Mahdy, S.Pd', 'wali_kelas', 'XII ELIN 6', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_ihsan', '123', 'Muhammad Al Ihsan, S.Pd', 'wali_kelas', 'XII ELIN 7', '550e8400-e29b-41d4-a716-446655440004'),
    ('walas_tri_s', '123', 'Tri Sulistyaningsih, S.S', 'wali_kelas', 'XII ELIN 8', '550e8400-e29b-41d4-a716-446655440004'),

    -- LISTRIK (Jurusan ID: 550e8400-e29b-41d4-a716-446655440005)
    ('walas_gesti', '123', 'Gesti Khoriunnisa', 'wali_kelas', 'X LISTRIK 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_munandar', '123', 'Munandar, S.Pd', 'wali_kelas', 'X LISTRIK 2', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_retno', '123', 'Retno Dwi Astuti', 'wali_kelas', 'XI TITL 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_iwan', '123', 'Iwan Sutiawan', 'wali_kelas', 'XI TITL 2', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_ressa', '123', 'Ressa Hadi Purwoko, S.Pd', 'wali_kelas', 'XII Listrik 1', '550e8400-e29b-41d4-a716-446655440005'),
    ('walas_astri', '123', 'Astri Afmi Wulandari, S.Pd', 'wali_kelas', 'XII Listrik 2', '550e8400-e29b-41d4-a716-446655440005'),

    -- AKUNTANSI (Jurusan ID: 550e8400-e29b-41d4-a716-446655440007)
    ('walas_nia', '123', 'Nia Desnata Hati, S.Pd', 'wali_kelas', 'X AKUNTANSI 1, XI MESIN 4', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_devin', '123', 'Devin Eldwin, S.Ak', 'wali_kelas', 'X AKUNTANSI 2', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_viany', '123', 'Viany Lingga Revi, S.E', 'wali_kelas', 'X AKUNTANSI 3, XI AKUNTANSI 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_alyfia', '123', 'Alyfia Azahra', 'wali_kelas', 'XI AKUNTANSI 2, XII Akuntansi 4', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_fuji', '123', 'Fuji Sampan Suiana, S.Pd', 'wali_kelas', 'XI AKUNTANSI 3', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_kiki', '123', 'Kiki Widhia S.', 'wali_kelas', 'XII Akuntansi 1', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_fadly', '123', 'Fadly Narendra Utomo', 'wali_kelas', 'XII Akuntansi 2, XI TSM 4', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_nida', '123', 'Nida Apriliatul Hasanah, S.Pd', 'wali_kelas', 'XII Akuntansi 3', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_dwi_fajar', '123', 'Dwi fajar, S.Pd', 'wali_kelas', 'X AKUNTANSI', '550e8400-e29b-41d4-a716-446655440007'),
    ('walas_diah', '123', 'Diah Maulias Dewi P, S.Pd', 'wali_kelas', 'XI AKUNTANSI 4', '550e8400-e29b-41d4-a716-446655440007'),

    -- HOTEL (Jurusan ID: 550e8400-e29b-41d4-a716-446655440008)
    ('walas_refty', '123', 'Refty Royan J, S.Pd', 'wali_kelas', 'X HOTEL', '550e8400-e29b-41d4-a716-446655440008'),
    ('walas_putri_n', '123', 'Putri Nur Azizah, S.S', 'wali_kelas', 'XI PERHOTELAN', '550e8400-e29b-41d4-a716-446655440008'),
    ('walas_aula', '123', 'Aula Al Layali, S.Pd', 'wali_kelas', 'XII Perhotelan', '550e8400-e29b-41d4-a716-446655440008'),

    -- TKI/KIMIA (Jurusan ID: 550e8400-e29b-41d4-a716-446655440006)
    ('walas_haya', '123', 'Haya Suhaela', 'wali_kelas', 'X TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_ryo', '123', 'Ryo Maytana, S.Pd', 'wali_kelas', 'X TKI 2', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_diva', '123', 'Diva Alysha', 'wali_kelas', 'XI TKI 1', '550e8400-e29b-41d4-a716-446655440006'),
    ('walas_istiqomah', '123', 'Istiqomah, S.Pd', 'wali_kelas', 'XI TKI 2', '550e8400-e29b-41d4-a716-446655440006')
ON CONFLICT (username) DO UPDATE SET
    name = EXCLUDED.name,
    kelas = EXCLUDED.kelas,
    jurusan_id = EXCLUDED.jurusan_id;
