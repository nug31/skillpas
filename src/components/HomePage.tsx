import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan, KRSSubmission } from '../types';
import { JurusanCard } from './JurusanCard';
import { DashboardRace } from './DashboardRace';
import { useAuth } from '../contexts/AuthContext';
import { MissionModal } from './MissionModal';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { Edit3, CheckCircle, Contact, TrendingUp, Check } from 'lucide-react';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { SkillCard } from './SkillCard';

interface HomePageProps {
  onSelectJurusan: (jurusan: Jurusan, classFilter?: string) => void;
  onOpenKRSApproval?: () => void;
}

export function HomePage({ onSelectJurusan, onOpenKRSApproval }: HomePageProps) {
  const { user } = useAuth();
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [topStudentsMap, setTopStudentsMap] = useState<Record<string, { id: string; nama: string; skor: number; kelas?: string }[]>>({});
  const [raceData, setRaceData] = useState<Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [triggerRace, setTriggerRace] = useState(0);
  const [myStats, setMyStats] = useState<{
    rank: number;
    totalStudents: number;
    score: number;
    poin: number;
    level: string;
    levelColor: string;
    className: string;
  } | null>(null);

  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSkillCard, setShowSkillCard] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [pendingKRSCount, setPendingKRSCount] = useState(0);
  const [toApproveCount, setToApproveCount] = useState(0);
  const { updateUser } = useAuth();

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
      loadPendingKRS();


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



    } catch (error) {
      console.error('Error loading jurusan:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === 'student') {
      loadMyStats();
    }
  }, [user]);

  async function loadMyStats() {
    if (!user) return;
    try {
      if (useMock) {
        // Mock implementation
        const student = mockData.mockSiswa.find(s => s.nama === user.name);
        if (student) {
          const allStudents = mockData.getStudentListForJurusan(student.jurusan_id);
          const classStudents = allStudents.filter(s => s.kelas === student.kelas);
          classStudents.sort((a, b) => b.skor - a.skor);
          const rank = classStudents.findIndex(s => s.id === student.id) + 1;

          const skill = mockData.mockSkillSiswa.find(ss => ss.siswa_id === student.id);
          const score = skill?.skor || 0;
          const poin = skill?.poin || 0;

          const levelObj = mockData.mockLevels.find(l => score >= l.min_skor && score <= l.max_skor);

          setMyStats({
            rank: rank > 0 ? rank : 0,
            totalStudents: classStudents.length,
            score: score,
            poin: poin,
            level: levelObj?.badge_name || 'Basic',
            levelColor: levelObj?.badge_color || '#94a3b8',
            className: student.kelas
          });
        }
      } else {
        // Supabase implementation
        let { data: student, error } = await supabase
          .from('siswa')
          .select('*, skill_siswa(skor, poin)')
          .eq('id', user.id)
          .single();

        if (error || !student) {
          const { data: studentByName } = await supabase
            .from('siswa')
            .select('*, skill_siswa(skor, poin)')
            .eq('nama', user.name)
            .single();
          student = studentByName;
        }

        if (student) {
          const score = (student as any).skill_siswa?.[0]?.skor || 0;
          const poin = (student as any).skill_siswa?.[0]?.poin || 0;

          const { count } = await supabase
            .from('siswa')
            .select('id, skill_siswa!inner(skor)', { count: 'exact', head: true })
            .eq('kelas', student.kelas)
            .gt('skill_siswa.skor', score);

          const rank = (count || 0) + 1;

          const { count: totalClass } = await supabase
            .from('siswa')
            .select('id', { count: 'exact', head: true })
            .eq('kelas', student.kelas);

          let badge = 'Basic 1';
          let color = '#94a3b8';
          if (score >= 90) { badge = 'Master'; color = '#10b981'; }
          else if (score >= 76) { badge = 'Advance'; color = '#f59e0b'; }
          else if (score >= 51) { badge = 'Specialist'; color = '#3b82f6'; }
          else if (score >= 26) { badge = 'Basic 2'; color = '#64748b'; }

          setMyStats({
            rank,
            totalStudents: totalClass || 0,
            score,
            poin,
            level: badge,
            levelColor: color,
            className: student.kelas
          });
        } else {
          // No student record found in Supabase (unimported student)
          // Set default empty stats so UI doesn't hang in loading
          setMyStats({
            rank: 0,
            totalStudents: 0,
            score: 0,
            poin: 0,
            level: 'Basic',
            levelColor: '#94a3b8',
            className: user.role === 'student' ? '...' : ''
          });
        }
      }
    } catch (e) {
      console.error("Failed to load my stats", e);
      // Fallback on error
      setMyStats({
        rank: 0,
        totalStudents: 0,
        score: 0,
        poin: 0,
        level: 'Basic',
        levelColor: '#94a3b8',
        className: ''
      });
    }
  }

  // Same logic as TeacherKRSApproval to count pending items
  const normalizeClass = (name?: string) => {
    if (!name) return '';
    return name.toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/^10\s/, 'X ')
      .replace(/^11\s/, 'XI ')
      .replace(/^12\s/, 'XII ')
      .trim();
  };

  async function loadPendingKRS() {
    if (!user || user.role === 'student') return;
    const all = krsStore.getSubmissions();
    const userRole = user.role;
    const userDeptId = user.jurusan_id;
    const pendingItems = all.filter((s: KRSSubmission) => {
      // 1. Status Match
      let statusMatch = false;
      if (userRole === 'teacher_produktif' || userRole === 'teacher') {
        statusMatch = s.status === 'pending_produktif' || s.status === 'pending_wali' || s.status === 'scheduled';
      } else if (userRole === 'wali_kelas') {
        statusMatch = s.status === 'pending_wali' || s.status === 'pending_produktif';
      } else if (userRole === 'hod') {
        statusMatch = s.status === 'pending_hod' || s.status === 'pending_wali' || s.status === 'scheduled';
      } else if (userRole === 'admin') {
        statusMatch = true;
      }

      if (!statusMatch) return false;

      // 2. Department Match
      if (userRole !== 'admin' && userDeptId && s.jurusan_id !== userDeptId) return false;

      // 3. Class Match for Anyone looking at pending_wali
      if (s.status === 'pending_wali') {
        const studentNormClass = normalizeClass(s.kelas);
        const userClasses = (user.kelas || '').split(',').map(c => normalizeClass(c.trim())).filter(Boolean);
        if (userClasses.length > 0 && !userClasses.includes(studentNormClass)) return false;
        if (userClasses.length === 0) return false;
      }

      return true;
    });

    const toApprove = pendingItems.filter((s: KRSSubmission) => s.status !== 'scheduled');

    setToApproveCount(toApprove.length);
    setPendingKRSCount(pendingItems.length);

  }

  const [scheduledExam, setScheduledExam] = useState<{ date: string, notes?: string } | null>(null);

  useEffect(() => {
    if (user?.role === 'student') {
      const checkExamSchedule = () => {
        const userId = user.name === 'Siswa Mesin' ? 'siswa_mesin' : user.id; // handle specific mock mapping
        const sub = krsStore.getStudentSubmission(userId);
        if (sub && sub.status === 'scheduled' && sub.exam_date) {
          setScheduledExam({
            date: sub.exam_date,
            notes: sub.notes
          });
        } else {
          setScheduledExam(null);
        }
      };
      checkExamSchedule();
      window.addEventListener(KRS_UPDATED_EVENT, checkExamSchedule);
      return () => window.removeEventListener(KRS_UPDATED_EVENT, checkExamSchedule);
    }
  }, [user]);

  useEffect(() => {
    loadPendingKRS();
    window.addEventListener(KRS_UPDATED_EVENT, loadPendingKRS);
    return () => window.removeEventListener(KRS_UPDATED_EVENT, loadPendingKRS);
  }, [user]);

  // Load race data (average scores per jurusan)
  useEffect(() => {
    loadRaceData();
  }, [jurusanList]);

  async function loadRaceData() {
    try {
      if (useMock) {
        const avgData = mockData.getAllJurusanWithAverageSkors();
        const raceList = avgData.map((avg) => {
          const jurusan = (jurusanList || []).find((j) => j.id === avg.jurusanId);
          return jurusan ? {
            jurusan,
            averageSkor: avg.averageSkor,
            studentCount: avg.studentCount,
          } : null;
        }).filter(Boolean) as Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>;
        setRaceData(raceList);
      } else {
        const raceList = await Promise.all((jurusanList || []).map(async (j) => {
          const { count: enrolledCount } = await supabase
            .from('siswa')
            .select('*', { count: 'exact', head: true })
            .eq('jurusan_id', j.id);

          const { data: skillData } = await supabase
            .from('skill_siswa')
            .select('skor, siswa!inner(jurusan_id)')
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
                {user?.role !== 'student' && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setTriggerRace(Date.now());
                        const raceSection = document.getElementById('dashboard-race');
                        raceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2"
                    >
                      Mulai
                    </button>

                    {onOpenKRSApproval && (
                      <button
                        onClick={onOpenKRSApproval}
                        className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold shadow-lg hover:-translate-y-1 hover:bg-white/10 transition-all w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2 relative group"
                      >
                        <CheckCircle className="w-5 h-5 text-indigo-400" />
                        Persetujuan KRS
                        {pendingKRSCount > 0 && (
                          <div className={`absolute -top-2 -right-2 w-6 h-6 ${toApproveCount > 0 ? 'bg-red-500' : 'bg-amber-500'
                            } text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a] animate-bounce shadow-lg shadow-indigo-500/20`}>
                            {pendingKRSCount}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    )}
                  </div>
                )}

                {/* Student Exam Notification */}
                {user?.role === 'student' && scheduledExam && (
                  <div className="w-full sm:max-w-md animate-bounce-subtle">
                    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-4 shadow-xl backdrop-blur-md">
                      <div className="p-3 bg-emerald-500 rounded-lg shadow-lg shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-emerald-300 font-bold text-lg mb-1">Ujian KRS Terjadwal!</h3>
                        <p className="text-white text-sm">
                          Selamat, KRS kamu telah disetujui penuh oleh HOD.
                        </p>
                        <div className="mt-3 inline-block px-3 py-1 bg-emerald-500/20 rounded border border-emerald-500/30 text-emerald-300 font-mono font-bold text-sm">
                          📅 {new Date(scheduledExam.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {scheduledExam.notes && (
                          <p className="text-xs text-white/50 mt-2 italic">"{scheduledExam.notes}"</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-glass rounded-xl-2 p-6 shadow-inner border border-white/6 animate-slideInRight stagger-delay-2 h-full flex flex-col justify-center">
              {user?.role === 'student' ? (
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="relative group transition-transform hover:scale-105 active:scale-95"
                    title="Ubah Avatar"
                  >
                    <ProfileAvatar
                      name={user.name}
                      avatarUrl={(user as any)?.avatar_url}
                      photoUrl={(user as any)?.photo_url}
                      level={myStats?.level}
                      size="md"
                      jurusanColor="#6366f1"
                      className="shadow-xl"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    {myStats && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border-2 border-[#0f172a] z-20">
                        #{myStats.rank}
                      </div>
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="text-sm text-white/60 font-medium tracking-wide">STUDENT PROFILE</div>
                    <div className="text-2xl font-bold text-white truncate max-w-[200px]">{user.name}</div>

                    {myStats ? (
                      <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/10" style={{ backgroundColor: myStats.levelColor }}>
                            {myStats.level} Badge
                          </div>
                          <div className="text-sm text-white/50 px-2 border-l border-white/10">
                            {myStats.className}
                          </div>
                        </div>

                        <button
                          onClick={() => setShowSkillCard(true)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/20 transition-all group"
                        >
                          <Contact className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Lihat Skill Card
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-white/40 animate-pulse">Loading stats...</div>
                    )}
                  </div>
                </div>

              ) : (
                <>
                  {/* Glassmorphism Header */}
                  <div className="relative overflow-hidden rounded-2xl mb-6 p-[2px] bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50">
                    <div className="relative rounded-2xl bg-slate-950/80 backdrop-blur-xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
                      {/* Decorative Background Elements */}
                      <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

                      {/* Avatar Section */}
                      <button
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="relative group shrink-0"
                        title="Ubah Foto Profil"
                      >
                        <div className="relative z-10 p-1 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 backdrop-blur-md transition-transform group-hover:scale-105">
                          <ProfileAvatar
                            name={user?.name || 'User'}
                            avatarUrl={(user as any)?.avatar_url}
                            photoUrl={(user as any)?.photo_url}
                            size="lg"
                            jurusanColor="#6366f1"
                            className="w-24 h-24 sm:w-28 sm:h-28"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                            <Edit3 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full -z-10 group-hover:bg-indigo-400/40 transition-colors" />
                      </button>

                      {/* Info Section */}
                      <div className="flex-1 min-w-0 text-center md:text-left z-10 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-4 mb-2">
                          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm leading-none whitespace-nowrap">
                            {user?.name || 'Guest User'}
                          </h2>
                          <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] md:text-xs font-bold text-indigo-100 backdrop-blur-md uppercase tracking-wider shadow-sm mb-0.5">
                            {(() => {
                              let label = 'Pengajar';
                              if (user?.role === 'admin') label = 'Administrator';
                              if (user?.role === 'wali_kelas') label = 'Wali Kelas';
                              if (user?.role === 'teacher_produktif') label = 'Guru Produktif';

                              if (user?.role === 'hod') {
                                const userJurusanId = (user as any)?.jurusan_id;
                                const jurusan = jurusanList.find(j => j.id === userJurusanId);
                                label = jurusan ? `HOD ${jurusan.nama_jurusan}` : 'HOD';
                              }
                              return label;
                            })()}
                          </span>
                        </div>

                        <p className="text-slate-300/80 text-xs md:text-sm leading-relaxed w-full hidden md:block">
                          Selamat datang di Dashboard Skill Passport. Pantau kompetensi siswa secara real-time.
                        </p>
                      </div>

                      {/* Stats Section */}
                      <div className="flex gap-4 shrink-0 bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-md shadow-inner">
                        <div className="text-center px-3 border-r border-white/10 last:border-0">
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            {useMock ? mockData.mockJurusan.length : jurusanList.length}
                          </div>
                          <div className="text-[10px] font-bold text-indigo-200/70 mt-0.5 tracking-wider">JURUSAN</div>
                        </div>
                        <div className="text-center px-3">
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            {overallStats.totalStudents}
                          </div>
                          <div className="text-[10px] font-bold text-indigo-200/70 mt-0.5 tracking-wider">SISWA</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-4 hover:border-indigo-500/30 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-all">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Avg. Skor</div>
                        <div className="text-lg font-bold text-white">{globalAvg}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex items-center gap-4 hover:border-emerald-500/30 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:text-emerald-300 group-hover:bg-emerald-500/20 transition-all">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Top Jurusan</div>
                        <div className="text-sm font-bold text-white truncate max-w-[120px]" title={overallStats.topJurusan}>{overallStats.topJurusan}</div>
                      </div>
                    </div>
                    {/* You can add more cards here for other stats if needed */}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Race Recap */}
        {!loading && raceData.length > 0 && (
          <div id="dashboard-race" className="animate-fadeIn stagger-delay-3 pb-12">
            <DashboardRace
              jurusanData={raceData}
              trigger={triggerRace}
              myStats={myStats}
              showCompetition={user?.role !== 'student'}
              onContinue={() => {
                if (user?.role === 'student' && jurusanList.length > 0) {
                  setShowMissionModal(true);
                }
              }}
            />
          </div>
        )}

        {/* Mission Modal */}
        {user?.role === 'student' && jurusanList.length > 0 && myStats && (
          <MissionModal
            isOpen={showMissionModal}
            onClose={() => setShowMissionModal(false)}
            jurusan={jurusanList[0]}
            currentScore={myStats.score}
            currentPoin={myStats.poin}
            siswaId={user.name === 'Siswa Mesin' ? 'siswa_mesin' : user.id}
          />
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
        {/* Avatar Selection Modal */}
        <AvatarSelectionModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatar={(user as any)?.avatar_url}
          onSelect={(url) => {
            updateUser({ avatar_url: url } as any);
            setIsAvatarModalOpen(false);
          }}
        />


        {/* Skill Card Modal */}
        {showSkillCard && user && myStats && (
          <SkillCard
            student={{
              id: user.id || (user.name === 'Siswa Mesin' ? 'siswa_mesin' : ''),
              nama: user.name,
              kelas: myStats.className,
              skor: myStats.score,
              poin: myStats.poin,
              badge_name: myStats.level as any,
              badge_color: myStats.levelColor,
              level_name: myStats.level,
              avatar_url: (user as any).avatar_url,
              photo_url: (user as any).photo_url,
            }}
            jurusanName={jurusanList[0]?.nama_jurusan}
            onClose={() => setShowSkillCard(false)}
          />
        )}
      </div>

    </div>
  );
}
