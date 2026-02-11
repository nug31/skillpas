import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan, KRSSubmission, CompetencyHistory, StudentStats } from '../types';
import { JurusanCard } from './JurusanCard';
import { DashboardRace } from './DashboardRace';
import { useAuth } from '../contexts/AuthContext';
import { MissionModal } from './MissionModal';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { Edit3, CheckCircle, Contact, BookOpen, LayoutDashboard, Clock, AlertTriangle, XCircle, FileCheck } from 'lucide-react';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { SkillCard } from './SkillCard';
import { StudentHistoryModal } from './StudentHistoryModal';

// Simple helper to get a mock Walas name based on class
function getWalasForClass(className?: string): string {
  if (!className) return "Sri Wahyuni, S.Pd";
  const cls = className.toUpperCase();
  if (cls.includes('MESIN')) {
    if (cls.includes('XII')) return "Dwi Nugroho, S.T";
    if (cls.includes('XI')) return "Nia Desnata Hati, S.Pd";
    return "Gesti Khoriunnisa";
  }
  if (cls.includes('TKR')) {
    if (cls.includes('XII')) {
      if (cls.includes('1')) return "Maulana Evendi";
      if (cls.includes('2')) return "Esa Apriyadi, S.Pd";
      if (cls.includes('3')) return "Joko Setyo Nugroho, S.T";
    }
    return "Deni Prasetyo, S.Pd.";
  }
  if (cls.includes('TSM')) {
    if (cls.includes('XII')) return "Ahmad Nasrul, S.Pd";
    return "Rina Kurnia, S.Pd.";
  }
  if (cls.includes('ELIND')) return "Hendra Wijaya, S.T.";
  if (cls.includes('LISTRIK')) return "Taufik Hidayat, S.T.";
  if (cls.includes('KIMIA')) return "Sari Melati, S.Si.";
  if (cls.includes('AKUNTANSI') || cls.includes('AK')) return "Dewi Susanti, S.E.";
  if (cls.includes('HOTEL')) return "Mita Sari, S.Par.";
  return "Sri Wahyuni, S.Pd";
}

interface HomePageProps {
  onSelectJurusan: (jurusan: Jurusan, classFilter?: string) => void;
  onOpenKRSApproval?: () => void;
  onOpenWalasDashboard?: () => void;
}

export function HomePage({ onSelectJurusan, onOpenKRSApproval, onOpenWalasDashboard }: HomePageProps) {
  const { user } = useAuth();
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [topStudentsMap, setTopStudentsMap] = useState<Record<string, { id: string; nama: string; skor: number; kelas?: string }[]>>({});
  const [raceData, setRaceData] = useState<Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [triggerRace, setTriggerRace] = useState(0);
  const [myStats, setMyStats] = useState<StudentStats | null>(null);

  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showSkillCard, setShowSkillCard] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [myHistory, setMyHistory] = useState<CompetencyHistory[]>([]);
  const [hodName, setHodName] = useState<string | undefined>(undefined);
  const [walasName, setWalasName] = useState<string>('Sri Wahyuni, S.Pd');
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

          const discipline = mockData.mockDiscipline.find(d => d.siswa_id === student.id);

          setMyStats({
            rank: rank > 0 ? rank : 0,
            totalStudents: classStudents.length,
            score: score,
            poin: poin,
            level: levelObj?.badge_name || 'Basic',
            levelColor: levelObj?.badge_color || '#94a3b8',
            className: student.kelas,
            attendance_pcent: discipline?.attendance_pcent ?? 100,
            masuk: discipline?.masuk ?? 0,
            izin: discipline?.izin ?? 0,
            sakit: discipline?.sakit ?? 0,
            alfa: discipline?.alfa ?? 0
          });

          // Mock history
          const history = (mockData as any).mockCompetencyHistory?.filter((r: any) => r.siswa_id === student.id) || [];
          setMyHistory(history);

          // Auto-repair history if missing (e.g. imported student)
          krsStore.ensureBaselineHistory(student.id, score);
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

          // Fetch attendance
          const { data: discData } = await supabase
            .from('student_discipline')
            .select('attendance_pcent, masuk, izin, sakit, alfa')
            .eq('siswa_id', student.id)
            .maybeSingle();

          setMyStats({
            rank,
            totalStudents: totalClass || 0,
            score,
            poin,
            level: badge,
            levelColor: color,
            className: student.kelas,
            attendance_pcent: discData?.attendance_pcent ?? 100,
            masuk: discData?.masuk ?? 0,
            izin: discData?.izin ?? 0,
            sakit: discData?.sakit ?? 0,
            alfa: discData?.alfa ?? 0
          });

          // Fetch History
          const { data: historyData } = await supabase
            .from('competency_history')
            .select('*')
            .eq('siswa_id', student.id)
            .order('tanggal', { ascending: false });

          if (historyData) {
            setMyHistory(historyData);
          }

          // Auto-repair history if missing (e.g. imported student)
          krsStore.ensureBaselineHistory(student.id, score);

          // Fetch HOD for certificate
          const { data: hodData } = await supabase
            .from('users')
            .select('name')
            .eq('role', 'hod')
            .eq('jurusan_id', student.jurusan_id)
            .maybeSingle();

          if (hodData) {
            setHodName(hodData.name);
          }

          // Fetch Walas (Homeroom Teacher)
          const { data: walasData } = await supabase
            .from('users')
            .select('name')
            .in('role', ['wali_kelas', 'teacher_produktif', 'teacher'])
            .eq('kelas', student.kelas)
            .maybeSingle();

          if (walasData) {
            setWalasName(walasData.name);
          } else {
            // Fallback
            setWalasName(getWalasForClass(student.kelas));
          }
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
            className: user.role === 'student' ? '...' : '',
            attendance_pcent: 0,
            masuk: 0,
            izin: 0,
            sakit: 0,
            alfa: 0
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
    const all = await krsStore.getSubmissions();
    const userRole = user.role;
    const userDeptId = user.jurusan_id;
    const pendingItems = all.filter((s: KRSSubmission) => {
      // 1. Status Match
      let statusMatch = false;
      if (userRole === 'teacher_produktif' || userRole === 'teacher') {
        statusMatch = s.status === 'pending_produktif' || s.status === 'scheduled';
      } else if (userRole === 'wali_kelas') {
        // Walas monitors everything in their class
        statusMatch = true;
      } else if (userRole === 'hod') {
        statusMatch = s.status === 'pending_hod' || s.status === 'scheduled';
      } else if (userRole === 'admin') {
        statusMatch = true;
      }

      if (!statusMatch) return false;

      // 2. Department Match
      if (userRole !== 'admin' && userDeptId && s.jurusan_id !== userDeptId) return false;

      // 3. Class Match for Anyone looking at their class (especially Walas)
      const studentNormClass = normalizeClass(s.kelas);
      const userClasses = (user.kelas || '').split(',').map(c => normalizeClass(c.trim())).filter(Boolean);

      if (userRole === 'wali_kelas') {
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
  const [krsSubmission, setKrsSubmission] = useState<KRSSubmission | null>(null);

  useEffect(() => {
    if (user?.role === 'student') {
      const checkKRSStatus = async () => {
        const userId = user.name === 'Siswa Mesin' ? 'siswa_mesin' : user.id;
        const sub = await krsStore.getStudentSubmission(userId);
        if (sub) {
          setKrsSubmission(sub);
          if (sub.status === 'scheduled' && sub.exam_date) {
            setScheduledExam({ date: sub.exam_date, notes: sub.notes });
          } else {
            setScheduledExam(null);
          }
        } else {
          setKrsSubmission(null);
          setScheduledExam(null);
        }
      };
      checkKRSStatus();
      window.addEventListener(KRS_UPDATED_EVENT, checkKRSStatus);
      return () => window.removeEventListener(KRS_UPDATED_EVENT, checkKRSStatus);
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

          // Fetch score data iteratively
          let allScores: number[] = [];
          let offset = 0;
          const pageSize = 1000;
          let hasMore = true;

          while (hasMore) {
            const { data: skillData, error } = await supabase
              .from('skill_siswa')
              .select('skor, siswa!inner(jurusan_id)')
              .eq('siswa.jurusan_id', j.id)
              .range(offset, offset + pageSize - 1);

            if (error) break;
            if (skillData && skillData.length > 0) {
              const batchScores = (skillData || []).map((s: any) => s.skor).filter((s: number | null | undefined) => s !== null && s !== undefined);
              allScores = [...allScores, ...batchScores];
              offset += pageSize;
              hasMore = skillData.length === pageSize;
            } else {
              hasMore = false;
            }
          }

          const averageSkor = allScores.length > 0 ? allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length : 0;

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
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          {/* Header section remains same */}
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4 animate-fadeInUp">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 shadow-md-2 [.theme-clear_&]:from-emerald-500 [.theme-clear_&]:to-cyan-500">
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-white text-xs font-semibold">DASHBOARD</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-white via-yellow-100 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl [text-shadow:_0_4px_20px_rgba(234,179,8,0.3)] [.theme-clear_&]:from-emerald-900 [.theme-clear_&]:via-teal-800 [.theme-clear_&]:to-emerald-900 [.theme-clear_&]:[text-shadow:_0_2px_10px_rgba(5,150,105,0.2)]">
                    SKILL PASSPORT
                  </span>
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-widest">
                  <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent [.theme-clear_&]:from-emerald-700 [.theme-clear_&]:via-teal-600 [.theme-clear_&]:to-emerald-700">
                    SMK Mitra Industri
                  </span>
                </h2>
                <div className="w-24 h-0.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-full mt-2 mb-4 animate-pulse [.theme-clear_&]:from-emerald-500 [.theme-clear_&]:via-teal-500 [.theme-clear_&]:to-cyan-500"></div>
                <p className="text-lg sm:text-xl font-medium tracking-wide">
                  <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent [.theme-clear_&]:from-emerald-600 [.theme-clear_&]:to-emerald-800">
                    Menuju Vokasi Berstandar Industri & Terverifikasi
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-6">
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
                        Verifikasi Sertifikasi
                        {pendingKRSCount > 0 && (
                          <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 ${toApproveCount > 0 ? 'bg-red-500' : 'bg-emerald-500'
                            } text-white text-[9px] font-black rounded-full flex items-center justify-center border border-[#0f172a] animate-bounce shadow-lg shadow-emerald-500/20`}>
                            {pendingKRSCount}
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-lg bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    )}

                    {user?.role === 'wali_kelas' && onOpenWalasDashboard && (
                      <button
                        onClick={onOpenWalasDashboard}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all w-full sm:w-auto text-sm sm:text-base flex items-center justify-center gap-2 group"
                      >
                        <LayoutDashboard className="w-5 h-5 text-emerald-200" />
                        Walas Insight
                        <div className="absolute inset-0 rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 self-center w-full max-w-lg">
              {/* Student KRS Status Notification */}
              {user?.role === 'student' && krsSubmission && !['completed'].includes(krsSubmission.status) && (() => {
                const statusConfig: Record<string, { bg: string, border: string, iconBg: string, titleColor: string, tagColor: string, tagBg: string, descColor: string, Icon: typeof CheckCircle, title: string, tag: string, desc: string, detailBg?: string, detailBorder?: string, detailColor?: string }> = {
                  pending_produktif: {
                    bg: 'bg-amber-500/10 [.theme-clear_&]:bg-amber-50',
                    border: 'border-amber-500/20 [.theme-clear_&]:border-amber-200',
                    iconBg: 'bg-amber-500',
                    titleColor: 'text-amber-400 [.theme-clear_&]:text-amber-700',
                    tagColor: 'text-amber-500/60',
                    tagBg: '',
                    descColor: 'text-white/70 [.theme-clear_&]:text-slate-600',
                    Icon: Clock,
                    title: 'Menunggu Verifikasi Guru Produktif',
                    tag: 'Pending',
                    desc: 'Pendaftaran sertifikasimu sedang direview oleh Guru Produktif. Harap bersabar menunggu persetujuan.',
                  },
                  pending_hod: {
                    bg: 'bg-blue-500/10 [.theme-clear_&]:bg-blue-50',
                    border: 'border-blue-500/20 [.theme-clear_&]:border-blue-200',
                    iconBg: 'bg-blue-500',
                    titleColor: 'text-blue-400 [.theme-clear_&]:text-blue-700',
                    tagColor: 'text-blue-500/60',
                    tagBg: '',
                    descColor: 'text-white/70 [.theme-clear_&]:text-slate-600',
                    Icon: FileCheck,
                    title: 'Menunggu Persetujuan Kaprodi (HOD)',
                    tag: 'Disetujui Guru',
                    desc: 'Guru Produktif sudah menyetujui. Sekarang menunggu persetujuan & penjadwalan dari Ketua Program.',
                  },
                  scheduled: {
                    bg: 'bg-emerald-500/10 [.theme-clear_&]:bg-emerald-50',
                    border: 'border-emerald-500/20 [.theme-clear_&]:border-emerald-200',
                    iconBg: 'bg-emerald-500',
                    titleColor: 'text-emerald-400 [.theme-clear_&]:text-emerald-700',
                    tagColor: 'text-emerald-500/60',
                    tagBg: '',
                    descColor: 'text-white/70 [.theme-clear_&]:text-slate-600',
                    Icon: CheckCircle,
                    title: 'Ujian Sertifikasi Terjadwal!',
                    tag: 'Confirmed',
                    desc: 'Sertifikasi disetujui penuh & jadwal ujian tersedia.',
                    detailBg: 'bg-emerald-500/20 [.theme-clear_&]:bg-emerald-100/50',
                    detailBorder: 'border-emerald-500/20',
                    detailColor: 'text-emerald-300 [.theme-clear_&]:text-emerald-700',
                  },
                  rejected: {
                    bg: 'bg-red-500/10 [.theme-clear_&]:bg-red-50',
                    border: 'border-red-500/20 [.theme-clear_&]:border-red-200',
                    iconBg: 'bg-red-500',
                    titleColor: 'text-red-400 [.theme-clear_&]:text-red-700',
                    tagColor: 'text-red-500/60',
                    tagBg: '',
                    descColor: 'text-white/70 [.theme-clear_&]:text-slate-600',
                    Icon: XCircle,
                    title: 'Pendaftaran Ditolak',
                    tag: 'Rejected',
                    desc: krsSubmission.notes ? `Catatan: ${krsSubmission.notes}` : 'Pendaftaran sertifikasimu ditolak. Kamu bisa mendaftar ulang setelah perbaikan.',
                  },
                };
                const config = statusConfig[krsSubmission.status];
                if (!config) return null;
                const { bg, border, iconBg, titleColor, tagColor, descColor, Icon, title, tag, desc } = config;

                return (
                  <div className="animate-fadeInUp stagger-delay-1">
                    <div className={`${bg} border ${border} rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-sm`}>
                      <div className={`p-2.5 ${iconBg} rounded-xl shadow-lg shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className={`${titleColor} font-black text-sm uppercase tracking-wider`}>{title}</h3>
                          <span className={`text-[10px] font-bold ${tagColor} uppercase`}>{tag}</span>
                        </div>
                        <p className={`${descColor} text-xs leading-relaxed mb-2`}>{desc}</p>
                        {krsSubmission.status === 'scheduled' && scheduledExam && (
                          <div className={`inline-flex items-center gap-2 px-2.5 py-1 ${config.detailBg} rounded-lg border ${config.detailBorder} ${config.detailColor} font-bold text-[10px]`}>
                            <span className="opacity-60 font-medium tracking-tight">JADWAL:</span>
                            {new Date(scheduledExam.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        )}
                        {krsSubmission.status === 'rejected' && (
                          <button
                            onClick={() => setShowMissionModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg border border-red-500/20 text-red-300 [.theme-clear_&]:text-red-700 font-bold text-[10px] transition-all"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Daftar Ulang
                          </button>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-medium text-white/30 [.theme-clear_&]:text-slate-400">{krsSubmission.items.length} kompetensi terdaftar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="card-glass rounded-xl p-4 shadow-sm border border-white/6 animate-slideInRight stagger-delay-2 flex flex-col [.theme-clear_&]:border-slate-200 [.theme-clear_&]:shadow-none">
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
                            <div className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-sm border border-white/10" style={{ backgroundColor: myStats.levelColor }}>
                              {myStats.level} Badge
                            </div>
                            <div className="text-sm text-white/50 px-2 border-l border-white/10 [.theme-clear_&]:text-slate-600 [.theme-clear_&]:border-slate-200">
                              {myStats.className}
                            </div>
                            {myStats.attendance_pcent !== undefined && (
                              <div className="flex items-center gap-2 px-2 border-l border-white/10 shrink-0">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight [.theme-clear_&]:text-slate-500">PRESENSI</span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-black ${myStats.attendance_pcent >= 90 ? 'text-emerald-400 [.theme-clear_&]:text-emerald-600' : myStats.attendance_pcent >= 75 ? 'text-amber-400 [.theme-clear_&]:text-amber-600' : 'text-red-400 [.theme-clear_&]:text-red-600'}`}>
                                      {myStats.attendance_pcent}%
                                    </span>
                                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden [.theme-clear_&]:bg-slate-200">
                                      <div
                                        className={`h-full transition-all duration-1000 ${myStats.attendance_pcent >= 90 ? 'bg-emerald-500' : myStats.attendance_pcent >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${myStats.attendance_pcent}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-bold text-white/60 [.theme-clear_&]:text-slate-700">{myStats.masuk} <span className="font-normal opacity-50 [.theme-clear_&]:text-slate-400">M</span></span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    <span className="text-[10px] font-bold text-white/60 [.theme-clear_&]:text-slate-700">{myStats.izin} <span className="font-normal opacity-50 [.theme-clear_&]:text-slate-400">I</span></span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                    <span className="text-[10px] font-bold text-white/60 [.theme-clear_&]:text-slate-700">{myStats.sakit} <span className="font-normal opacity-50 [.theme-clear_&]:text-slate-400">S</span></span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    <span className="text-[10px] font-bold text-white/60 [.theme-clear_&]:text-slate-700">{myStats.alfa} <span className="font-normal opacity-50 [.theme-clear_&]:text-slate-400">A</span></span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <button
                              onClick={() => setShowSkillCard(true)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/20 transition-all group"
                            >
                              <Contact className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Skill Card
                            </button>

                            <button
                              onClick={() => setShowHistoryModal(true)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-500/20 transition-all group"
                            >
                              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              Passport
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-white/40 animate-pulse">Loading stats...</div>
                      )}
                    </div>
                  </div>

                ) : (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Teacher Avatar Trigger */}
                        <button
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="relative group transition-transform hover:scale-105 active:scale-95 shrink-0"
                          title="Ubah Foto Profil"
                        >
                          <ProfileAvatar
                            name={user?.name || 'User'}
                            avatarUrl={(user as any)?.avatar_url}
                            photoUrl={(user as any)?.photo_url}
                            size="md"
                            jurusanColor="#6366f1" // Indigo for teachers
                            className="shadow-lg border-2 border-white/20"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Edit3 className="w-4 h-4 text-white" />
                          </div>
                        </button>

                        <div>
                          <div className="text-sm text-white/70">Overview</div>
                          <div className="text-2xl font-bold">
                            {useMock ? mockData.mockJurusan.length : jurusanList.length} Jurusan • {overallStats.totalStudents} Siswa
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-white/60 text-right">
                        <div className="font-semibold">{user?.name}</div>
                        <div className="text-xs">
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
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                        <div className="text-xs text-white/70">Top Jurusan</div>
                        <div className="text-sm font-semibold mt-2">{overallStats.topJurusan}</div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                        <div className="text-xs text-white/70">Average Skor</div>
                        <div className="text-sm font-semibold mt-2">{globalAvg}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
              krsStatus={krsSubmission?.status}
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
        {/* Student History Modal */}
        {showHistoryModal && user && myStats && (
          <StudentHistoryModal
            isOpen={showHistoryModal}
            onClose={() => setShowHistoryModal(false)}
            studentName={user.name}
            studentNisn={user.nisn}
            studentKelas={myStats.className}
            jurusanName={jurusanList.find(j => j.id === user.jurusan_id)?.nama_jurusan || 'Teknik'}
            history={myHistory}
            levels={mockData.mockLevels} // Use mock levels or real levels depending on context, keeping as is for now
            hodName={hodName}
            walasName={walasName}
            avatarUrl={(user as any)?.avatar_url}
            photoUrl={(user as any)?.photo_url}
          />
        )}
      </div>

    </div>
  );
}
