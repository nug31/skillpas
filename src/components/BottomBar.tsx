import { motion } from 'framer-motion';
import { Home, Trophy, BookOpen, User, LogOut, Zap, Medal } from 'lucide-react';

interface BottomBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onOpenGuide: () => void;
    onLogout: () => void;
    isStudent?: boolean;
}

export function BottomBar({ activeTab, onTabChange, onOpenGuide, onLogout, isStudent }: BottomBarProps) {
    const tabs = isStudent ? [
        { id: 'home', icon: Home, label: 'Beranda' },
        { id: 'misi', icon: Zap, label: 'Misi' },
        { id: 'passport', icon: Medal, label: 'Passport' },
        { id: 'skillcard', icon: Trophy, label: 'ID Card' },
        { id: 'guide', icon: BookOpen, label: 'Panduan', action: onOpenGuide },
    ] : [
        { id: 'home', icon: Home, label: 'Beranda' },
        { id: 'race', icon: Trophy, label: 'Race' },
        { id: 'guide', icon: BookOpen, label: 'Panduan', action: onOpenGuide },
        { id: 'profile', icon: User, label: 'Profil' }
    ];

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-6 py-3 pb-safe">
            <div className="flex items-center justify-between max-w-md mx-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => tab.action ? tab.action() : onTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id
                            ? 'text-indigo-400 scale-110'
                            : 'text-white/40 hover:text-white/60'
                            }`}
                    >
                        <div className="relative">
                            <tab.icon className="w-5 h-5" />
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-400 rounded-full"
                                />
                            )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight">{tab.label}</span>
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="flex flex-col items-center gap-1 text-white/20 hover:text-red-400/60 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Keluar</span>
                </button>
            </div>
        </nav>
    );
}
