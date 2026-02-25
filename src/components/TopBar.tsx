import { LogOut, Zap, Medal, Sun, Moon } from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';

interface TopBarProps {
    user: any;
    isTeacher: boolean;
    themeClear: boolean;
    onToggleTheme: () => void;
    onLogout: () => void;
    onBackToHome: () => void;
    onOpenSkillCard?: () => void;
    onOpenPassport?: () => void;
}

export function TopBar({
    user,
    isTeacher,
    themeClear,
    onToggleTheme,
    onLogout,
    onBackToHome,
    onOpenSkillCard,
    onOpenPassport
}: TopBarProps) {
    return (
        <header className="sticky top-0 z-50 w-full py-3 px-4 sm:py-4 sm:px-6 border-b border-white/6 bg-slate-900/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={onBackToHome}
                >
                    <img src="/logo.png" alt="SMK Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0 logo-adaptive group-hover:scale-110 transition-transform" />
                    <div>
                        <div className="min-w-0">
                            <div className="text-sm sm:text-lg font-black tracking-tighter text-white">SKILL PASSPORT</div>
                            <div className="text-[10px] text-white/40 truncate hidden sm:block uppercase tracking-widest font-bold">SMK Mitra Industri MM2100</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isTeacher && (
                        <div className="hidden sm:flex items-center gap-2 mr-2 pr-4 border-r border-white/10">
                            <button
                                onClick={onOpenSkillCard}
                                className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                                title="Skill Card"
                            >
                                <Zap className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onOpenPassport}
                                className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                                title="Passport"
                            >
                                <Medal className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-2xl bg-white/5 border border-white/5">
                        <div className="text-right">
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Logged in as</div>
                            <div className="text-xs font-bold text-white">{user?.name}</div>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${isTeacher
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}>
                            {isTeacher ? 'Staff' : 'Student'}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            aria-label="Toggle theme"
                            onClick={onToggleTheme}
                            className="w-9 h-9 rounded-full border border-white/6 flex items-center justify-center bg-transparent hover:bg-white/5 transition-all text-white"
                        >
                            {themeClear ? (
                                <Sun className="w-4 h-4" />
                            ) : (
                                <Moon className="w-4 h-4" />
                            )}
                        </button>

                        <button
                            onClick={onLogout}
                            className="hidden sm:flex w-9 h-9 rounded-full border border-white/6 items-center justify-center bg-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all text-white hover:text-red-400"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>

                        <div className="pl-2 border-l border-white/10 ml-2">
                            <ProfileAvatar
                                name={user?.name || ''}
                                avatarUrl={(user as any)?.avatar_url}
                                photoUrl={(user as any)?.photo_url}
                                size="sm"
                                variant={isTeacher ? 'professional' : 'gamified'}
                                className="border-2 border-white/10 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
