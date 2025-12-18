import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Rocket, Star, Trophy, Zap, Sparkles } from 'lucide-react';
import type { RaceParticipant } from '../types';
import { useRaceSound } from '../hooks/useRaceSound';

interface SpaceRocketRaceProps {
    participants: RaceParticipant[];
    title?: string;
    subtitle?: string;
    autoStart?: boolean;
    trigger?: boolean;
}

// Rocket colors
const rocketColors = [
    { body: '#3B82F6', flame: '#F59E0B', accent: '#1D4ED8' },   // Blue
    { body: '#8B5CF6', flame: '#EC4899', accent: '#6D28D9' },   // Purple
    { body: '#10B981', flame: '#34D399', accent: '#047857' },   // Green
    { body: '#F59E0B', flame: '#EF4444', accent: '#D97706' },   // Yellow
    { body: '#EF4444', flame: '#F97316', accent: '#DC2626' },   // Red
    { body: '#EC4899', flame: '#F472B6', accent: '#BE185D' },   // Pink
    { body: '#6366F1', flame: '#A78BFA', accent: '#4338CA' },   // Indigo
    { body: '#14B8A6', flame: '#2DD4BF', accent: '#0D9488' },   // Teal
];

export function SpaceRocketRace({
    participants,
    title = "SPACE ROCKET RACE",
    subtitle = "Race to the Stars! 🚀",
    autoStart = true,
    trigger = false
}: SpaceRocketRaceProps) {
    const { playBeep, playStart, playVictory } = useRaceSound();
    const [startRace, setStartRace] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
    const maxScore = Math.max(...participants.map(p => p.score), 1);
    const winner = sortedParticipants[0];

    useEffect(() => {
        if (autoStart) {
            setCountdown(3);
        }
    }, [autoStart]);

    useEffect(() => {
        if (!autoStart && trigger && countdown === null && !startRace) {
            setCountdown(3);
        }
    }, [trigger, autoStart, countdown, startRace]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            playBeep(660, 0.1);
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            playStart();
            const timer = setTimeout(() => {
                setCountdown(null);
                setStartRace(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, playBeep, playStart]);

    useEffect(() => {
        if (startRace && winner) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                playVictory();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [startRace, winner, playVictory]);

    return (
        <div className="relative min-h-[700px] card-glass backdrop-blur-xl rounded-2xl border border-slate-300 dark:border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
            {/* Space Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 [.theme-clear_&]:from-indigo-100 [.theme-clear_&]:via-purple-50 [.theme-clear_&]:to-blue-100 opacity-50 pointer-events-none" />

            {/* Stars Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full [.theme-clear_&]:bg-indigo-400"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 2 + 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                        <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white [.theme-clear_&]:text-slate-800 tracking-tight uppercase flex items-center gap-2">
                            {title}
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                        </h2>
                        <div className="text-sm text-purple-300 [.theme-clear_&]:text-purple-600 font-medium flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4" />
                            <span>{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-white/70 bg-black/30 [.theme-clear_&]:bg-white [.theme-clear_&]:text-slate-700 px-4 py-2 rounded-full border border-white/10 [.theme-clear_&]:border-slate-200 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        <span>Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Rocket className="w-3 h-3 text-cyan-400" />
                        <span>Launching</span>
                    </div>
                </div>
            </div>

            {/* Countdown Overlay */}
            <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_50px_rgba(168,85,247,0.5)]"
                        >
                            {countdown === 0 ? "LAUNCH!" : countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Moon/Planet Destination */}
            <div className="absolute top-8 right-8 z-10">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 [.theme-clear_&]:from-purple-300 [.theme-clear_&]:to-purple-500 shadow-[0_0_40px_rgba(250,204,21,0.4)] flex items-center justify-center"
                >
                    <span className="text-2xl">🌙</span>
                </motion.div>
            </div>

            {/* Rocket Launch Pads */}
            <div className="relative z-10 space-y-4 mt-8">
                {sortedParticipants.map((p, index) => {
                    const color = rocketColors[index % rocketColors.length];
                    const isLeader = index === 0;
                    const progress = (p.score / maxScore) * 100;

                    return (
                        <div key={p.id} className="flex items-center gap-4">
                            {/* Rank & Name */}
                            <div className="w-32 flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isLeader
                                    ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                    : 'bg-white/10 text-white/70 [.theme-clear_&]:bg-slate-200 [.theme-clear_&]:text-slate-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className="text-sm font-bold text-white [.theme-clear_&]:text-slate-800 truncate">
                                    {p.alias || p.name.substring(0, 4).toUpperCase()}
                                </span>
                            </div>

                            {/* Launch Track */}
                            <div className="flex-1 relative h-16 bg-gradient-to-r from-slate-800/50 to-transparent [.theme-clear_&]:from-slate-200 [.theme-clear_&]:to-slate-100 rounded-lg overflow-hidden border border-white/10 [.theme-clear_&]:border-slate-300">
                                {/* Track Stars */}
                                <div className="absolute inset-0 flex items-center">
                                    {[...Array(8)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-3 h-3 text-yellow-400/20 [.theme-clear_&]:text-indigo-300 ml-8"
                                            fill="currentColor"
                                        />
                                    ))}
                                </div>

                                {/* Rocket */}
                                <motion.div
                                    initial={{ left: '2%' }}
                                    animate={startRace ? { left: `${Math.min(progress - 8, 90)}%` } : { left: '2%' }}
                                    transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.15 }}
                                    className="absolute top-1/2 -translate-y-1/2"
                                >
                                    <div className="relative">
                                        {/* Rocket Body */}
                                        <motion.div
                                            animate={startRace ? {
                                                x: [0, 2, 0, -2, 0],
                                            } : {}}
                                            transition={{ duration: 0.2, repeat: Infinity }}
                                            className="relative"
                                        >
                                            {/* Main Rocket */}
                                            <div
                                                className="w-14 h-10 rounded-r-full rounded-l-lg relative flex items-center justify-center shadow-lg"
                                                style={{
                                                    background: `linear-gradient(180deg, ${color.body} 0%, ${color.accent} 100%)`,
                                                }}
                                            >
                                                {/* Rocket Window */}
                                                <div className="w-4 h-4 rounded-full bg-blue-200 border-2 border-white/50 absolute left-6" />

                                                {/* Rocket Tip */}
                                                <div
                                                    className="absolute -right-3 w-0 h-0"
                                                    style={{
                                                        borderTop: '20px solid transparent',
                                                        borderBottom: '20px solid transparent',
                                                        borderLeft: `15px solid ${color.body}`,
                                                    }}
                                                />

                                                {/* Rocket Fins */}
                                                <div
                                                    className="absolute -bottom-2 left-2 w-4 h-3"
                                                    style={{
                                                        background: color.accent,
                                                        clipPath: 'polygon(100% 0, 0 0, 0 100%)',
                                                    }}
                                                />
                                                <div
                                                    className="absolute -top-2 left-2 w-4 h-3"
                                                    style={{
                                                        background: color.accent,
                                                        clipPath: 'polygon(100% 100%, 0 100%, 0 0)',
                                                    }}
                                                />

                                                {/* Initials */}
                                                <span className="text-white font-bold text-[10px] absolute left-1">
                                                    {p.alias || p.name.substring(0, 2).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Rocket Flame */}
                                            {startRace && (
                                                <motion.div
                                                    animate={{
                                                        scaleX: [1, 1.3, 1],
                                                        opacity: [0.8, 1, 0.8],
                                                    }}
                                                    transition={{ duration: 0.15, repeat: Infinity }}
                                                    className="absolute -left-6 top-1/2 -translate-y-1/2"
                                                >
                                                    <div
                                                        className="w-6 h-4"
                                                        style={{
                                                            background: `linear-gradient(to left, ${color.flame}, orange, red)`,
                                                            clipPath: 'polygon(100% 50%, 0 0, 30% 50%, 0 100%)',
                                                            filter: `drop-shadow(0 0 8px ${color.flame})`,
                                                        }}
                                                    />
                                                </motion.div>
                                            )}

                                            {/* Leader Crown */}
                                            {isLeader && startRace && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1, y: [0, -3, 0] }}
                                                    transition={{ delay: 2.5, type: "spring", y: { repeat: Infinity, duration: 1 } }}
                                                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                                                >
                                                    <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Finish Line (Moon) */}
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">
                                    🌙
                                </div>
                            </div>

                            {/* Score */}
                            <div className="w-20 text-right">
                                <div className="text-lg font-bold text-white [.theme-clear_&]:text-slate-800 font-mono">
                                    {p.score.toFixed(1)}
                                </div>
                                <div className="text-[10px] text-white/50 [.theme-clear_&]:text-slate-500 uppercase">XP</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Stats */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 [.theme-clear_&]:border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-white/70 [.theme-clear_&]:text-slate-600">Mission Control</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sortedParticipants.slice(0, 4).map((p, index) => {
                        const color = rocketColors[index % rocketColors.length];
                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: startRace ? 2.5 + index * 0.1 : 0 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 [.theme-clear_&]:bg-white border border-white/10 [.theme-clear_&]:border-slate-200"
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${color.body}, ${color.accent})` }}
                                >
                                    <Rocket className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-white [.theme-clear_&]:text-slate-800">{p.name}</div>
                                    <div className="text-xs text-white/50 [.theme-clear_&]:text-slate-500 font-mono">{p.score.toFixed(1)} XP</div>
                                </div>
                                {index === 0 && <Trophy className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
