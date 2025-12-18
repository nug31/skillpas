import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Flag, Gauge, Trophy, Zap } from 'lucide-react';
import type { RaceParticipant } from '../types';
import { useRaceSound } from '../hooks/useRaceSound';

interface IsometricRaceTrackProps {
    participants: RaceParticipant[];
    title?: string;
    subtitle?: string;
    autoStart?: boolean;
    trigger?: boolean;
}

// Color palette for cars
const carColors = [
    { body: '#3B82F6', accent: '#1D4ED8' },   // Blue
    { body: '#8B5CF6', accent: '#6D28D9' },   // Purple
    { body: '#10B981', accent: '#047857' },   // Green
    { body: '#F59E0B', accent: '#D97706' },   // Yellow
    { body: '#EF4444', accent: '#DC2626' },   // Red
    { body: '#EC4899', accent: '#BE185D' },   // Pink
    { body: '#6366F1', accent: '#4338CA' },   // Indigo
    { body: '#14B8A6', accent: '#0D9488' },   // Teal
];

export function IsometricRaceTrack({
    participants,
    title = "JURUSAN RACE SERIES",
    subtitle = "Live Average Score Competition",
    autoStart = true,
    trigger = false
}: IsometricRaceTrackProps) {
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
            playBeep(440, 0.1);
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
            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
                        <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">{title}</h2>
                        <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium flex items-center gap-2 mt-1">
                            <Gauge className="w-4 h-4" />
                            <span>{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-white/50 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 shadow-inner [.theme-clear_&]:bg-white [.theme-clear_&]:text-slate-900">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        <span>Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span>Moving Fast</span>
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
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-600 drop-shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                        >
                            {countdown === 0 ? "GO!" : countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3D Isometric Race Track */}
            <div
                className="relative z-10 mt-4"
                style={{
                    perspective: '1200px',
                    perspectiveOrigin: '50% 30%',
                }}
            >
                {/* Track Container - Isometric View */}
                <div
                    className="relative mx-auto"
                    style={{
                        transform: 'rotateX(55deg) rotateZ(-45deg)',
                        transformStyle: 'preserve-3d',
                        width: '100%',
                        maxWidth: '600px',
                    }}
                >
                    {/* Track Base */}
                    <div
                        className="relative bg-gradient-to-br from-slate-700 to-slate-900 [.theme-clear_&]:from-slate-300 [.theme-clear_&]:to-slate-400 rounded-lg shadow-2xl"
                        style={{
                            padding: '20px',
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Racing Lanes */}
                        <div className="space-y-3">
                            {sortedParticipants.map((p, index) => {
                                const color = carColors[index % carColors.length];
                                const isLeader = index === 0;
                                const progress = (p.score / maxScore) * 100;

                                return (
                                    <div
                                        key={p.id}
                                        className="relative h-12 bg-slate-600/50 [.theme-clear_&]:bg-slate-200 rounded-lg overflow-hidden border border-slate-500/30 [.theme-clear_&]:border-slate-400"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Lane Stripes */}
                                        <div className="absolute inset-0 flex items-center">
                                            {[...Array(10)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className="h-1 w-8 bg-yellow-400/30 ml-4"
                                                    style={{ transform: 'translateZ(1px)' }}
                                                />
                                            ))}
                                        </div>

                                        {/* Progress Track */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={startRace ? { width: `${progress}%` } : { width: 0 }}
                                            transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.15 }}
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-emerald-500/20 to-emerald-500/40 rounded-lg"
                                        />

                                        {/* 3D Car */}
                                        <motion.div
                                            initial={{ left: '5%' }}
                                            animate={startRace ? { left: `${progress - 5}%` } : { left: '5%' }}
                                            transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.15 }}
                                            className="absolute top-1/2 -translate-y-1/2"
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* Car Body */}
                                            <div
                                                className="relative w-16 h-8 rounded-lg shadow-lg flex items-center justify-center"
                                                style={{
                                                    background: `linear-gradient(135deg, ${color.body} 0%, ${color.accent} 100%)`,
                                                    transform: 'translateZ(8px)',
                                                    boxShadow: `0 4px 15px ${color.body}40, 0 2px 4px rgba(0,0,0,0.3)`,
                                                }}
                                            >
                                                {/* Car Top */}
                                                <div
                                                    className="absolute -top-2 left-3 right-3 h-4 rounded-t-lg"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${color.body} 0%, ${color.accent} 100%)`,
                                                    }}
                                                />

                                                {/* Car Windows */}
                                                <div className="absolute top-0 left-4 right-4 h-2 bg-blue-200/30 rounded-t" />

                                                {/* Car Initials */}
                                                <span className="text-white font-bold text-xs z-10">
                                                    {p.alias || p.name.substring(0, 2).toUpperCase()}
                                                </span>

                                                {/* Wheels */}
                                                <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600" />
                                                <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600" />

                                                {/* Leader Crown */}
                                                {isLeader && startRace && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 2.5, type: "spring" }}
                                                        className="absolute -top-6 left-1/2 -translate-x-1/2"
                                                    >
                                                        <Trophy className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                                                    </motion.div>
                                                )}

                                                {/* Speed Lines */}
                                                {startRace && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ duration: 0.3, repeat: 3, delay: index * 0.15 }}
                                                        className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-1"
                                                    >
                                                        <div className="w-4 h-0.5 bg-white/60 rounded" />
                                                        <div className="w-3 h-0.5 bg-white/40 rounded" />
                                                        <div className="w-2 h-0.5 bg-white/20 rounded" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>

                                        {/* Rank Number */}
                                        <div
                                            className={`absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isLeader
                                                ? 'bg-yellow-400 text-yellow-900'
                                                : 'bg-slate-500/50 text-white/70 [.theme-clear_&]:bg-slate-400 [.theme-clear_&]:text-white'
                                                }`}
                                            style={{ transform: 'translateZ(2px)' }}
                                        >
                                            {index + 1}
                                        </div>

                                        {/* Finish Line */}
                                        <div
                                            className="absolute right-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(0deg,white,white_4px,black_4px,black_8px)]"
                                            style={{ transform: 'translateZ(1px)' }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Track Edge Glow */}
                        <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                            boxShadow: 'inset 0 0 30px rgba(255,255,255,0.1)',
                        }} />
                    </div>

                    {/* Shadow */}
                    <div
                        className="absolute inset-0 bg-black/20 blur-xl -z-10"
                        style={{ transform: 'translateZ(-20px) translateY(20px)' }}
                    />
                </div>
            </div>

            {/* Leaderboard Sidebar */}
            <div className="relative z-10 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-white/70">Live Standings</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sortedParticipants.slice(0, 4).map((p, index) => {
                        const color = carColors[index % carColors.length];
                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: startRace ? 2.5 + index * 0.1 : 0 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                    style={{ background: `linear-gradient(135deg, ${color.body}, ${color.accent})` }}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-slate-800 dark:text-white">{p.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-white/50 font-mono">{p.score.toFixed(1)} XP</div>
                                </div>
                                {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
