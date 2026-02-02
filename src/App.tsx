import { useEffect, useState, useRef } from 'react';
import { HomePage } from './components/HomePage';
import { JurusanDetailPage } from './components/JurusanDetailPage';
import { LoginPage } from './components/LoginPage';
import { FooterReflexGame } from './components/FooterReflexGame';
import { PassportStamp } from './components/PassportStamp';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { Jurusan } from './types';
import smkLogo from './assets/smk-logo.png';
import { LogOut } from 'lucide-react';
import { ProfileAvatar } from './components/ProfileAvatar';
import { TeacherKRSApproval } from './components/TeacherKRSApproval';
import { NotificationToast } from './components/NotificationToast';
import ReloadPrompt from './components/ReloadPrompt';
import { PassportPublicView } from './components/Passport/PassportPublicView';

function AppContent() {
  const { user, logout, isAuthenticated, isTeacher } = useAuth();
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | undefined>(undefined);
  const [showKRSApproval, setShowKRSApproval] = useState(false);
  const [showStampAnimation, setShowStampAnimation] = useState(false);
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
      }
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full py-3 px-4 sm:py-4 sm:px-6 border-b border-white/6 bg-gradient-to-r from-[rgba(255,255,255,0.02)] to-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={smkLogo} alt="SMK Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover bg-white p-1 shadow-md flex-shrink-0" />
            <div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">Skill Passport</div>
                <div className="text-xs text-white/60 truncate hidden sm:block">Menuju vokasi berstandar industri & Terverifikasi</div>
              </div>
            </div>

          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="hidden sm:block text-sm text-white/70">
                Welcome, <span className="font-medium text-white">{user?.name}</span>
              </div>
              <div className={`hidden sm:flex px-2 py-1 rounded-md text-xs font-medium ${isTeacher
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 [.theme-clear_&]:bg-emerald-500/10 [.theme-clear_&]:text-emerald-700 [.theme-clear_&]:border-emerald-500/20'
                : 'bg-slate-500/20 text-slate-300 border border-slate-500/30 [.theme-clear_&]:bg-teal-500/10 [.theme-clear_&]:text-teal-700 [.theme-clear_&]:border-teal-500/20'
                }`}>
                {isTeacher ? 'Guru' : 'Siswa'}
              </div>
            </div>
            {/* theme toggle (only one rendered below next to avatar) */}
            <div className="flex items-center gap-2">
              <button
                aria-label="Toggle theme"
                onClick={() => setThemeClear((s) => !s)}
                title={themeClear ? 'Switch to dark' : 'Switch to clear'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/6 flex items-center justify-center bg-transparent hover:bg-white/5 transition-all text-white"
              >
                {themeClear ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>
              <button
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/6 flex items-center justify-center bg-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all text-white hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <ProfileAvatar
                name={user?.name || ''}
                avatarUrl={(user as any)?.avatar_url}
                photoUrl={(user as any)?.photo_url}
                size="sm"
                variant={user?.role === 'teacher' ? 'professional' : 'gamified'}
                className="border border-white/6"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {showKRSApproval ? (
          <TeacherKRSApproval
            onBack={() => setShowKRSApproval(false)}
            user={user!}
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
          />
        )}
      </main>
      <FooterReflexGame />
      <NotificationToast />
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

