import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Trash2, Download, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan, LevelSkill, StudentListItem } from '../types';
import { LevelTable } from './LevelTable';
import { StudentRace } from './StudentRace';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import formatClassLabel from '../lib/formatJurusan';
import ImportStudents from './ImportStudents';
import { StudentTable } from './StudentTable';
import StudentDetailModal from './StudentDetailModal';

interface JurusanDetailPageProps {
  jurusan: Jurusan;
  onBack: () => void;
  classFilter?: string;
}

export function JurusanDetailPage({ jurusan, onBack, classFilter }: JurusanDetailPageProps) {
  const { isTeacher, user } = useAuth();
  const [levels, setLevels] = useState<LevelSkill[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);
  const [direction, setDirection] = useState(0); // For slide animations: -1 or 1

  const IconComponent = (LucideIcons as any)[jurusan.icon] || LucideIcons.GraduationCap;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [jurusan.id]);

  async function loadData(silent = false) {
    try {
      if (!silent) setLoading(true);

      const useMock = isMockMode;

      if (useMock) {
        // Read from mockData (merged per-jurusan overrides)
        setLevels(mockData.getLevelsForJurusan(jurusan.id));
        const list = mockData.getStudentListForJurusan(jurusan.id);
        setStudents(list);
        setLoading(false);
        return;
      }

      const [levelsResult, overridesResult] = await Promise.all([
        supabase.from('level_skill').select('*').order('urutan'),
        supabase
          .from('level_skill_jurusan')
          .select('*')
          .eq('jurusan_id', jurusan.id)
      ]);

      if (levelsResult.error) throw levelsResult.error;
      if (overridesResult.error) throw overridesResult.error;

      // Fetch students iteratively to bypass 1000-row limit
      let allStudentsData: any[] = [];
      let offset = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await supabase
          .from('siswa')
          .select('id, nama, kelas, nisn, skill_siswa(skor, poin, level_id), competency_history(*)')
          .eq('jurusan_id', jurusan.id)
          .range(offset, offset + pageSize - 1)
          .setHeader('pragma', 'no-cache')
          .setHeader('cache-control', 'no-cache');

        if (error) throw error;
        if (data && data.length > 0) {
          allStudentsData = [...allStudentsData, ...data];
          offset += pageSize;
          hasMore = data.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      // ensure the Supabase result is treated as LevelSkill[] so the typechecker is happy
      const levelsData = (levelsResult.data || []) as LevelSkill[];
      const overrides = overridesResult.data || [];

      // Parse criteria from hasil_belajar if it looks like JSON
      const parsedLevels = levelsData.map(l => {
        // Look for override
        const ov = overrides.find((o: any) => o.level_id === l.id);
        const finalHasilBelajar = ov?.hasil_belajar || l.hasil_belajar;
        const finalSoftSkill = ov?.soft_skill || l.soft_skill;

        let criteria: string[] = [];
        try {
          if (finalHasilBelajar && finalHasilBelajar.trim().startsWith('[')) {
            criteria = JSON.parse(finalHasilBelajar);
          } else if (finalHasilBelajar) {
            criteria = [finalHasilBelajar];
          }
        } catch (e) {
          criteria = [finalHasilBelajar];
        }
        return { ...l, hasil_belajar: finalHasilBelajar, soft_skill: finalSoftSkill, criteria };
      });

      setLevels(parsedLevels);

      const studentList: StudentListItem[] = allStudentsData
        .map((siswa: any) => {
          const latestSkill = Array.isArray(siswa.skill_siswa) ? siswa.skill_siswa[0] : null;
          const skor = latestSkill?.skor ?? 0;

          // Find the correct level based on score
          const level = parsedLevels.find(l => skor >= l.min_skor && skor <= l.max_skor)
            || parsedLevels[0];

          return {
            id: siswa.id,
            nama: siswa.nama,
            kelas: siswa.kelas || 'X',
            nisn: siswa.nisn,
            skor: skor,
            poin: latestSkill?.poin ?? ((level?.urutan || 1) * 50 + 50),
            badge_name: (level?.badge_name || 'Basic') as any,
            badge_color: level?.badge_color || '#94a3b8',
            level_name: level?.nama_level || 'Pemula',
            avatar_url: siswa.avatar_url,
            photo_url: siswa.photo_url,
            riwayat_kompetensi: siswa.competency_history || []
          } as StudentListItem;
        });

      setStudents(studentList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditScore(siswaId: string, newSkor: number) {
    const useMock = isMockMode;
    try {
      setLoading(true);

      if (useMock) {
        // mutate mock data in memory and update students state
        const idx = mockData.mockSkillSiswa.findIndex((r) => r.siswa_id === siswaId);
        const levelObj = mockData.mockLevels.find((l) => newSkor >= l.min_skor && newSkor <= l.max_skor) || mockData.mockLevels[0];
        const newPoin = levelObj.urutan * 50 + 50;

        if (idx >= 0) {
          mockData.mockSkillSiswa[idx].skor = newSkor;
          mockData.mockSkillSiswa[idx].poin = newPoin;
          mockData.mockSkillSiswa[idx].level_id = levelObj.id;
          mockData.mockSkillSiswa[idx].updated_at = new Date().toISOString();
        } else {
          mockData.mockSkillSiswa.push({
            id: `ss-${siswaId}-${Date.now()}`,
            siswa_id: siswaId,
            level_id: levelObj.id,
            skor: newSkor,
            poin: newPoin,
            tanggal_pencapaian: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // refresh students from mockData
        const list = mockData.getStudentListForJurusan(jurusan.id);
        setStudents(list);
        return;
      }

      // determine level id based on current levels
      const level = levels.find((l) => newSkor >= l.min_skor && newSkor <= l.max_skor);
      const levelId = level ? level.id : levels[0]?.id;
      const newPoin = (level?.urutan ?? 1) * 50 + 50;

      // Delete existing score first (optional but keeps DB clean)
      const { error: delError } = await supabase.from('skill_siswa').delete().eq('siswa_id', siswaId);
      if (delError) throw delError;

      const { error } = await supabase.from('skill_siswa').insert({
        siswa_id: siswaId,
        level_id: levelId,
        skor: newSkor,
        poin: newPoin
      });
      if (error) throw error;

      // refresh silently
      await loadData(true);
    } catch (err) {
      console.error('Error saving score:', err);
      // rollback if needed (loadData will handle it)
      await loadData();
      throw err;
    } finally {
      if (!useMock) setLoading(false);
    }
  }

  async function handleUpdateCriteria(levelId: string, criteria: string[]) {
    const useMock = isMockMode;
    try {
      // Optimistic update: Update local state immediately for instant feedback
      setLevels(prevLevels => prevLevels.map(level =>
        level.id === levelId
          ? { ...level, criteria, hasil_belajar: JSON.stringify(criteria) }
          : level
      ));

      if (useMock) {
        // find existing override
        const idx = mockData.mockLevelOverrides.findIndex((o) => o.jurusan_id === jurusan.id && o.level_id === levelId);
        if (idx >= 0) {
          mockData.mockLevelOverrides[idx].criteria = criteria;
          mockData.mockLevelOverrides[idx].hasil_belajar = JSON.stringify(criteria);
        } else {
          mockData.mockLevelOverrides.push({
            jurusan_id: jurusan.id,
            level_id: levelId,
            criteria: criteria,
            hasil_belajar: JSON.stringify(criteria)
          });
        }
        // Refresh data to ensure all state is in sync with mock data
        await loadData();
        return;
      }

      // upsert into new table level_skill_jurusan
      // We store the array as a JSON string in 'hasil_belajar' column
      const hasilBelajarJson = JSON.stringify(criteria);

      const { error } = await supabase
        .from('level_skill_jurusan')
        .upsert({
          jurusan_id: jurusan.id,
          level_id: levelId,
          hasil_belajar: hasilBelajarJson
        }, { onConflict: 'jurusan_id,level_id' });

      if (error) {
        // Rollback optimistic update on error
        await loadData();
        throw error;
      }

      // Success! Refresh silently to ensure everything is in sync
      await loadData(true);
    } catch (err) {
      console.error('Error updating criteria:', err);
      // rollback is already handled by loadData() or above setLevels
      throw err;
    }
  }

  const [activeTab, setActiveTab] = useState<string>('all');

  // Memoize unique classes for this jurusan, sorted naturally
  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map(s => s.kelas.trim()));
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return Array.from(classes).sort(collator.compare);
  }, [students]);

  const allNavOptions = useMemo(() => ['all', 'X', 'XI', 'XII', ...uniqueClasses], [uniqueClasses]);

  const handleTabChange = (newTab: string) => {
    const prevIndex = allNavOptions.indexOf(activeTab);
    const nextIndex = allNavOptions.indexOf(newTab);
    setDirection(nextIndex > prevIndex ? 1 : -1);
    setActiveTab(newTab.trim());
  };

  // 1. Filter by class first (Base dataset for this page view)
  const classFilteredStudents = useMemo(() => {
    // Normalization helper for robust matching
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');
    const target = activeTab.trim();
    const targetNorm = norm(target);

    return students.filter((s) => {
      const cls = s.kelas.trim();
      const clsNorm = norm(cls);

      // If we have a forced prop filter (Student View), use it.
      if (classFilter) {
        const cf = classFilter.trim();
        const cfNorm = norm(cf);
        return clsNorm === cfNorm || clsNorm.startsWith(cfNorm);
      }
      // Teacher View
      if (target === 'all') return true;
      if (['X', 'XI', 'XII'].includes(target)) {
        return cls.startsWith(target + ' ');
      }
      return clsNorm === targetNorm;
    });
  }, [students, activeTab, classFilter]);

  // 2. Filter by level (For the table display)
  const filteredStudents = useMemo(() => {
    return classFilteredStudents.filter((s) => {
      if (selectedLevel === 'all') return true;
      const level = levels.find((l) => l.id === selectedLevel);
      return !!(level && s.skor >= level.min_skor && s.skor <= level.max_skor);
    });
  }, [classFilteredStudents, selectedLevel, levels]);

  // compute ranks (1-based) for ALL students in this class context, sorted by score
  const topRanks: Record<string, number> = {};
  (() => {
    const sorted = [...classFilteredStudents].sort((a, b) => b.skor - a.skor);
    sorted.forEach((s, idx) => { topRanks[s.id] = idx + 1; });
  })();

  const handleExportExcel = () => {
    const csvContent = [
      ['Nama Siswa', 'Kelas', 'Skor', 'Badge', 'Level'],
      ...filteredStudents.map((s) => [s.nama, formatClassLabel(jurusan.nama_jurusan, s.kelas), s.skor, s.badge_name, s.level_name]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${jurusan.nama_jurusan} _students.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    alert('Export PDF akan segera tersedia. Untuk sementara, gunakan fungsi Print Browser (Ctrl+P) dan pilih Save as PDF.');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Beranda</span>
        </button>

        <div className="card-glass rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--text-primary)] mb-2">
                {jurusan.nama_jurusan} {classFilter ? `- Kelas ${classFilter} ` : ''}
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-[color:var(--text-muted)] line-clamp-1">{jurusan.deskripsi}</p>
                <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
                <span className="text-[10px] whitespace-nowrap bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase tracking-widest">
                  {students.length} Total Data Terdeteksi
                </span>
                <div className={`text-[10px] px-2 py-0.5 rounded-full border font-black tracking-widest uppercase flex items-center gap-1.5 ${isMockMode ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isMockMode ? 'bg-red-500 animate-pulse' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'}`} />
                  DATABASE: {isMockMode ? 'DEMO' : 'REAL'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-[color:var(--accent-1)]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Tabs for Teachers */}
            {/* Class Slider View */}
            {!classFilter && isTeacher && (
              <div className="mb-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-[color:var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      Pilih Kelas
                    </h3>
                    <div className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">
                      {uniqueClasses.length} KELAS TERDETEKSI
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x scroll-smooth px-2">
                      {/* Special "All" Slide */}
                      <button
                        onClick={() => handleTabChange('all')}
                        className={`flex-shrink-0 snap-start min-w-[140px] p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${activeTab === 'all'
                          ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/30 text-white'
                          : 'bg-[color:var(--card-bg)] border-[color:var(--card-border)] text-[color:var(--text-muted)] hover:border-white/20 hover:bg-white/5'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeTab === 'all' ? 'bg-white/20' : 'bg-black/20'}`}>
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Semua Kelas</span>
                      </button>

                      {/* Year Level Slides */}
                      {['X', 'XI', 'XII'].map((year) => {
                        const isYearSelected = activeTab === year;
                        return (
                          <button
                            key={year}
                            onClick={() => handleTabChange(year)}
                            className={`flex-shrink-0 snap-start min-w-[140px] p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${isYearSelected
                              ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/30 text-white'
                              : 'bg-[color:var(--card-bg)] border-[color:var(--card-border)] text-[color:var(--text-muted)] hover:border-white/20 hover:bg-white/5'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isYearSelected ? 'bg-white/20' : 'bg-black/20'}`}>
                              <span className="font-black text-xs">{year}</span>
                            </div>
                            <span className="font-bold text-sm">Total {year}</span>
                          </button>
                        );
                      })}

                      {/* Specific Class Slides */}
                      {uniqueClasses.map((className) => {
                        const isSelected = activeTab === className;
                        const label = formatClassLabel(jurusan.nama_jurusan, className);

                        return (
                          <button
                            key={className}
                            onClick={() => handleTabChange(className)}
                            className={`flex-shrink-0 snap-start min-w-[140px] p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${isSelected
                              ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-500/30 text-white'
                              : 'bg-[color:var(--card-bg)] border-[color:var(--card-border)] text-[color:var(--text-muted)] hover:border-white/20 hover:bg-white/5'
                              }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-black/20'}`}>
                              <span className="font-black text-[10px]">{label.split(' ').pop()}</span>
                            </div>
                            <span className="font-bold text-xs truncate w-full text-center">{label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Desktop Overlay Hints */}
                    <div className="hidden group-hover:flex absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 items-center justify-center bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white pointer-events-none transition-opacity">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                    <div className="hidden group-hover:flex absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 items-center justify-center bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white pointer-events-none transition-opacity">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Class Content Carousel */}
            <div className="relative">
              {/* Floating Slide Navigation Arrows */}
              {!classFilter && isTeacher && (
                <>
                  <button
                    onClick={() => {
                      const idx = allNavOptions.indexOf(activeTab);
                      if (idx > 0) handleTabChange(allNavOptions[idx - 1]);
                    }}
                    className={`fixed left-4 top-1/2 -translate-y-1/2 z-[100] p-5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-indigo-600 transition-all shadow-2xl hover:scale-110 active:scale-95 group/btn ${allNavOptions.indexOf(activeTab) === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronLeft className="w-8 h-8 group-hover/btn:-translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => {
                      const idx = allNavOptions.indexOf(activeTab);
                      if (idx < allNavOptions.length - 1) handleTabChange(allNavOptions[idx + 1]);
                    }}
                    className={`fixed right-4 top-1/2 -translate-y-1/2 z-[100] p-5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white hover:bg-indigo-600 transition-all shadow-2xl hover:scale-110 active:scale-95 group/btn ${allNavOptions.indexOf(activeTab) === allNavOptions.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                  >
                    <ChevronRight className="w-8 h-8 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </>
              )}

              <div className="overflow-hidden min-h-[1000px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeTab}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ x: d > 0 ? 500 : -500, opacity: 0, scale: 0.98 }),
                      center: { x: 0, opacity: 1, scale: 1 },
                      exit: (d: number) => ({ x: d < 0 ? 500 : -500, opacity: 0, scale: 0.98 })
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-4 mb-2">
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
                          <div>
                            <h2 className="text-4xl font-black text-[color:var(--text-primary)] uppercase tracking-tighter">
                              {activeTab === 'all' ? 'Seluruh Siswa' :
                                ['X', 'XI', 'XII'].includes(activeTab) ? `Total Kelas ${activeTab}` :
                                  formatClassLabel(jurusan.nama_jurusan, activeTab)}
                            </h2>
                            <p className="text-sm text-[color:var(--text-muted)] font-bold uppercase tracking-widest opacity-60">
                              MENAMPILKAN {classFilteredStudents.length} SISWA
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <StudentRace students={classFilteredStudents} jurusanName={jurusan.nama_jurusan} />

                    <LevelTable
                      levels={levels}
                      jurusanId={jurusan.id}
                      onUpdateCriteria={handleUpdateCriteria}
                      isTeacher={isTeacher}
                      allowEdit={!!user?.role && ['admin', 'hod', 'teacher_produktif'].includes(user.role)}
                    />

                    {user?.role !== 'student' && (
                      <div className="card-glass rounded-xl shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                          <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Daftar Siswa per Level</h2>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-[color:var(--text-muted)] whitespace-nowrap">
                              Filter Level:
                            </label>
                            <select
                              value={selectedLevel}
                              onChange={(e) => setSelectedLevel(e.target.value)}
                              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-transparent text-sm text-[color:var(--text-primary)] bg-[color:var(--card-bg)] border-[color:var(--card-border)]"
                              style={{
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              <option value="all" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Semua Level</option>
                              {levels.map((level) => (
                                <option key={level.id} value={level.id} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                                  {level.nama_level} ({level.badge_name})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-between items-center gap-2 mb-4">
                          <div />
                          {isTeacher && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={async () => {
                                  if (window.confirm(`PERINGATAN: Anda yakin ingin MENGHAPUS SEMUA data siswa di jurusan ${jurusan.nama_jurusan}?\n\nData yang dihapus tidak dapat dikembalikan!`)) {
                                    if (!window.confirm("Apakah anda benar-benar yakin?")) return;

                                    try {
                                      setLoading(true);
                                      if (isMockMode) {
                                        // Find all student IDs in this jurusan
                                        const studentsToDelete = mockData.mockSiswa.filter(s => s.jurusan_id === jurusan.id).map(s => s.id);

                                        // Delete in reverse loop to avoid index shifting issues
                                        for (let i = mockData.mockSiswa.length - 1; i >= 0; i--) {
                                          if (mockData.mockSiswa[i].jurusan_id === jurusan.id) {
                                            mockData.mockSiswa.splice(i, 1);
                                          }
                                        }
                                        for (let i = mockData.mockSiswa.length - 1; i >= 0; i--) {
                                          if (mockData.mockSiswa[i].jurusan_id === jurusan.id) {
                                            mockData.mockSiswa.splice(i, 1);
                                          }
                                        }
                                        // Delete skills
                                        for (let i = mockData.mockSkillSiswa.length - 1; i >= 0; i--) {
                                          if (studentsToDelete.includes(mockData.mockSkillSiswa[i].siswa_id)) {
                                            mockData.mockSkillSiswa.splice(i, 1);
                                          }
                                        }
                                      } else {
                                        const { error } = await supabase.from('siswa').delete().eq('jurusan_id', jurusan.id);
                                        if (error) throw error;
                                      }
                                      await loadData();
                                      alert('Semua data siswa berhasil dihapus.');
                                    } catch (err: any) {
                                      console.error('Failed to delete all', err);
                                      alert(`Gagal menghapus data: ${err.message || 'Error tidak diketahui'}. \n\nPastikan Anda memiliki izin akses di database.`);
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm inline-flex items-center gap-2 hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus Semua</span>
                              </button>
                              <button onClick={() => setShowImport(true)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm inline-flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                                <Download className="w-4 h-4" />
                                <span>Import Siswa</span>
                              </button>
                            </div>
                          )}
                        </div>

                        <StudentTable
                          students={filteredStudents}
                          onExportExcel={handleExportExcel}
                          onExportPDF={handleExportPDF}
                          onEditScore={isTeacher ? handleEditScore : undefined}
                          onDelete={isTeacher ? async (s) => {
                            try {
                              setLoading(true);
                              // Delete logic
                              if (isMockMode) {
                                const idx = mockData.mockSiswa.findIndex(ms => ms.id === s.id);
                                if (idx >= 0) mockData.mockSiswa.splice(idx, 1);
                                // Also delete related skill records
                                const sIdx = mockData.mockSkillSiswa.findIndex(ss => ss.siswa_id === s.id);
                                if (sIdx >= 0) mockData.mockSkillSiswa.splice(sIdx, 1);
                              } else {
                                const { error } = await supabase.from('siswa').delete().eq('id', s.id);
                                if (error) throw error;
                              }
                              await loadData();
                            } catch (err) {
                              console.error('Delete failed', err);
                              alert('Gagal menghapus siswa');
                              setLoading(false);
                            }
                          } : undefined}
                          topRanks={topRanks}
                          onSelectStudent={(s) => setSelectedStudent(s)}
                          jurusanName={jurusan.nama_jurusan}
                        />
                      </div>
                    )}

                    {selectedStudent && (
                      <StudentDetailModal
                        student={selectedStudent}
                        levels={levels}
                        onClose={() => setSelectedStudent(null)}
                        jurusanName={jurusan.nama_jurusan}
                        onUpdate={isTeacher ? async (id, nama, kelas, poin) => {
                          try {
                            setLoading(true);
                            if (isMockMode) {
                              const s = mockData.mockSiswa.find(ms => ms.id === id);
                              if (s) { s.nama = nama; s.kelas = kelas; }
                              const sk = mockData.mockSkillSiswa.find(ms => ms.siswa_id === id);
                              if (sk) { sk.poin = poin; }
                            } else {
                              const { error: sError } = await supabase.from('siswa').update({ nama, kelas }).eq('id', id);
                              if (sError) throw sError;
                              const { error: skError } = await supabase.from('skill_siswa').update({ poin }).eq('siswa_id', id);
                              if (skError) throw skError;
                            }
                            await loadData(true);
                            setSelectedStudent(prev => prev ? ({ ...prev, nama, kelas, poin }) : null);
                          } catch (err) {
                            console.error('Update failed', err);
                            throw err;
                          } finally {
                            setLoading(false);
                          }
                        } : undefined}
                      />
                    )}

                    {showImport && (
                      <ImportStudents jurusanId={jurusan.id} onClose={() => setShowImport(false)} onImported={() => loadData()} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JurusanDetailPage;
