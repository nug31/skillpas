import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan } from '../types';
import { JurusanCard } from './JurusanCard';
import { DashboardRace } from './DashboardRace';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onSelectJurusan: (jurusan: Jurusan, classFilter?: string) => void;
}

export function HomePage({ onSelectJurusan }: HomePageProps) {
  const { user } = useAuth();
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [topStudentsMap, setTopStudentsMap] = useState<Record<string, { id: string; nama: string; skor: number; kelas?: string }[]>>({});
  const [raceData, setRaceData] = useState<Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [triggerRace, setTriggerRace] = useState(0);

  const useMock = isMockMode;

  useEffect(() => {
    loadJurusan();
  }, [user]);

  async function loadJurusan() {
    try {
      let data: Jurusan[] | null = null;
      if (useMock) {
        data = mockData.mockJurusan;
      } else {
        const result = await supabase.from('jurusan').select('*').order('nama_jurusan');
        if (result.error) throw result.error;
        data = result.data || [];
      }

      // Filter jurusans based on role
      let filteredData = data || [];
      if (user?.role === 'student' && user.jurusan_id) {
        filteredData = filteredData.filter(j => j.id === user.jurusan_id);
      }

      setJurusanList(filteredData);

      setJurusanList(filteredData);

      // fetch top student for each jurusan (best skor)
      try {
        const map: Record<string, { id: string; nama: string; skor: number; kelas?: string }[]> = {};

        // If student, we want top students per class level (X, XI, XII)
        // We will store them with keys like "jurusanId-X", "jurusanId-XI", "jurusanId-XII"
        // Teacher sees overall top 3, stored with key "jurusanId"

        if (useMock) {
          if (user?.role === 'student' && user.jurusan_id) {
            // For student: fetch top students for X, XI, XII specific to their jurusan
            const jId = user.jurusan_id;
            const allStudents = mockData.getStudentListForJurusan(jId); // Get all to filter

            ['X', 'XI', 'XII'].forEach(level => {
              const classStudents = allStudents
                .filter(s => s.kelas.startsWith(`${level} `)) // simple check for "X TKR" etc
                .sort((a, b) => b.skor - a.skor)
                .slice(0, 3);

              map[`${jId}-${level}`] = classStudents.map(s => ({
                id: s.id,
                nama: s.nama,
                skor: s.skor,
                kelas: s.kelas
              }));
            });
          } else {
            // Teacher/Default: fetch top 3 overall per jurusan
            (filteredData || []).forEach((j) => {
              map[j.id] = mockData.getTopStudentsForJurusan(j.id, 3);
            });
          }
        } else {
          // Supabase implementation
          if (user?.role === 'student' && user.jurusan_id) {
            const jId = user.jurusan_id;
            await Promise.all(['X', 'XI', 'XII'].map(async (level) => {
              const { data: topData, error } = await supabase
                .from('skill_siswa')
                .select('skor, siswa!inner(id, nama, kelas)')
                .eq('siswa.jurusan_id', jId)
                .ilike('siswa.kelas', `${level} %`) // Case insensitive match for class prefix
                .order('skor', { ascending: false })
                .limit(3);

              if (!error && topData) {
                map[`${jId}-${level}`] = (topData as any[]).map((t) => ({
                  id: t.siswa?.id ?? '',
                  nama: t.siswa?.nama ?? 'N/A',
                  skor: t.skor ?? 0,
                  kelas: t.siswa?.kelas
                }));
              }
            }));
          } else {
            await Promise.all((filteredData || []).map(async (j) => {
              const { data: topData, error } = await supabase
                .from('skill_siswa')
                .select('skor, siswa!inner(id, nama, kelas)')
                .eq('siswa.jurusan_id', j.id)
                .order('skor', { ascending: false })
                .limit(3);

              if (!error && topData && topData.length > 0) {
                map[j.id] = (topData as any[]).map((t) => ({ id: t.siswa?.id ?? '', nama: t.siswa?.nama ?? 'N/A', skor: t.skor ?? 0, kelas: t.siswa?.kelas }));
              }
            }));
          }
        }

        setTopStudentsMap(map);
      } catch (e) {
        console.error('Error loading top students:', e);
      }

      // ... race data loading logic remains same for now (averages are per jurusan)

      // Load race data (average scores per jurusan)
      try {
        if (useMock) {
          const avgData = mockData.getAllJurusanWithAverageSkors();
          const raceList = avgData.map((avg) => {
            const jurusan = (data || []).find((j) => j.id === avg.jurusanId);
            return jurusan ? {
              jurusan,
              averageSkor: avg.averageSkor,
              studentCount: avg.studentCount,
            } : null;
          }).filter(Boolean) as Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>;
          setRaceData(raceList);
        } else {
          // For real database, calculate average scores and student counts
          const raceList = await Promise.all((data || []).map(async (j) => {
            // Count total enrolled students
            const { count: enrolledCount } = await supabase
              .from('siswa')
              .select('*', { count: 'exact', head: true })
              .eq('jurusan_id', j.id);

            // Get scores for average calculation
            const { data: skillData } = await supabase
              .from('skill_siswa')
              .select('skor, siswa(jurusan_id)')
              .eq('siswa.jurusan_id', j.id);

            const scores = (skillData || []).map((s: any) => s.skor).filter(Boolean);
            const averageSkor = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

            return {
              jurusan: j,
              averageSkor,
              studentCount: enrolledCount || 0,
            };
          }));
          setRaceData(raceList);
        }
      } catch (e) {
        console.error('Error loading race data:', e);
      }

    } catch (error) {
      console.error('Error loading jurusan:', error);
    } finally {
      setLoading(false);
    }
  }

  const overallStats = raceData.reduce((acc, curr) => {
    acc.totalStudents += curr.studentCount;
    acc.totalScoreSum += (curr.averageSkor * curr.studentCount);
    if (curr.averageSkor > acc.maxScore) {
      acc.maxScore = curr.averageSkor;
      acc.topJurusan = curr.jurusan.nama_jurusan;
    }
    return acc;
  }, { totalStudents: 0, totalScoreSum: 0, maxScore: 0, topJurusan: '-' });

  const globalAvg = overallStats.totalStudents > 0
    ? (overallStats.totalScoreSum / overallStats.totalStudents).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          {/* Header section remains same */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fadeInUp">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-md-2">
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-white text-xs font-semibold">DASHBOARD</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_20px_rgba(139,92,246,0.3)] [.theme-clear_&]:from-indigo-900 [.theme-clear_&]:via-purple-800 [.theme-clear_&]:to-indigo-900 [.theme-clear_&]:[text-shadow:_0_2px_10px_rgba(79,70,229,0.2)]">
                    SKILL PASSPORT
                  </span>
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest">
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent [.theme-clear_&]:from-indigo-700 [.theme-clear_&]:via-purple-600 [.theme-clear_&]:to-pink-600">
                    SMK Mitra Industri
                  </span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full mt-4 mb-6 animate-pulse [.theme-clear_&]:from-yellow-500 [.theme-clear_&]:via-orange-500 [.theme-clear_&]:to-pink-500"></div>
                <p className="text-lg sm:text-xl font-medium tracking-wide">
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent [.theme-clear_&]:from-cyan-600 [.theme-clear_&]:to-blue-600">
                    Menuju Vokasi Berstandar Industri & Terverifikasi
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8">
                <button
                  onClick={() => {
                    setTriggerRace(Date.now());
                    const raceSection = document.getElementById('dashboard-race');
                    raceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all w-full sm:w-auto text-sm sm:text-base"
                >
                  Mulai
                </button>

              </div>
            </div>

            <div className="card-glass rounded-xl-2 p-6 shadow-inner border border-white/6 animate-slideInRight stagger-delay-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-white/70">Overview</div>
                  <div className="text-2xl font-bold">
                    {useMock ? mockData.mockJurusan.length : jurusanList.length} Jurusan • {overallStats.totalStudents} Siswa aktif
                  </div>
                </div>
                <div className="text-sm text-white/60">Terakhir diperbarui: Hari ini</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                  <div className="text-xs text-white/70">Top Jurusan</div>
                  <div className="text-sm font-semibold mt-2">{overallStats.topJurusan}</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                  <div className="text-xs text-white/70">Average Skor</div>
                  <div className="text-sm font-semibold mt-2">{globalAvg}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Race Recap */}
        {!loading && raceData.length > 0 && (
          <div id="dashboard-race" className="animate-fadeIn stagger-delay-3 pb-12">
            <DashboardRace jurusanData={raceData} trigger={triggerRace} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className={user?.role === 'student' ? "flex flex-wrap justify-center gap-6" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
            {user?.role === 'student' && jurusanList.length > 0 ? (
              // If student, render 3 cards for X, XI, XII
              ['X', 'XI', 'XII'].map((classLevel, idx) => (
                <div key={`${jurusanList[0].id}-${classLevel}`} className="pulse-on-hover animate-fadeInUp w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]" style={{ animationDelay: `${idx * 100 + 400}ms` }}>
                  <JurusanCard
                    jurusan={jurusanList[0]}
                    onClick={() => onSelectJurusan(jurusanList[0], classLevel)}
                    topStudents={topStudentsMap[`${jurusanList[0].id}-${classLevel}`] ?? []}
                    titleOverride={`${jurusanList[0].nama_jurusan} ${classLevel}`}
                  />
                </div>
              ))
            ) : (
              // Teacher logic (existing)
              jurusanList.map((jurusan, index) => (
                <div key={jurusan.id} className="pulse-on-hover animate-fadeInUp" style={{ animationDelay: `${index * 100 + 400}ms` }}>
                  <JurusanCard
                    jurusan={jurusan}
                    onClick={() => onSelectJurusan(jurusan)}
                    topStudents={topStudentsMap[jurusan.id] ?? []}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {!loading && jurusanList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada data jurusan</p>
          </div>
        )}
      </div>
    </div>
  );
}
