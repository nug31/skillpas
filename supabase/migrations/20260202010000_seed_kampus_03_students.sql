-- Seed students for Kampus 03 classes to populate Walas Insight Dashboard

-- Helper function to get jurusan_id by name
DO $$
DECLARE
  j_mesin uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin');
  j_tkr uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan');
  j_tsm uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor');
  j_elind uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri');
  j_listrik uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik');
  j_kimia uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri');
  j_akuntansi uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi');
  j_hotel uuid := (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan');
  
  l_basic1 uuid := (SELECT id FROM level_skill WHERE urutan = 1);
  l_inter uuid := (SELECT id FROM level_skill WHERE urutan = 2);
  l_adv uuid := (SELECT id FROM level_skill WHERE urutan = 3);
  l_master uuid := (SELECT id FROM level_skill WHERE urutan = 4);
BEGIN

  -- XII TKR 3 03 (User Joko Setyo Nugroho, S.Pd)
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Ahmad Faisal', 'XII TKR 3 03', j_tkr),
    ('Bambang Subianto', 'XII TKR 3 03', j_tkr),
    ('Candra Wijaya', 'XII TKR 3 03', j_tkr),
    ('Dedi Kurniawan', 'XII TKR 3 03', j_tkr),
    ('Eko Prasetyo', 'XII TKR 3 03', j_tkr)
  ON CONFLICT DO NOTHING;

  -- XII TKR 4 03
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Fajar Ramadhan', 'XII TKR 4 03', j_tkr),
    ('Gilang Permana', 'XII TKR 4 03', j_tkr),
    ('Hendra Saputra', 'XII TKR 4 03', j_tkr)
  ON CONFLICT DO NOTHING;

  -- XII TBSM 3 03
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Irfan Hakim', 'XII TBSM 3 03', j_tsm),
    ('Joko Susilo', 'XII TBSM 3 03', j_tsm),
    ('Kukuh Aditama', 'XII TBSM 3 03', j_tsm)
  ON CONFLICT DO NOTHING;

  -- XII ELIN 6 03
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Luluk Maria', 'XII ELIN 6 03', j_elind),
    ('Maman Suratman', 'XII ELIN 6 03', j_elind),
    ('Nanang Kosim', 'XII ELIN 6 03', j_elind)
  ON CONFLICT DO NOTHING;

  -- XII MESIN 4 03
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Oki Setiawan', 'XII MESIN 4 03', j_mesin),
    ('Pandu Winata', 'XII MESIN 4 03', j_mesin),
    ('Qori Ananda', 'XII MESIN 4 03', j_mesin)
  ON CONFLICT DO NOTHING;

  -- XII AKUNTANSI 4 03
  INSERT INTO siswa (nama, kelas, jurusan_id) VALUES
    ('Rina Nose', 'XII AKUNTANSI 4 03', j_akuntansi),
    ('Sule Prikitiw', 'XII AKUNTANSI 4 03', j_akuntansi),
    ('Tukul Arwana', 'XII AKUNTANSI 4 03', j_akuntansi)
  ON CONFLICT DO NOTHING;

  -- Add some initial skills for these students
  INSERT INTO skill_siswa (siswa_id, level_id, skor)
  SELECT s.id, l_basic1, floor(random() * 25)::int
  FROM siswa s
  WHERE s.kelas LIKE '%03'
  AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

END $$;
