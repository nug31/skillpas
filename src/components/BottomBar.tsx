import { motion } from 'framer-motion';
import { Home, Trophy, BookOpen, LogOut, Zap, Medal, CheckCircle, LayoutDashboard, FileCheck, LucideIcon } from 'lucide-react';

interface TabItem {
    id: string;
    icon: LucideIcon;
    label: string;
    action?: () => void;
}

interface BottomBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onOpenGuide: () => void;
    onLogout: () => void;
    onOpenKRSApproval?: () => void;
    onOpenWalasDashboard?: () => void;
    onOpenEvidenceDashboard?: () => void;
    userRole?: string;
}

export function BottomBar({
    activeTab,
    onTabChange,
    onOpenGuide,
    onLogout,
    onOpenKRSApproval,
    onOpenWalasDashboard,
    onOpenEvidenceDashboard,
    userRole
}: BottomBarProps) {
    const isStudent = userRole === 'student';

    const getTabs = (): TabItem[] => {
        if (isStudent) {
            return [
                { id: 'home', icon: Home, label: 'Beranda' },
                { id: 'misi', icon: Zap, label: 'Misi' },
                { id: 'passport', icon: Medal, label: 'Passport' },
                { id: 'skillcard', icon: Trophy, label: 'ID Card' },
                { id: 'guide', icon: BookOpen, label: 'Panduan', action: onOpenGuide },
            ];
        }

        const staffTabs: TabItem[] = [
            { id: 'home', icon: Home, label: 'Beranda' },
        ];

        if (userRole === 'wali_kelas') {
            staffTabs.push({ id: 'walas', icon: LayoutDashboard, label: 'Walas', action: onOpenWalasDashboard });
            staffTabs.push({ id: 'verif', icon: CheckCircle, label: 'Verif', action: onOpenKRSApproval });
        } else if (userRole === 'teacher_produktif') {
            staffTabs.push({ id: 'verif', icon: CheckCircle, label: 'Verif', action: onOpenKRSApproval });
            staffTabs.push({ id: 'dokumen', icon: FileCheck, label: 'Doku', action: onOpenEvidenceDashboard });
        } else if (userRole === 'hod') {
            staffTabs.push({ id: 'verif', icon: CheckCircle, label: 'Verif', action: onOpenKRSApproval });
        } else {
            // Fallback for other roles/guru
            staffTabs.push({ id: 'race', icon: Trophy, label: 'Race' });
        }

        staffTabs.push({ id: 'guide', icon: BookOpen, label: 'Panduan', action: onOpenGuide });
        return staffTabs;
    };

    const tabs = getTabs();

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
