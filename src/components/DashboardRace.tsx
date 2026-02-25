import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Jurusan, RaceParticipant, StudentStats } from '../types';
import { F1RaceTrack } from './F1RaceTrack';
import { Podium } from './Podium';
import { StudentXPBar } from './StudentXPBar';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { useAuth } from '../contexts/AuthContext';
import * as Icons from 'lucide-react';

interface DashboardRaceProps {
    jurusanData: Array<{
        jurusan: Jurusan;
        averageSkor: number;
        studentCount: number;
    }>;
    trigger?: number;
    myStats?: StudentStats | null;
    showCompetition?: boolean;
    onContinue?: () => void;
    krsStatus?: 'pending_produktif' | 'pending_wali' | 'pending_hod' | 'approved' | 'scheduled' | 'rejected' | 'completed';
}

type ViewMode = 'list' | 'race' | 'podium';

const colorPalette = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-emerald-500',
    'from-yellow-400 to-amber-500',
    'from-red-500 to-rose-600',
    'from-pink-500 to-fuchsia-600',
    'from-indigo-500 to-blue-600',
    'from-teal-400 to-teal-600',
];

export function DashboardRace({ jurusanData, trigger = 0, myStats, showCompetition = true, onContinue, krsStatus }: DashboardRaceProps) {
    const { user, updateUser } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('race');
    const [selectedKRS, setSelectedKRS] = useState<string[]>([]);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    useEffect(() => {
        const loadKRS = () => {
            if (myStats && user) {
                const storageKey = `skillpas_krs_${user.name === 'Siswa Mesin' ? 'siswa_mesin' : user.id}`;
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    try {
                        setSelectedKRS(JSON.parse(saved));
                    } catch (e) {
                        setSelectedKRS([]);
                    }
                }
            }
        };
        loadKRS();
        window.addEventListener('krs-updated', loadKRS);
        return () => window.removeEventListener('krs-updated', loadKRS);
    }, [myStats, user]);

    const totalJurusan = jurusanData.length;
    const totalSiswa = jurusanData.reduce((acc, curr) => acc + curr.studentCount, 0);
    const avgSchoolScore = totalJurusan > 0
        ? jurusanData.reduce((acc, curr) => acc + curr.averageSkor, 0) / totalJurusan
        : 0;

    const [lastTrigger, setLastTrigger] = useState(trigger);
    if (trigger !== lastTrigger) {
        setLastTrigger(trigger);
        setViewMode('race');
    }

    const sortedData = [...jurusanData].sort((a, b) => b.averageSkor - a.averageSkor);
    const topJurusan = sortedData[0];

    const participants: RaceParticipant[] = sortedData.map((item, index) => ({
        id: item.jurusan.id,
        name: item.jurusan.nama_jurusan,
        score: item.averageSkor,
        label: `${item.studentCount} Siswa`,
        color: `bg-gradient-to-r ${colorPalette[index % colorPalette.length]}`,
        alias: item.jurusan.nama_jurusan.substring(0, 2).toUpperCase(),
        badge_name: index < 3 ? (index === 0 ? 'Champion' : 'Top Tier') : 'Contender'
    }));

    const topParticipants = participants.slice(0, 3);

    return (
        <div className="space-y-8 animate-fadeIn">
            {myStats ? (
                /* STUDENT FOCUS VIEW */
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                        {/* THE RACE TRACK (For Students) */}
                        <div className="card-glass p-8 rounded-3xl relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/5">
                            <F1RaceTrack participants={participants} trigger={trigger > 0} />
                        </div>

                        {/* GAMIFICATION & SKILLS (For Students) */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-6">
                                <div className="card-glass p-6 rounded-2xl relative overflow-hidden border border-white/5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <Icons.Zap className="w-5 h-5 text-yellow-500 fill-current" />
                                            XP Progress
                                        </h3>
                                        <span className="text-xs font-mono opacity-50">SEASON 1</span>
                                    </div>
                                    <StudentXPBar
                                        score={myStats.score}
                                        level={myStats.level}
                                        levelColor={myStats.levelColor}
                                    />
                                </div>

                                <div className="card-glass p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-white/5">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                                <Icons.BookOpen className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">Rencana Belajar Saya</h3>
                                        </div>
                                        {(!krsStatus || krsStatus === 'rejected') && (
                                            <button
                                                onClick={onContinue}
                                                className="text-xs font-bold text-indigo-400 hover:opacity-80 transition-opacity flex items-center gap-1"
                                            >
                                                Ubah Rencana <Icons.ChevronRight className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedKRS.length > 0 ? (
                                            selectedKRS.map((skill, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                                    <div className="w-6 h-6 rounded-full border-2 border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-500/60 transition-colors">
                                                        <div className="w-2 h-2 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 group-hover:scale-125 transition-all"></div>
                                                    </div>
                                                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{skill}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-8 px-4 rounded-xl border border-dashed border-white/10 bg-white/5">
                                                <Icons.PlusCircle className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                                <p className="text-sm text-white/40 mb-4 italic">Belum ada kompetensi yang ditargetkan.</p>
                                                <button onClick={onContinue} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg">
                                                    Susun KRS Sekarang
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* OVERALL DASHBOARD (For Teachers/Admin) */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icons.LayoutDashboard className="w-16 h-16 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Icons.LayoutDashboard className="w-5 h-5" />
                            </div>
                            <span className="text-sm subtle font-medium">Total Jurusan</span>
                        </div>
                        <div className="text-2xl font-bold">{totalJurusan}</div>
                        <div className="text-xs text-blue-500 mt-1">Active Classes</div>
                    </div>

                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icons.Users className="w-16 h-16 text-purple-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Icons.Users className="w-5 h-5" />
                            </div>
                            <span className="text-sm subtle font-medium">Total Siswa</span>
                        </div>
                        <div className="text-2xl font-bold">{totalSiswa}</div>
                        <div className="text-xs text-purple-500 mt-1">Enrolled Students</div>
                    </div>

                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icons.Target className="w-16 h-16 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <Icons.Target className="w-5 h-5" />
                            </div>
                            <span className="text-sm subtle font-medium">Avg Score</span>
                        </div>
                        <div className="text-2xl font-bold">{avgSchoolScore.toFixed(1)}</div>
                        <div className="text-xs text-emerald-500 mt-1">School Average</div>
                    </div>

                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Icons.Trophy className="w-16 h-16 text-yellow-500" />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                                <Icons.Trophy className="w-5 h-5" />
                            </div>
                            <span className="text-sm subtle font-medium">Top Jurusan</span>
                        </div>
                        <div className="text-xl font-bold truncate">{topJurusan?.jurusan.nama_jurusan || '-'}</div>
                        <div className="text-xs text-yellow-600 mt-1">Leader</div>
                    </div>
                </div>
            )}

            {showCompetition && (
                <div className="space-y-8">
                    {/* View Toggles */}
                    <div className="flex justify-center mb-8">
                        <div className="card-glass p-1.5 rounded-2xl flex gap-1 shadow-2xl border border-white/5">
                            <button
                                onClick={() => setViewMode('race')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'race'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white'
                                    }`}
                            >
                                <Icons.Flag className="w-4 h-4" />
                                <span>Race Track</span>
                            </button>
                            <button
                                onClick={() => setViewMode('podium')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'podium'
                                    ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white'
                                    }`}
                            >
                                <Icons.Trophy className="w-4 h-4" />
                                <span>Podium 3D</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'list'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-white/40 dark:hover:text-white'
                                    }`}
                            >
                                <Icons.BarChart3 className="w-4 h-4" />
                                <span>Leaderboard</span>
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {viewMode === 'race' && (
                            <motion.div key="race" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <F1RaceTrack participants={participants} trigger={trigger > 0} />
                            </motion.div>
                        )}

                        {viewMode === 'podium' && (
                            <motion.div key="podium" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                                <Podium participants={topParticipants} title="Top Majors Podium" subtitle="Best Average Scores" />
                            </motion.div>
                        )}

                        {viewMode === 'list' && (
                            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="card-glass rounded-2xl p-6 shadow-2xl border border-white/5">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg shadow-lg">
                                        <Icons.Medal className="w-5 h-5 text-white" />
                                    </div>
                                    Jurusan Leaderboard
                                </h3>
                                <div className="space-y-4">
                                    {participants.length > 0 ? (
                                        participants.map((p, idx) => {
                                            const IconComponent = (Icons as any)[sortedData[idx].jurusan.icon] || Icons.GraduationCap;
                                            return (
                                                <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/5 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all group">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${idx === 0 ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-orange-400 text-black' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-white/50'}`}>
                                                            {idx + 1}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorPalette[idx % colorPalette.length]} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                                                <IconComponent className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-lg">{p.name}</div>
                                                                <div className="text-sm subtle">{p.label}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-black">{p.score.toFixed(1)}</div>
                                                        <div className="text-xs subtle font-mono">AVG SKOR</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/5">
                                            <Icons.Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
                                            <h4 className="text-lg font-bold text-white/60 mb-2">Belum ada data kompetensi</h4>
                                            <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">Peringkat jurusan akan muncul secara otomatis setelah ada data siswa.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <AvatarSelectionModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                currentAvatar={(user as any)?.photo_url || (user as any)?.avatar_url}
                onSelect={(url) => {
                    if (url.includes('dicebear.com')) {
                        updateUser({ avatar_url: url, photo_url: undefined } as any);
                    } else {
                        updateUser({ photo_url: url } as any);
                    }
                    setIsAvatarModalOpen(false);
                }}
            />
        </div>
    );
}
