import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Jurusan, RaceParticipant, StudentStats } from '../types';
import { F1RaceTrack } from './F1RaceTrack';
import { Podium } from './Podium';
import { StudentXPBar } from './StudentXPBar';
import { CompetencyRadar } from './CompetencyRadar';
import { FocusJourney } from './FocusJourney';
import { ProfileAvatar } from './ProfileAvatar';
import { AvatarSelectionModal } from './AvatarSelectionModal';
import { useAuth } from '../contexts/AuthContext';
import * as Icons from 'lucide-react';



interface DashboardRaceProps {
    jurusanData: Array<{
        jurusan: Jurusan;
        averageSkor: number;
        studentCount: number;
    }>;
    trigger?: number; // now a timestamp or signal
    myStats?: StudentStats | null;
    showCompetition?: boolean;
    onContinue?: () => void;
}

type ViewMode = 'list' | 'race' | 'podium';

// Color palette matching the uploaded image design
const colorPalette = [
    'from-blue-500 to-blue-600',     // 1. Teknik Mesin (Blue)
    'from-purple-500 to-purple-600', // 2. Teknik Instalasi (Purple)
    'from-green-500 to-emerald-500', // 3. Teknik Kendaraan (Green)
    'from-yellow-400 to-amber-500',  // 4. Akuntansi (Yellow)
    'from-red-500 to-rose-600',      // 5. Teknik Kimia (Red)
    'from-pink-500 to-fuchsia-600',  // 6. Perhotelan (Pink)
    'from-indigo-500 to-blue-600',   // 7. Teknik Sepeda Motor (Indigo/Blue)
    'from-teal-400 to-teal-600',     // 8. TEI (Teal)
];

export function DashboardRace({ jurusanData, trigger = 0, myStats, showCompetition = true, onContinue }: DashboardRaceProps) {
    const { user, updateUser } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('race');
    const [selectedKRS, setSelectedKRS] = useState<string[]>([]);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    // Load KRS
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
                } else {
                    setSelectedKRS([]);
                }
            }
        };
        loadKRS();
        window.addEventListener('krs-updated', loadKRS);
        return () => window.removeEventListener('krs-updated', loadKRS);
    }, [myStats, user]);

    // Stats Calculation
    const totalJurusan = jurusanData.length;
    const totalSiswa = jurusanData.reduce((acc, curr) => acc + curr.studentCount, 0);
    const avgSchoolScore = totalJurusan > 0
        ? jurusanData.reduce((acc, curr) => acc + curr.averageSkor, 0) / totalJurusan
        : 0;

    // Watch for external trigger to force race view
    const [lastTrigger, setLastTrigger] = useState(trigger);
    if (trigger !== lastTrigger) {
        setLastTrigger(trigger);
        setViewMode('race');
    }

    const sortedData = [...jurusanData].sort((a, b) => b.averageSkor - a.averageSkor);
    const topJurusan = sortedData[0];

    // Map to RaceParticipant
    const participants: RaceParticipant[] = sortedData.map((item, index) => {
        const colorClass = colorPalette[index % colorPalette.length];
        return {
            id: item.jurusan.id,
            name: item.jurusan.nama_jurusan,
            score: item.averageSkor,
            label: `${item.studentCount} Siswa`,
            // We can pass color class to RaceTrack if it supports it
            color: `bg-gradient-to-r ${colorClass}`,
            alias: item.jurusan.nama_jurusan.substring(0, 2).toUpperCase(),
            badge_name: index < 3 ? (index === 0 ? 'Champion' : 'Top Tier') : 'Contender'
        };
    });

    const topParticipants = participants.slice(0, 3);

    return (
        <div className="space-y-8 animate-fadeIn">
            {myStats ? (
                <div className="space-y-8">
                    {/* SECTION 1: FOCUS HERO (Concept 3) */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 card-glass p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 border-none shadow-2xl group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-5 mb-6">
                                    <button
                                        onClick={() => setIsAvatarModalOpen(true)}
                                        className="relative group transition-transform hover:scale-105 active:scale-95"
                                        title="Ubah Avatar"
                                    >
                                        <ProfileAvatar
                                            name={user?.name || 'Siswa'}
                                            avatarUrl={(user as any)?.avatar_url}
                                            photoUrl={(user as any)?.photo_url}
                                            level={myStats.level}
                                            size="lg"
                                            jurusanColor="#6366f1"
                                            className="shadow-2xl border-white/40"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Icons.Edit3 className="w-6 h-6 text-white" />
                                        </div>
                                    </button>
                                    <div>
                                        <div className="flex gap-2 mb-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20">
                                                <Icons.Zap className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span>{myStats.score} XP</span>
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm border border-white/20">
                                                <Icons.Medal className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                                                <span>{myStats.poin} POIN</span>
                                            </div>
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
                                            Siap Naik Level, {user?.name.split(' ')[0]}?
                                        </h2>
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 mb-8 max-w-md text-lg leading-relaxed">
                                Kamu sudah mencapai <span className="font-bold text-white">{myStats.score} XP</span>. Butuh <span className="font-bold text-white">{100 - myStats.score} XP</span> lagi menuju <span className="font-bold text-white">Advanced Master</span>!
                            </p>
                            <button
                                onClick={onContinue}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Icons.PlayCircle className="w-6 h-6 fill-current" />
                                Lanjut Belajar
                            </button>
                        </div>

                        {/* Relocated Competency Radar */}
                        <div className="lg:col-span-2 card-glass p-0 rounded-3xl flex flex-col justify-center items-center relative min-h-[300px] bg-slate-900/40 border-white/5 overflow-hidden">
                            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                                    <Icons.Target className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Matrix Radar</span>
                            </div>
                            <div className="w-full h-full flex items-center justify-center p-4 transform scale-110">
                                <CompetencyRadar score={myStats.score} />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: JOURNEY TIMELINE (Concept 3) */}
                    <div className="card-glass p-8 rounded-3xl">
                        <div className="flex items-center gap-2 mb-6">
                            <Icons.Map className="w-5 h-5 text-[color:var(--text-muted)]" />
                            <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Your Journey</h3>
                        </div>
                        <FocusJourney currentLevel={myStats.level} score={myStats.score} />
                    </div>

                    {/* SECTION 3: GAMIFICATION & SKILLS (Hybrid) */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* XP Bar & Daily Mission */}
                        <div className="space-y-6">
                            <div className="card-glass p-6 rounded-2xl relative overflow-hidden">
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

                            {/* KRS / Learning Plan Widget */}
                            <div className="card-glass p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                            <Icons.BookOpen className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white">Rencana Belajar Saya</h3>
                                    </div>
                                    <button
                                        onClick={onContinue}
                                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                                    >
                                        Ubah Rencana <Icons.ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedKRS.length > 0 ? (
                                        selectedKRS.map((skill, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                                            >
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
                                            <button
                                                onClick={onContinue}
                                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg"
                                            >
                                                Susun KRS Sekarang
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Card 1: Total Jurusan */}
                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
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

                    {/* Card 2: Total Siswa */}
                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
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

                    {/* Card 3: Avg Score */}
                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
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

                    {/* Card 4: Top Jurusan */}
                    <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
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
            )
            }

            {
                showCompetition && (
                    <>
                        {/* View Toggles */}
                        <div className="flex justify-center mb-8">
                            <div className="card-glass p-1.5 rounded-2xl flex gap-1 shadow-2xl">
                                <button
                                    onClick={() => setViewMode('race')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'race'
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icons.Flag className="w-4 h-4" />
                                    <span>Race Track</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('podium')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'podium'
                                        ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icons.Trophy className="w-4 h-4" />
                                    <span>Podium 3D</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'list'
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                                        }`}
                                >
                                    <Icons.BarChart3 className="w-4 h-4" />
                                    <span>Leaderboard</span>
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <AnimatePresence mode="wait">
                            {viewMode === 'race' && (
                                <motion.div
                                    key="race"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <F1RaceTrack
                                        participants={participants}
                                        title="🏎️ Jurusan Grand Prix"
                                        subtitle="Formula 1 Championship"
                                        autoStart={false}
                                        trigger={trigger > 0}
                                    />
                                </motion.div>
                            )}

                            {viewMode === 'podium' && (
                                <motion.div
                                    key="podium"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Podium participants={topParticipants} title="Top Majors Podium" subtitle="Best Average Scores" />
                                </motion.div>
                            )}

                            {viewMode === 'list' && (
                                <motion.div
                                    key="list"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="card-glass rounded-2xl p-6 shadow-2xl"
                                >
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg shadow-lg">
                                            <Icons.Medal className="w-5 h-5 text-white" />
                                        </div>
                                        Jurusan Leaderboard
                                    </h3>
                                    <div className="space-y-4">
                                        {participants.length > 0 ? (
                                            participants.map((p, idx) => {
                                                const originalIndex = idx; // Since sorted
                                                const IconComponent = (Icons as any)[sortedData[originalIndex].jurusan.icon] || Icons.GraduationCap;
                                                const colorClass = colorPalette[originalIndex % colorPalette.length];

                                                return (
                                                    <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:bg-white/10 transition-all group">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${idx === 0 ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                                                                idx === 1 ? 'bg-gray-300 text-black' :
                                                                    idx === 2 ? 'bg-orange-400 text-black' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-white/50'
                                                                }`}>
                                                                {idx + 1}
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
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
                                                <p className="text-sm text-white/40 max-w-sm mx-auto leading-relaxed">
                                                    Peringkat jurusan akan muncul secara otomatis setelah ada data siswa yang di-import melalui menu <span className="text-indigo-400 font-bold">Jurusan</span>.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )
            }

            <AvatarSelectionModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                currentAvatar={(user as any)?.photo_url || (user as any)?.avatar_url}
                onSelect={(url) => {
                    // If URL is from dicebear, it's an avatar URL
                    if (url.includes('dicebear.com')) {
                        updateUser({ avatar_url: url, photo_url: undefined } as any);
                    } else {
                        updateUser({ photo_url: url } as any);
                    }
                    setIsAvatarModalOpen(false);
                }}
            />
        </div >
    );
}

