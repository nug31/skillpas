import { useEffect, useState } from 'react';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan, LevelSkill, StudentListItem } from '../types';
import { LevelTable } from './LevelTable';
import formatClassLabel from '../lib/formatJurusan';
import ImportStudents from './ImportStudents';
import { StudentTable } from './StudentTable';
import StudentDetailModal from './StudentDetailModal';
import { StudentRace } from './StudentRace';
import { useAuth } from '../contexts/AuthContext';

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

  const IconComponent = (LucideIcons as any)[jurusan.icon] || LucideIcons.GraduationCap;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [jurusan.id]);

  async function loadData() {
    try {
      setLoading(true);

      const useMock = isMockMode;

      if (useMock) {
        // Read from mockData (merged per-jurusan overrides)
        setLevels(mockData.getLevelsForJurusan(jurusan.id));
        const list = mockData.getStudentListForJurusan(jurusan.id);
        setStudents(list);
        setLoading(false);
        return;
      }

      const [levelsResult, studentsResult, overridesResult] = await Promise.all([
        supabase.from('level_skill').select('*').order('urutan'),
        supabase
          .from('siswa')
          .select('id, nama, kelas, nisn, skill_siswa(skor, poin, level_id), competency_history(*)')
          .eq('jurusan_id', jurusan.id),
        supabase
          .from('level_skill_jurusan')
          .select('*')
          .eq('jurusan_id', jurusan.id)
      ]);

      if (levelsResult.error) throw levelsResult.error;
      if (studentsResult.error) throw studentsResult.error;
      if (overridesResult.error) throw overridesResult.error;

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

      const levelsMap = new Map(
        parsedLevels.map((level: LevelSkill) => [level.id, level])
      );

      const studentList: StudentListItem[] = (studentsResult.data || [])
        .filter((siswa: any) => siswa.skill_siswa && siswa.skill_siswa.length > 0)
        .map((siswa: any) => {
          const latestSkill = siswa.skill_siswa[0];
          const skor = latestSkill.skor;

          // Find the correct level based on score first (robust sync)
          const level = parsedLevels.find(l => skor >= l.min_skor && skor <= l.max_skor)
            || levelsMap.get(latestSkill.level_id);

          let badge_name = 'Basic';
          let badge_color = '#94a3b8';
          let level_name = 'Pemula / Beginner';

          if (level) {
            badge_name = level.badge_name;
            badge_color = level.badge_color;
            level_name = level.nama_level;
          } else {
            // Further fallback if no level found
            if (skor >= 90) {
              badge_name = 'Master';
              badge_color = '#10b981';
              level_name = 'Mastery (Expert)';
            } else if (skor >= 76) {
              badge_name = 'Advance';
              badge_color = '#f59e0b';
              level_name = 'Advanced';
            } else if (skor >= 51) {
              badge_name = 'Specialist';
              badge_color = '#3b82f6';
              level_name = 'Intermediate (Specialist)';
            } else if (skor >= 26) {
              badge_name = 'Basic 2';
              badge_color = '#64748b';
              level_name = 'Beginner 2 (Uji Kompetensi)';
            }
          }

          return {
            id: siswa.id,
            nama: siswa.nama,
            kelas: siswa.kelas,
            nisn: siswa.nisn,
            skor: latestSkill.skor,
            poin: latestSkill.poin || 0,
            badge_name: badge_name as any,
            badge_color,
            level_name,
            riwayat_kompetensi: siswa.competency_history || []
          };
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

      // refresh
      await loadData();
    } catch (err) {
      console.error('Error saving score:', err);
      throw err;
    } finally {
      setLoading(false);
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
          mockData.mockLevelOverrides[idx].hasil_belajar = criteria[0] || ''; // Fallback for legacy
        } else {
          mockData.mockLevelOverrides.push({
            jurusan_id: jurusan.id,
            level_id: levelId,
            criteria: criteria,
            hasil_belajar: criteria[0] || ''
          });
        }
        // No need to reload data, optimistic update already applied
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

      // Success! The optimistic update is already applied, no need to refresh
    } catch (err) {
      console.error('Error updating criteria:', err);
      throw err;
    }
  }

  const [activeTab, setActiveTab] = useState<string>('all');

  // 1. Filter by class first (Base dataset for this page view)
  const classFilteredStudents = students.filter((s) => {
    // If we have a forced prop filter (Student View), use it.
    if (classFilter) {
      return s.kelas.startsWith(classFilter + ' ');
    }
    // Otherwise check activeTab (Teacher View)
    if (activeTab !== 'all') {
      return s.kelas.startsWith(activeTab + ' ');
    }
    return true;
  });

  // 2. Filter by level (For the table display)
  const filteredStudents = classFilteredStudents.filter((s) => {
    if (selectedLevel === 'all') return true;
    const level = levels.find((l) => l.id === selectedLevel);
    return !!(level && s.skor >= level.min_skor && s.skor <= level.max_skor);
  });

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
              <p className="text-[color:var(--text-muted)]">{jurusan.deskripsi}</p>
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
            {!classFilter && isTeacher && (
              <div className="flex justify-center mb-6">
                <div className="bg-[color:var(--card-bg)] p-1 rounded-lg inline-flex shadow-sm border border-[color:var(--card-border)]">
                  {['all', 'X', 'XI', 'XII'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]'
                        }`}
                    >
                      {tab === 'all' ? 'Semua Kelas' : `Kelas ${tab}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Student Race uses the class-filtered list, ignoring the table level filter */}
            <StudentRace students={classFilteredStudents} jurusanName={jurusan.nama_jurusan} />

            {(() => {
              const isAdmin = user?.role === 'admin';
              const isHOD = user?.role === 'hod';
              const isTeacherProduktif = user?.role === 'teacher_produktif';
              const isWaliKelas = user?.role === 'wali_kelas';
              const hasMatchingJurusan = !!user?.jurusan_id && !!jurusan.id &&
                String(user.jurusan_id).toLowerCase() === String(jurusan.id).toLowerCase();

              const canEditCriteria = isAdmin || ((isHOD || isTeacherProduktif || isWaliKelas) && hasMatchingJurusan);

              return (
                <>
                  {/* Debug Info for Teachers (Temporary) */}
                  {isTeacher && (
                    <div className="text-[10px] text-[color:var(--text-muted)] mb-2 px-2 flex gap-4 opacity-50">
                      <span>Role: {user?.role}</span>
                      <span>User Jurusan: {user?.jurusan_id?.slice(-4)}</span>
                      <span>Page Jurusan: {jurusan.id.slice(-4)}</span>
                      <span className={canEditCriteria ? 'text-green-400' : 'text-red-400'}>
                        Access: {canEditCriteria ? 'GRANTED' : 'DENIED'}
                      </span>
                    </div>
                  )}
                  <LevelTable
                    levels={levels}
                    jurusanId={jurusan.id}
                    onUpdateCriteria={handleUpdateCriteria}
                    isTeacher={isTeacher}
                    allowEdit={canEditCriteria}
                  />
                </>
              );
            })()}

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
                            } catch (err) {
                              console.error('Failed to delete all', err);
                              alert('Gagal menghapus data.');
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
                      // Update siswa table
                      const { error: sError } = await supabase.from('siswa').update({ nama, kelas }).eq('id', id);
                      if (sError) throw sError;

                      // Update skill_siswa table for poin
                      const { error: skError } = await supabase.from('skill_siswa').update({ poin }).eq('siswa_id', id);
                      if (skError) throw skError;
                    }
                    await loadData();
                    // Update selected student in local state to reflect changes immediately in modal
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
          </div>
        )}
      </div>
    </div>
  );
}
