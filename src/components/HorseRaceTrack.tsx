import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Flag, Trophy, Zap, Timer } from 'lucide-react';
import type { RaceParticipant } from '../types';

interface HorseRaceTrackProps {
    participants: RaceParticipant[];
    title?: string;
    subtitle?: string;
    autoStart?: boolean;
    trigger?: boolean;
}

// Horse/Jockey colors
const horseColors = [
    { jersey: '#3B82F6', horse: '#8B4513', accent: '#1D4ED8' },   // Blue
    { jersey: '#8B5CF6', horse: '#654321', accent: '#6D28D9' },   // Purple
    { jersey: '#10B981', horse: '#A0522D', accent: '#047857' },   // Green
    { jersey: '#F59E0B', horse: '#D2691E', accent: '#D97706' },   // Yellow
    { jersey: '#EF4444', horse: '#8B4513', accent: '#DC2626' },   // Red
    { jersey: '#EC4899', horse: '#CD853F', accent: '#BE185D' },   // Pink
    { jersey: '#6366F1', horse: '#A0522D', accent: '#4338CA' },   // Indigo
    { jersey: '#14B8A6', horse: '#D2B48C', accent: '#0D9488' },   // Teal
];

export function HorseRaceTrack({
    participants,
    title = "🏇 JURUSAN DERBY",
    subtitle = "The Championship Race",
    autoStart = true,
    trigger = false
}: HorseRaceTrackProps) {
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
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            const timer = setTimeout(() => {
                setCountdown(null);
                setStartRace(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (startRace && winner) {
            const timer = setTimeout(() => setShowConfetti(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [startRace, winner]);

    return (
        <div className="relative min-h-[700px] card-glass backdrop-blur-xl rounded-2xl border border-slate-300 dark:border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
            {/* Grass Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-800 via-green-700 to-green-900 [.theme-clear_&]:from-green-200 [.theme-clear_&]:via-green-100 [.theme-clear_&]:to-green-200 opacity-30 pointer-events-none" />

            {/* Grass Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(34,197,94,0.3) 2px, rgba(34,197,94,0.3) 4px)`,
                }}
            />

            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl shadow-lg shadow-amber-500/30">
                        <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">
                            {title}
                        </h2>
                        <div className="text-sm text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2 mt-1">
                            <Timer className="w-4 h-4" />
                            <span>{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-white/70 bg-white/80 dark:bg-black/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        <span>Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏇</span>
                        <span>Racing</span>
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
                            className="flex flex-col items-center"
                        >
                            <div className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 drop-shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                                {countdown === 0 ? "GO!" : countdown}
                            </div>
                            {countdown > 0 && (
                                <div className="text-2xl text-white/60 mt-4">Get Ready...</div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Finish Line Post */}
            <div className="absolute right-8 top-32 bottom-32 z-20 flex flex-col items-center">
                <div className="w-2 h-full bg-gradient-to-b from-white via-red-500 to-white"
                    style={{
                        backgroundSize: '100% 20px',
                        backgroundImage: 'repeating-linear-gradient(0deg, white 0px, white 10px, red 10px, red 20px)',
                    }}
                />
                <Flag className="w-8 h-8 text-red-500 absolute -top-6" />
            </div>

            {/* Race Tracks */}
            <div className="relative z-10 space-y-2 mt-8">
                {sortedParticipants.map((p, index) => {
                    const color = horseColors[index % horseColors.length];
                    const isLeader = index === 0;
                    const progress = (p.score / maxScore) * 100;

                    return (
                        <div key={p.id} className="flex items-center gap-4">
                            {/* Lane Number */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${isLeader
                                ? 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                : 'bg-white/80 [.theme-clear_&]:bg-white text-slate-600 border-slate-300'
                                }`}>
                                {index + 1}
                            </div>

                            {/* Track Lane */}
                            <div className="flex-1 relative h-16 bg-amber-900/20 [.theme-clear_&]:bg-amber-100 rounded-lg overflow-hidden border-y-4 border-white/20 [.theme-clear_&]:border-amber-200">
                                {/* Dirt Track Texture */}
                                <div className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: `radial-gradient(circle, rgba(139,69,19,0.3) 1px, transparent 1px)`,
                                        backgroundSize: '10px 10px',
                                    }}
                                />

                                {/* Lane Divider */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 [.theme-clear_&]:bg-amber-300" />

                                {/* Horse & Jockey */}
                                <motion.div
                                    initial={{ left: '2%' }}
                                    animate={startRace ? { left: `${Math.min(progress - 10, 85)}%` } : { left: '2%' }}
                                    transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.12 }}
                                    className="absolute top-1/2 -translate-y-1/2"
                                >
                                    <motion.div
                                        animate={startRace ? {
                                            y: [0, -4, 0, -2, 0],
                                            rotate: [0, 2, 0, -1, 0],
                                        } : {}}
                                        transition={{ duration: 0.3, repeat: Infinity }}
                                        className="relative"
                                    >
                                        {/* Horse Emoji with Custom Style */}
                                        <div className="relative flex items-center">
                                            {/* Jockey Number Tag */}
                                            <div
                                                className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-md"
                                                style={{ backgroundColor: color.jersey }}
                                            >
                                                {p.alias || p.name.substring(0, 2).toUpperCase()}
                                            </div>

                                            {/* Horse */}
                                            <div className="text-4xl filter drop-shadow-lg" style={{ transform: 'scaleX(-1)' }}>
                                                🏇
                                            </div>

                                            {/* Dust Effect */}
                                            {startRace && (
                                                <motion.div
                                                    animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 0.2, repeat: Infinity }}
                                                    className="absolute -left-6 bottom-1 flex gap-1"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300/30" />
                                                    <div className="w-1 h-1 rounded-full bg-amber-200/20" />
                                                </motion.div>
                                            )}

                                            {/* Leader Crown */}
                                            {isLeader && startRace && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -20 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 2.5, type: "spring" }}
                                                    className="absolute -top-8 left-1/2 -translate-x-1/2"
                                                >
                                                    <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Score & Name */}
                            <div className="w-28 text-right">
                                <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                                    {p.name}
                                </div>
                                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                                    {p.score.toFixed(1)} <span className="text-xs">XP</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Race Results Panel */}
            <div className="relative z-10 mt-8 pt-6 border-t border-amber-200/30 dark:border-amber-500/20">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-white/70">Race Standings</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sortedParticipants.slice(0, 4).map((p, index) => {
                        const color = horseColors[index % horseColors.length];
                        const medals = ['🥇', '🥈', '🥉', '4th'];
                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: startRace ? 2.5 + index * 0.1 : 0 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-amber-200 dark:border-amber-500/20"
                            >
                                <div className="text-2xl">{medals[index]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-slate-800 dark:text-white">{p.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-white/50 font-mono">{p.score.toFixed(1)} XP</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Crowd Cheering Effect */}
            {startRace && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 text-2xl opacity-60">
                    {['👏', '🎉', '📣', '🙌', '🎊', '👏', '📣', '🎉'].map((emoji, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </div>
            )}
        </div>
    );
}
