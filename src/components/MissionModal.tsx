import { useEffect, useState } from 'react';
import { X, Target, CheckCircle2, Trophy, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Jurusan, LevelSkill } from '../types';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';

// Special Missions / Challenges data
interface SpecialMission {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    icon: React.ReactNode;
    difficulty: 'easy' | 'medium' | 'hard';
    deadline?: string;
}

const specialMissions: SpecialMission[] = [
    {
        id: 'project-mini',
        title: 'Selesaikan Proyek Mini',
        description: 'Buat dan selesaikan proyek mini dalam 1 minggu',
        xpReward: 20,
        icon: <Trophy className="w-5 h-5" />,
        difficulty: 'medium',
        deadline: '7 hari'
    },
    {
        id: 'peer-mentoring',
        title: 'Bantu Teman Belajar',
        description: 'Lakukan peer mentoring dengan minimal 1 teman',
        xpReward: 10,
        icon: <Users className="w-5 h-5" />,
        difficulty: 'easy'
    },
    {
        id: 'competition',
        title: 'Ikut Lomba Jurusan',
        description: 'Berpartisipasi dalam lomba atau kompetisi jurusan',
        xpReward: 30,
        icon: <Award className="w-5 h-5" />,
        difficulty: 'hard'
    }
];

interface MissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    jurusan: Jurusan;
    currentScore: number;
    // currentLevelId is not strictly needed if we infer from score
}

export function MissionModal({ isOpen, onClose, jurusan, currentScore }: MissionModalProps) {
    const [loading, setLoading] = useState(true);
    const [nextLevel, setNextLevel] = useState<LevelSkill | null>(null);
    const [missions, setMissions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadNextMission();
        }
    }, [isOpen, jurusan.id, currentScore]);

    async function loadNextMission() {
        try {
            setLoading(true);
            let levels: LevelSkill[] = [];

            if (isMockMode) {
                levels = mockData.getLevelsForJurusan(jurusan.id);
            } else {
                const { data, error } = await supabase
                    .from('level_skill')
                    .select('*')
                    .order('min_skor', { ascending: true });

                if (error) throw error;
                // Basic mapping if needed, assuming same structure for now or relying on JurusanDetailPage logic
                // For simplicity, we just take the global levels or specific logic if adapted
                // To be robust, let's assume we might need to parse hasil_belajar as well
                levels = (data || []).map((l: any) => {
                    let criteria: string[] = [];
                    try {
                        if (l.hasil_belajar && l.hasil_belajar.trim().startsWith('[')) {
                            criteria = JSON.parse(l.hasil_belajar);
                        } else if (l.hasil_belajar) {
                            criteria = [l.hasil_belajar];
                        }
                    } catch (e) {
                        criteria = [l.hasil_belajar];
                    }
                    return { ...l, criteria };
                }) as LevelSkill[];
            }

            // Find the next level
            // A simple logic: Find the first level where min_skor > currentScore
            // OR if the user is in a level, they might imply they want to see criteria TO COMPLETE existing level or reach NEXT.
            // Usually "missions" are criteria to achieve the CURRENT level's max score or Next Level?
            // Let's assume: Show criteria for the level *immediately above* the user's current score bracket.
            // If user has 78 (Master), next is... nothing? Or show Master criteria if not fully maxed?
            // Let's stick to: criteria of the level the user is CURRENTLY IN or AIMING FOR.

            // Logic: Find the level corresponding to the score.
            let target = levels.find(l => currentScore >= l.min_skor && currentScore <= l.max_skor);

            // If we want "Next Mission", if user is 0, they are in Novice. They need to do Novice tasks.
            // So we show the CURRENT level's criteria.

            // If no level found (e.g. score 101?), fallback
            if (!target && levels.length > 0) target = levels[levels.length - 1];

            setNextLevel(target || null);
            setMissions(target?.criteria || []);

        } catch (error) {
            console.error("Failed to load missions", error);
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600 relative overflow-hidden shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div className="text-blue-100 text-sm font-bold tracking-wider uppercase">Misi Saat Ini</div>
                                <h2 className="text-2xl font-black text-white">{nextLevel?.nama_level || 'Loading...'}</h2>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <>
                                <div className="text-white/80 leading-relaxed">
                                    Untuk menguasai level ini dan melangkah ke tingkat berikutnya, kamu harus membuktikan kompetensi berikut:
                                </div>

                                <div className="space-y-3">
                                    {missions.length > 0 ? (
                                        missions.map((mission, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                                <div className="mt-0.5 p-1 rounded-full border border-indigo-500/50 text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-all">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{mission}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-white/40 italic">
                                            Belum ada misi khusus untuk level ini.
                                        </div>
                                    )}
                                </div>

                                {/* Special Missions / Challenge Section */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
                                            <Trophy className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">🎯 Misi Spesial</h3>
                                            <p className="text-xs text-white/50">Tantangan opsional dengan hadiah XP besar!</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {specialMissions.map((mission) => (
                                            <div
                                                key={mission.id}
                                                className="relative p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:from-purple-500/20 hover:to-pink-500/20 transition-all group cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2.5 rounded-xl shadow-lg ${mission.difficulty === 'hard'
                                                        ? 'bg-gradient-to-br from-red-500 to-orange-500'
                                                        : mission.difficulty === 'medium'
                                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                                                            : 'bg-gradient-to-br from-green-400 to-emerald-500'
                                                        } text-white`}>
                                                        {mission.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-white group-hover:text-purple-200 transition-colors">
                                                                {mission.title}
                                                            </h4>
                                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${mission.difficulty === 'hard'
                                                                ? 'bg-red-500/20 text-red-400'
                                                                : mission.difficulty === 'medium'
                                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                                    : 'bg-green-500/20 text-green-400'
                                                                }`}>
                                                                {mission.difficulty === 'hard' ? 'Sulit' : mission.difficulty === 'medium' ? 'Sedang' : 'Mudah'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-white/60 mb-2">{mission.description}</p>
                                                        {mission.deadline && (
                                                            <span className="text-xs text-white/40">⏱️ Batas waktu: {mission.deadline}</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg shadow-yellow-500/25">
                                                            <span className="text-sm font-black text-black">+{mission.xpReward}</span>
                                                            <span className="text-xs font-bold text-black/70">XP</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-black/20 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-white text-indigo-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            <span>Siap, Laksanakan!</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
