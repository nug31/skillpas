import { useEffect, useState, useRef } from 'react';
import { HomePage } from './components/HomePage';
import { JurusanDetailPage } from './components/JurusanDetailPage';
import { LoginPage } from './components/LoginPage';
import { Footer } from './components/Footer';
import { PassportStamp } from './components/PassportStamp';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Jurusan } from './types';
import { TeacherKRSApproval } from './components/TeacherKRSApproval';
import { NotificationToast } from './components/NotificationToast';
import ReloadPrompt from './components/ReloadPrompt';
import { PassportPublicView } from './components/Passport/PassportPublicView';
import { WalasDashboard } from './components/WalasDashboard';
import { ConnectionStatus } from './components/ConnectionStatus';
import { EvidenceDashboard } from './components/EvidenceDashboard';
import { TopBar } from './components/TopBar';
import { BottomBar } from './components/BottomBar';
import { GuideModal } from './components/GuideModal';
import { SkillCard } from './components/SkillCard';
import { StudentHistoryModal } from './components/StudentHistoryModal';
import { MissionModal } from './components/MissionModal';
import { supabase, isMockMode } from './lib/supabase';
import mockData from './mocks/mockData';
import type { StudentStats, CompetencyHistory, LevelSkill } from './types';

function AppContent() {
  const { user, logout, isAuthenticated, isTeacher } = useAuth();
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | undefined>(undefined);
  const [showKRSApproval, setShowKRSApproval] = useState(false);
  const [showWalasDashboard, setShowWalasDashboard] = useState(false);
  const [showEvidenceDashboard, setShowEvidenceDashboard] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [showSkillCard, setShowSkillCard] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Student Data States
  const [myStats, setMyStats] = useState<StudentStats | null>(null);
  const [myHistory, setMyHistory] = useState<CompetencyHistory[]>([]);
  const [allLevels, setAllLevels] = useState<LevelSkill[]>([]);
  const [hodName, setHodName] = useState<string | undefined>(undefined);
  const [walasName, setWalasName] = useState<string>('Sri Wahyuni, S.Pd');
  const [jurusanList, setJurusanList] = useState<any[]>([]);
  const prevAuthRef = useRef(isAuthenticated);
  const [themeClear, setThemeClear] = useState<boolean>(() => {
    try {
      return localStorage.getItem('theme') === 'clear';
    } catch (e) {
      return false;
    }
  });

  // Detect login event (transition from not authenticated to authenticated)
  useEffect(() => {
    if (!prevAuthRef.current && isAuthenticated && user) {
      // User just logged in - show stamp animation
      setShowStampAnimation(true);
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, user]);

  useEffect(() => {
    const root = document.documentElement;
    if (themeClear) root.classList.add('theme-clear'); else root.classList.remove('theme-clear');
    try { localStorage.setItem('theme', themeClear ? 'clear' : 'dark'); } catch (e) { }
  }, [themeClear]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      import('./lib/notificationStore').then(({ notificationStore }) => {
        notificationStore.actions.fetchNotifications(user.id);
      });
    }
  }, [isAuthenticated, user?.id]);

  // Reset app state when user changes (login/logout)
  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.action === 'login' || customEvent.detail?.action === 'logout') {
        // Reset all navigation state to go back to main dashboard
        setSelectedJurusan(null);
        setSelectedClassFilter(undefined);
        setShowKRSApproval(false);
        setShowWalasDashboard(false);
        setShowEvidenceDashboard(false);
        setActiveTab('home');
        setMyStats(null);
        setMyHistory([]);
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  // Fetch student specific data
  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      loadStudentData();
    }
  }, [isAuthenticated, user]);

  const loadStudentData = async () => {
    if (!user) return;
    try {
      // 1. Load Levels & Jurusan first (needed for stats)
      if (isMockMode) {
        mockData.mockJurusan.find((j: any) => j.id === user.jurusan_id) || mockData.mockJurusan[0];
      } else {
        const { data: levelsData } = await supabase.from('level_skill').select('*').order('urutan');
        const { data: jurData } = await supabase.from('jurusan').select('*');
        setAllLevels(levelsData || []);
        setJurusanList(jurData || []);
      }

      // 2. Load Stats
      if (isMockMode) {
        const student = mockData.mockSiswa.find(s => s.nama === user.name);
        if (student) {
          const allStudents = mockData.getStudentListForJurusan(student.jurusan_id);
          const classStudents = allStudents.filter(s => s.kelas === student.kelas);
          classStudents.sort((a, b) => b.skor - a.skor);
          const rank = classStudents.findIndex(s => s.id === student.id) + 1;
          const skill = mockData.mockSkillSiswa.find(ss => ss.siswa_id === student.id);
          const score = skill?.skor || 0;
          const levelObj = mockData.mockLevels.find(l => score >= l.min_skor && score <= l.max_skor);
          const discipline = mockData.mockDiscipline.find(d => d.siswa_id === student.id);

          setMyStats({
            rank: rank > 0 ? rank : 0,
            totalStudents: classStudents.length,
            score: score,
            poin: skill?.poin || 0,
            level: levelObj?.badge_name || 'Basic',
            levelColor: levelObj?.badge_color || '#94a3b8',
            className: student.kelas,
            attendance_pcent: discipline?.attendance_pcent ?? 100,
            masuk: discipline?.masuk ?? 0,
            izin: discipline?.izin ?? 0,
            sakit: discipline?.sakit ?? 0,
            alfa: discipline?.alfa ?? 0,
            siswa_id: student.id
          });
          setMyHistory((mockData as any).mockCompetencyHistory?.filter((r: any) => r.siswa_id === student.id) || []);
        }
      } else {
        const { data: student } = await supabase.from('siswa').select('*, skill_siswa(skor, poin)').eq('id', user.id).maybeSingle();
        if (student) {
          const score = (student as any).skill_siswa?.[0]?.skor || 0;
          const { count: rankCount } = await supabase.from('siswa').select('id, skill_siswa!inner(skor)', { count: 'exact', head: true }).eq('kelas', student.kelas).gt('skill_siswa.skor', score);
          const { count: totalClass } = await supabase.from('siswa').select('id', { count: 'exact', head: true }).eq('kelas', student.kelas);
          const { data: discData } = await supabase.from('student_discipline').select('*').eq('siswa_id', student.id).maybeSingle();

          let badge = 'Basic 1';
          let color = '#94a3b8';
          if (score >= 90) { badge = 'Master'; color = '#10b981'; }
          else if (score >= 76) { badge = 'Advance'; color = '#f59e0b'; }
          else if (score >= 51) { badge = 'Specialist'; color = '#3b82f6'; }
          else if (score >= 26) { badge = 'Basic 2'; color = '#64748b'; }

          setMyStats({
            rank: (rankCount || 0) + 1,
            totalStudents: totalClass || 0,
            score,
            poin: (student as any).skill_siswa?.[0]?.poin || 0,
            level: badge,
            levelColor: color,
            className: student.kelas,
            attendance_pcent: discData?.attendance_pcent ?? 100,
            masuk: discData?.masuk ?? 0,
            izin: discData?.izin ?? 0,
            sakit: discData?.sakit ?? 0,
            alfa: discData?.alfa ?? 0,
            siswa_id: student.id
          });

          const { data: historyData } = await supabase.from('competency_history').select('*').eq('siswa_id', student.id).order('tanggal', { ascending: false });
          setMyHistory(historyData || []);

          // HOD & Walas
          const { data: hodData } = await supabase.from('users').select('name').eq('role', 'hod').eq('jurusan_id', student.jurusan_id).maybeSingle();
          if (hodData) setHodName(hodData.name);
          const { data: walasData } = await supabase.from('users').select('name').in('role', ['wali_kelas', 'teacher_produktif', 'teacher']).eq('kelas', student.kelas).maybeSingle();
          if (walasData) setWalasName(walasData.name);
        }
      }
    } catch (e) {
      console.error("Error loading global student data:", e);
    }
  };

  // Detect verification link (public view)
  const urlParams = new URLSearchParams(window.location.search);
  const verifyId = urlParams.get('verify');

  if (verifyId) {
    return <PassportPublicView siswaId={verifyId} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Show passport stamp animation after login
  if (showStampAnimation && user) {
    return (
      <PassportStamp
        userName={user.name}
        photoUrl={(user as any)?.photo_url}
        avatarUrl={(user as any)?.avatar_url}
        onComplete={() => setShowStampAnimation(false)}
      />
    );
  }

  const handleBackToHome = () => {
    setSelectedJurusan(null);
    setSelectedClassFilter(undefined);
    setShowKRSApproval(false);
    setShowWalasDashboard(false);
    setShowEvidenceDashboard(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      handleBackToHome();
    } else if (tab === 'race') {
      handleBackToHome();
      setTimeout(() => {
        const raceSection = document.getElementById('dashboard-race');
        if (raceSection) raceSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (tab === 'misi') {
      setShowMissionModal(true);
    } else if (tab === 'passport') {
      setShowHistoryModal(true);
    } else if (tab === 'skillcard') {
      setShowSkillCard(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-20 sm:pb-0 transition-colors duration-300">
      <TopBar
        user={user}
        isTeacher={isTeacher}
        themeClear={themeClear}
        onToggleTheme={() => setThemeClear(!themeClear)}
        onLogout={logout}
        onBackToHome={handleBackToHome}
        onOpenSkillCard={() => setShowSkillCard(true)}
        onOpenPassport={() => setShowHistoryModal(true)}
      />

      <main className="flex-1">
        {showWalasDashboard ? (
          <WalasDashboard
            user={user!}
            onBack={() => setShowWalasDashboard(false)}
          />
        ) : showKRSApproval ? (
          <TeacherKRSApproval
            onBack={() => setShowKRSApproval(false)}
            user={user!}
          />
        ) : showEvidenceDashboard ? (
          <EvidenceDashboard
            user={user!}
            onBack={() => setShowEvidenceDashboard(false)}
          />
        ) : selectedJurusan ? (
          <JurusanDetailPage
            jurusan={selectedJurusan}
            onBack={() => setSelectedJurusan(null)}
            classFilter={selectedClassFilter}
          />
        ) : (
          <HomePage
            onSelectJurusan={(jurusan, classFilter) => {
              setSelectedJurusan(jurusan);
              setSelectedClassFilter(classFilter);
            }}
            onOpenKRSApproval={() => setShowKRSApproval(true)}
            onOpenWalasDashboard={() => setShowWalasDashboard(true)}
            onOpenEvidenceDashboard={() => setShowEvidenceDashboard(true)}
            onOpenGuide={() => setIsGuideModalOpen(true)}
            onOpenSkillCard={() => setShowSkillCard(true)}
            onOpenPassport={() => setShowHistoryModal(true)}
            onOpenMissionModal={() => setShowMissionModal(true)}
            myStats={myStats}
            allLevels={allLevels}
            onUpdateStats={loadStudentData}
          />
        )}
      </main>
      <Footer />

      <BottomBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onLogout={logout}
        isStudent={user?.role === 'student'}
      />

      <GuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        userRole={user?.role}
      />

      {/* Global Student Modals */}
      {showSkillCard && user && myStats && (
        <SkillCard
          student={{
            id: user.id || '',
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
          jurusanName={jurusanList.find(j => j.id === user.jurusan_id)?.nama_jurusan || 'Teknik'}
          onClose={() => setShowSkillCard(false)}
        />
      )}

      {showHistoryModal && user && myStats && (
        <StudentHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          studentName={user.name}
          studentNisn={(user as any).nisn}
          studentKelas={myStats.className}
          jurusanName={jurusanList.find(j => j.id === user.jurusan_id)?.nama_jurusan || 'Teknik'}
          history={myHistory}
          levels={allLevels}
          hodName={hodName}
          walasName={walasName}
          avatarUrl={(user as any)?.avatar_url}
          photoUrl={(user as any)?.photo_url}
        />
      )}

      {showMissionModal && user && myStats && jurusanList.length > 0 && (
        <MissionModal
          isOpen={showMissionModal}
          onClose={() => setShowMissionModal(false)}
          jurusan={jurusanList.find(j => j.id === user.jurusan_id) || jurusanList[0]}
          currentScore={myStats.score}
          currentPoin={myStats.poin}
          siswaId={myStats?.siswa_id || user.id}
        />
      )}

      <NotificationToast />
      <ConnectionStatus />
      <ReloadPrompt />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

