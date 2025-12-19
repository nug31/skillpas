import { useEffect, useState } from 'react';
import { X, Target, Trophy, Users, Award, Plus, Check, Info } from 'lucide-react';
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
    siswaId?: string;
}

export function MissionModal({ isOpen, onClose, jurusan, currentScore, siswaId = 'guest' }: MissionModalProps) {
    const [loading, setLoading] = useState(true);
    const [allLevels, setAllLevels] = useState<LevelSkill[]>([]);
    const [nextLevel, setNextLevel] = useState<LevelSkill | null>(null);
    const [selectedKRS, setSelectedKRS] = useState<string[]>([]);
    const storageKey = `skillpas_krs_${siswaId}`;

    useEffect(() => {
        if (isOpen) {
            loadAllLevels();
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    setSelectedKRS(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse KRS", e);
                }
            }
        }
    }, [isOpen, jurusan.id, currentScore, storageKey]);

    async function loadAllLevels() {
        try {
            setLoading(true);
            let levels: LevelSkill[] = [];

            if (isMockMode) {
                levels = mockData.getLevelsForJurusan(jurusan.id);
            } else {
                const { data, error } = await supabase
                    .from('level_skill')
                    .select('*')
                    .order('urutan', { ascending: true });

                if (error) throw error;
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
            setAllLevels(levels);

            let currentLevel = levels.find(l => currentScore >= l.min_skor && currentScore <= l.max_skor);
            if (!currentLevel && levels.length > 0) currentLevel = levels[levels.length - 1];
            setNextLevel(currentLevel || null);

        } catch (error) {
            console.error("Failed to load levels", error);
        } finally {
            setLoading(false);
        }
    }

    const toggleKRS = (mission: string) => {
        let newKRS = [...selectedKRS];
        if (newKRS.includes(mission)) {
            newKRS = newKRS.filter(m => m !== mission);
        } else {
            if (newKRS.length >= 10) { // Increased to 10 for cross-level
                alert("Maksimal 10 target kompetensi dalam sekali ambil.");
                return;
            }
            newKRS.push(mission);
        }
        setSelectedKRS(newKRS);
        localStorage.setItem(storageKey, JSON.stringify(newKRS));

        // Dispatch custom event to notify dashboard
        window.dispatchEvent(new CustomEvent('krs-updated'));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
                                <div className="text-blue-100 text-sm font-bold tracking-wider uppercase">KRS Skill: Bebas Pilih Target</div>
                                <h2 className="text-2xl font-black text-white">Susun Rencana Belajarmu</h2>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : (
                            <>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-200 leading-relaxed">
                                        Sekarang kamu bebas memilih kriteria dari level manapun! Klik kriteria untuk masuk ke rencana belajarmu. ({selectedKRS.length}/10)
                                    </p>
                                </div>

                                {allLevels.map((level) => {
                                    const isCurrentLevel = nextLevel?.id === level.id;
                                    return (
                                        <div key={level.id} className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="px-3 py-1 rounded-lg text-xs font-black text-white shadow-lg shrink-0"
                                                    style={{ backgroundColor: level.badge_color }}
                                                >
                                                    {level.badge_name.toUpperCase()}
                                                </div>
                                                <h3 className="text-white font-bold text-lg truncate">{level.nama_level}</h3>
                                                {isCurrentLevel && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/30 whitespace-nowrap">
                                                        LEVEL KAMU 📍
                                                    </span>
                                                )}
                                                <div className="flex-1 h-px bg-white/10"></div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {level.criteria && level.criteria.map((mission, idx) => {
                                                    const isSelected = selectedKRS.includes(mission);
                                                    return (
                                                        <div
                                                            key={`${level.id}-${idx}`}
                                                            onClick={() => toggleKRS(mission)}
                                                            className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer group ${isSelected
                                                                ? 'bg-indigo-500/20 border-indigo-500 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                        >
                                                            <div className="flex gap-3">
                                                                <div className={`mt-0.5 p-1 rounded-full border transition-all shrink-0 ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-indigo-500/20 text-indigo-400/50 group-hover:border-indigo-500/50 group-hover:text-indigo-400'
                                                                    }`}>
                                                                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                                </div>
                                                                <span className={`text-xs sm:text-sm transition-colors ${isSelected ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                                    {mission}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Extra Missions */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
                                            <Trophy className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">🎯 Tantangan Global</h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {specialMissions.map((mission) => (
                                            <div
                                                key={mission.id}
                                                className="relative p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group cursor-pointer"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2 rounded-xl shadow-lg ${mission.difficulty === 'hard' ? 'bg-red-500' : mission.difficulty === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'} text-white`}>
                                                        {mission.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-white text-sm">{mission.title}</h4>
                                                        <p className="text-xs text-white/50">{mission.description}</p>
                                                    </div>
                                                    <div className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded text-[10px] font-black">+{mission.xpReward} XP</div>
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
                            <span>Simpan Rencana</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
