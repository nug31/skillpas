import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Flag, Trophy, Zap, Timer } from 'lucide-react';
import type { RaceParticipant } from '../types';

interface F1RaceTrackProps {
    participants: RaceParticipant[];
    title?: string;
    subtitle?: string;
    autoStart?: boolean;
    trigger?: boolean;
}

// F1 Team colors matching jurusan themes
const f1Colors = [
    { primary: '#3B82F6', secondary: '#1D4ED8', accent: '#60A5FA' },   // Blue - Teknik Mesin
    { primary: '#8B5CF6', secondary: '#6D28D9', accent: '#A78BFA' },   // Purple - Teknik Instalasi
    { primary: '#10B981', secondary: '#047857', accent: '#34D399' },   // Green - Teknik Kendaraan
    { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24' },   // Yellow - Akuntansi
    { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171' },   // Red - Teknik Kimia
    { primary: '#EC4899', secondary: '#BE185D', accent: '#F472B6' },   // Pink - Perhotelan
    { primary: '#6366F1', secondary: '#4338CA', accent: '#818CF8' },   // Indigo - TSM
    { primary: '#14B8A6', secondary: '#0D9488', accent: '#2DD4BF' },   // Teal - TEI
];

export function F1RaceTrack({
    participants,
    title = "🏎️ JURUSAN GRAND PRIX",
    subtitle = "Formula 1 Championship",
    autoStart = true,
    trigger = false
}: F1RaceTrackProps) {
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

    // F1 Car Component
    const F1Car = ({ color, isLeader, label }: { color: typeof f1Colors[0], isLeader: boolean, label: string }) => (
        <div className="relative">
            {/* Car Label */}
            <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] font-bold text-white shadow-sm whitespace-nowrap bg-black/40 backdrop-blur-[2px] border border-white/20 z-10"
                style={{ borderBottomColor: color.primary }}
            >
                {label}
            </div>

            {/* F1 Car SVG - Side View */}
            <svg width="50" height="24" viewBox="0 0 50 24" className="drop-shadow-md">
                {/* Rear Wing */}
                <rect x="0" y="4" width="8" height="4" fill={color.secondary} rx="1" />
                <rect x="2" y="8" width="4" height="6" fill={color.secondary} opacity="0.8" />

                {/* Wheels (Back Layer) */}
                <g fill="#1f2937">
                    <circle cx="12" cy="16" r="5" />
                    <circle cx="40" cy="16" r="5" />
                </g>

                {/* Body */}
                <path
                    d="M10 14 L10 10 L18 8 L32 8 L44 12 L48 15 L48 17 L10 17 Z"
                    fill={color.primary}
                />

                {/* Cockpit & Driver */}
                <circle cx="28" cy="7" r="3.5" fill="#fbbf24" stroke="#000" strokeWidth="0.5" />

                {/* Sidepod Accent */}
                <path d="M20 12 L34 12 L32 15 L20 15 Z" fill={color.accent} />

                {/* Front Wing */}
                <path d="M44 15 L50 15 L50 17 L42 17 Z" fill={color.secondary} />

                {/* Wheels (Rims) */}
                <g fill="#e5e7eb" opacity="0.6">
                    <circle cx="12" cy="16" r="2.5" />
                    <circle cx="40" cy="16" r="2.5" />
                </g>
            </svg>

            {/* Leader Crown */}
            {isLeader && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5, type: "spring" }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-20"
                >
                    <Trophy className="w-4 h-4 text-yellow-400 drop-shadow-lg" />
                </motion.div>
            )}
        </div>
    );

    return (
        <div className="relative min-h-[500px] sm:min-h-[700px] card-glass backdrop-blur-xl rounded-2xl border border-slate-300 dark:border-white/10 p-4 sm:p-8 overflow-hidden shadow-2xl">
            {/* Track Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 [.theme-clear_&]:from-slate-200 [.theme-clear_&]:via-slate-100 [.theme-clear_&]:to-slate-200 opacity-50 pointer-events-none" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: `linear-gradient(90deg, white 1px, transparent 1px), linear-gradient(white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            />

            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg shadow-red-500/30">
                        <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">
                            {title}
                        </h2>
                        <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2 mt-1">
                            <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-white/70 bg-white/80 dark:bg-black/30 px-4 py-2 rounded-full border border-red-200 dark:border-red-500/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        <span>Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🏎️</span>
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
                            <div className="text-5xl sm:text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.5)] text-center tracking-tighter">
                                {countdown === 0 ? "LIGHTS OUT!" : countdown}
                            </div>
                            {countdown > 0 && (
                                <div className="text-xl sm:text-2xl text-white/60 mt-4 font-bold tracking-widest uppercase">
                                    {countdown === 1 ? "Get Set..." : "Ready..."}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* Race Tracks */}
            <div className="relative z-10 space-y-3 mt-8">
                {sortedParticipants.map((p, index) => {
                    const color = f1Colors[index % f1Colors.length];
                    const isLeader = index === 0;
                    const progress = (p.score / maxScore) * 100;

                    return (
                        <div key={p.id} className="flex items-center gap-2 sm:gap-4">
                            {/* Position Number */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-black border-2 flex-shrink-0 ${isLeader
                                ? 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                                : index === 1
                                    ? 'bg-slate-300 text-slate-700 border-slate-400'
                                    : index === 2
                                        ? 'bg-orange-400 text-orange-900 border-orange-500'
                                        : 'bg-white/80 [.theme-clear_&]:bg-white text-slate-600 border-slate-300'
                                }`}>
                                P{index + 1}
                            </div>

                            {/* Track Lane */}
                            <div className="flex-1 relative h-10 sm:h-14 bg-slate-700/30 [.theme-clear_&]:bg-slate-200 rounded-lg overflow-hidden border border-white/10 [.theme-clear_&]:border-slate-300">
                                {/* Track Markings */}
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                                    {[...Array(15)].map((_, i) => (
                                        <div key={i} className="h-0.5 w-4 sm:w-6 bg-white/20 [.theme-clear_&]:bg-slate-400/30 ml-4 sm:ml-8" />
                                    ))}
                                </div>

                                {/* Track edge */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-red-500/50" />
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-red-500/50" />

                                {/* Finish Line */}
                                <div className="absolute right-0 top-0 bottom-0 w-3 z-10 opacity-80"
                                    style={{
                                        backgroundImage: `repeating-conic-gradient(#000 0deg 90deg, #fff 90deg 180deg)`,
                                        backgroundSize: '4px 4px',
                                    }}
                                />

                                {/* F1 Car */}
                                <motion.div
                                    initial={{ left: '2%' }}
                                    animate={startRace ? { left: `${Math.min(progress - 12, 85)}%` } : { left: '2%' }}
                                    transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.1 }}
                                    className="absolute top-1/2 -translate-y-1/2 scale-75 sm:scale-100 origin-left"
                                >
                                    <motion.div
                                        animate={startRace ? {
                                            x: [0, 1, 0, -1, 0],
                                        } : {}}
                                        transition={{ duration: 0.1, repeat: Infinity }}
                                    >
                                        <F1Car
                                            color={color}
                                            isLeader={isLeader && startRace}
                                            label={p.alias || p.name.substring(0, 3).toUpperCase()}
                                        />

                                        {/* Speed Lines */}
                                        {startRace && (
                                            <motion.div
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 0.15, repeat: Infinity }}
                                                className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1"
                                            >
                                                <div className="w-6 h-0.5 bg-white/40 rounded" />
                                                <div className="w-4 h-0.5 bg-white/30 rounded" />
                                                <div className="w-5 h-0.5 bg-white/40 rounded" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Score & Name */}
                            <div className="w-20 sm:w-28 text-right flex-shrink-0">
                                <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                                    {p.name}
                                </div>
                                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-white/60 truncate font-medium">
                                    {p.label}
                                </div>
                                <div className="text-sm sm:text-lg font-bold font-mono" style={{ color: color.primary }}>
                                    {p.score.toFixed(1)} <span className="text-[10px] sm:text-xs opacity-70">XP</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Race Results Panel */}
            <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/30 dark:border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-white/70">Race Standings</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {sortedParticipants.slice(0, 4).map((p, index) => {
                        const color = f1Colors[index % f1Colors.length];
                        const positions = ['🥇', '🥈', '🥉', 'P4'];
                        return (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: startRace ? 2.5 + index * 0.1 : 0 }}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/50 dark:bg-white/5 border"
                                style={{ borderColor: color.primary + '40' }}
                            >
                                <div className="text-lg sm:text-xl">{positions[index]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold truncate text-slate-800 dark:text-white">{p.name}</div>
                                    <div className="text-xs font-mono" style={{ color: color.primary }}>{p.score.toFixed(1)} XP</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
