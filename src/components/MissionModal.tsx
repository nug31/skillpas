import { useEffect, useState } from 'react';
import { X, Target, Trophy, Users, Award, Plus, Check, Info, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Jurusan, LevelSkill } from '../types';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { KRSSubmission } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { groupCriteria, cleanSubItemText } from '../lib/criteriaHelper';

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
    currentPoin: number;
    siswaId?: string;
}

export function MissionModal({ isOpen, onClose, jurusan, currentScore, currentPoin, siswaId = 'guest' }: MissionModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [allLevels, setAllLevels] = useState<LevelSkill[]>([]);
    const [nextLevel, setNextLevel] = useState<LevelSkill | null>(null);
    const [selectedKRS, setSelectedKRS] = useState<string[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [submission, setSubmission] = useState<KRSSubmission | null>(null);
    const storageKey = `skillpas_krs_${siswaId}`;

    useEffect(() => {
        const loadKRS = async () => {
            const sub = await krsStore.getStudentSubmission(siswaId);
            setSubmission(sub || null);
            if (sub) {
                setSelectedKRS(sub.items);
            } else {
                const saved = localStorage.getItem(storageKey);
                if (saved) {
                    try {
                        setSelectedKRS(JSON.parse(saved));
                    } catch (e) {
                        console.error("Failed to parse KRS", e);
                    }
                }
            }
        };

        if (isOpen) {
            loadAllLevels();
            loadKRS();
        }

        window.addEventListener(KRS_UPDATED_EVENT, loadKRS);
        return () => window.removeEventListener(KRS_UPDATED_EVENT, loadKRS);
    }, [isOpen, jurusan.id, currentScore, storageKey, siswaId]);

    async function loadAllLevels() {
        try {
            setLoading(true);
            let levels: LevelSkill[] = [];

            if (isMockMode) {
                levels = mockData.getLevelsForJurusan(jurusan.id);
            } else {
                const [levelsResult, overridesResult] = await Promise.all([
                    supabase.from('level_skill').select('*').order('urutan', { ascending: true }),
                    supabase.from('level_skill_jurusan').select('*').eq('jurusan_id', jurusan.id)
                ]);

                if (levelsResult.error) throw levelsResult.error;
                if (overridesResult.error) throw overridesResult.error;

                const levelsData = levelsResult.data || [];
                const overrides = overridesResult.data || [];

                levels = levelsData.map((l: any) => {
                    const ov = overrides.find((o: any) => o.level_id === l.id);
                    const finalHasilBelajar = ov?.hasil_belajar || l.hasil_belajar;
                    const finalSoftSkill = ov?.soft_skill || l.soft_skill;

                    let criteria: string[] = [];
                    try {
                        if (finalHasilBelajar && finalHasilBelajar.trim().startsWith('[')) {
                            criteria = JSON.parse(finalHasilBelajar);
                        } else if (finalHasilBelajar) {
                            criteria = [finalHasilBelajar];
                        }
                    } catch (e) {
                        criteria = [finalHasilBelajar];
                    }
                    return { ...l, hasil_belajar: finalHasilBelajar, soft_skill: finalSoftSkill, criteria };
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

    const toggleGroup = (groupId: string) => {
        const next = new Set(expandedGroups);
        if (next.has(groupId)) next.delete(groupId);
        else next.add(groupId);
        setExpandedGroups(next);
    };

    const toggleKRS = (mission: string, levelId: string) => {
        // Prevent selection if not current level
        if (!nextLevel || nextLevel.id !== levelId) {
            return;
        }

        let newKRS = [...selectedKRS];
        if (newKRS.includes(mission)) {
            newKRS = newKRS.filter(m => m !== mission);
        } else {
            if (newKRS.length >= 10) {
                alert("Maksimal 10 target kompetensi dalam sekali ambil.");
                return;
            }
            newKRS.push(mission);
        }
        setSelectedKRS(newKRS);
        localStorage.setItem(storageKey, JSON.stringify(newKRS));
    };

    const handleSubmit = async () => {
        if (selectedKRS.length === 0) {
            alert("Pilih minimal satu kriteria kompetensi.");
            return;
        }

        await krsStore.submitKRS({
            id: submission?.id || Math.random().toString(36).substr(2, 9),
            siswa_id: siswaId,
            siswa_nama: user?.name || 'Siswa',
            kelas: user?.kelas || 'XII TKR 1',
            jurusan_id: jurusan.id,
            items: selectedKRS
        });

        alert("KRS berhasil diajukan! Tunggu persetujuan guru.");
        onClose();
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending_produktif': return 'Menunggu Guru Produktif';
            case 'pending_wali': return 'Dipantau Wali Kelas';
            case 'pending_hod': return 'Menunggu Kaprodi (HOD)';
            case 'approved': return 'Disetujui';
            case 'scheduled': return 'Ujian Terjadwal';
            case 'rejected': return 'Ditolak';
            default: return status;
        }
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
                                <div className="text-blue-100 text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                                    KRS Skill • <span className="text-yellow-300 font-bold">{currentScore} XP</span> • <span className="text-emerald-300 font-bold">{currentPoin} Poin</span>
                                </div>
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
                                {submission && (
                                    <div className={`p-4 rounded-xl border flex flex-col gap-2 ${submission.status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                                        submission.status === 'scheduled' ? 'bg-emerald-500/10 border-emerald-500/20' :
                                            'bg-blue-500/10 border-blue-500/20'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full animate-pulse ${submission.status === 'rejected' ? 'bg-red-500' :
                                                    submission.status === 'scheduled' ? 'bg-emerald-500' :
                                                        'bg-blue-500'
                                                    }`} />
                                                <span className="text-xs font-bold uppercase tracking-wider text-white/70">Status KRS</span>
                                            </div>
                                            <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10 rounded">
                                                {getStatusLabel(submission.status)}
                                            </span>
                                        </div>
                                        {submission.exam_date && submission.status === 'scheduled' && (
                                            <div className="text-sm font-bold text-emerald-400">
                                                📅 Jadwal Ujian: {new Date(submission.exam_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                                            </div>
                                        )}
                                        {submission.notes && (
                                            <div className="text-xs text-white/50 italic">
                                                Catatan: {submission.notes}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3">
                                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-200 leading-relaxed">
                                        Pilih kriteria kompetensi di <strong>Level Kamu</strong> untuk melanjutkan rencana belajar. ({selectedKRS.length}/10)
                                    </p>
                                </div>

                                {allLevels.map((level) => {
                                    const isCurrentLevel = nextLevel?.id === level.id;
                                    const isLocked = !isCurrentLevel;

                                    return (
                                        <div key={level.id} className={`space-y-4 ${isLocked ? 'opacity-50 grayscale' : ''}`}>
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

                                            <div className="space-y-2">
                                                {level.criteria && (() => {
                                                    const groups = groupCriteria(level.criteria);

                                                    // Helper to render **bold** text and handle \n
                                                    const renderBold = (text: string, isSub = false) => {
                                                        const cleanText = isSub ? cleanSubItemText(text) : text;
                                                        const parts = cleanText.split(/(\*\*.*?\*\*)/g);
                                                        return parts.map((part, index) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return <strong key={index} className="font-black text-white">{part.slice(2, -2)}</strong>;
                                                            }
                                                            return (
                                                                <span key={index}>
                                                                    {part.split('\n').map((line, i) => (
                                                                        <span key={i}>
                                                                            {i > 0 && <br />}
                                                                            {line}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            );
                                                        });
                                                    };

                                                    return groups.map((group, gIdx) => {
                                                        const groupKey = `${level.id}-${gIdx}`;
                                                        const hasSubs = group.subs.length > 0;
                                                        const isExpanded = expandedGroups.has(groupKey);
                                                        const isSelected = selectedKRS.includes(group.main);

                                                        return (
                                                            <div key={groupKey} className="space-y-2">
                                                                {/* Main Item / Group Header */}
                                                                <div
                                                                    onClick={() => {
                                                                        if (hasSubs) toggleGroup(groupKey);
                                                                        else toggleKRS(group.main, level.id);
                                                                    }}
                                                                    className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${isLocked ? 'cursor-not-allowed bg-white/5 border-white/5' : 'cursor-pointer group'
                                                                        } ${isSelected
                                                                            ? 'bg-indigo-500/20 border-indigo-500 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]'
                                                                            : !isLocked ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20' : ''
                                                                        }`}
                                                                >
                                                                    <div className="flex gap-3">
                                                                        <div className="mt-0.5 shrink-0 transition-colors">
                                                                            {hasSubs ? (
                                                                                isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400/50" />
                                                                            ) : (
                                                                                <div className={`p-1 rounded-full border ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-indigo-500/20 text-indigo-400/50 group-hover:border-indigo-500/50 group-hover:text-indigo-400'}`}>
                                                                                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <span className={`text-xs sm:text-sm transition-colors ${isSelected ? 'text-white font-black' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                                            {renderBold(group.main)}
                                                                        </span>
                                                                    </div>
                                                                    {hasSubs && <span className="text-[10px] font-black text-indigo-400/40 uppercase mt-1">{group.subs.length} Detail</span>}
                                                                </div>

                                                                {/* Sub Items */}
                                                                <AnimatePresence>
                                                                    {hasSubs && isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="overflow-hidden space-y-2 ml-4 border-l border-white/5 pl-4"
                                                                        >
                                                                            {group.subs.map((sub, sIdx) => {
                                                                                const isSubSelected = selectedKRS.includes(sub);
                                                                                return (
                                                                                    <div
                                                                                        key={sIdx}
                                                                                        onClick={() => toggleKRS(sub, level.id)}
                                                                                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${isLocked ? 'cursor-not-allowed bg-white/5 border-white/5' : 'cursor-pointer group'
                                                                                            } ${isSubSelected
                                                                                                ? 'bg-emerald-500/10 border-emerald-500/50'
                                                                                                : !isLocked ? 'bg-white/5 border-white/5 hover:bg-white/10' : ''
                                                                                            }`}
                                                                                    >
                                                                                        <div className={`mt-0.5 p-1 rounded-full border shrink-0 transition-all ${isSubSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-500/20 text-emerald-400/50'}`}>
                                                                                            {isSubSelected ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                                                                                        </div>
                                                                                        <span className={`text-xs transition-colors ${isSubSelected ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                                                                            {renderBold(sub, true)}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    });
                                                })()}
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
                    <div className="p-6 border-t border-white/5 bg-black/20 shrink-0 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!!(submission && !['rejected', 'scheduled', 'completed'].includes(submission.status))}
                            className={`flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${submission && !['rejected', 'scheduled', 'completed'].includes(submission.status)
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-white text-indigo-900 hover:bg-gray-100 active:scale-95'
                                }`}
                        >
                            <span>{submission ? 'Update Rencana' : 'Ajukan KRS'}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
