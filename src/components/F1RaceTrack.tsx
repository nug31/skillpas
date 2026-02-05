import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Flag, Trophy, Zap, Timer } from 'lucide-react';
import type { RaceParticipant } from '../types';
import { useRaceSound } from '../hooks/useRaceSound';

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

    useEffect(() => {
        if (autoStart) {
            setCountdown(5);
        }
    }, [autoStart]);

useEffect(() => {
    if (!autoStart && trigger && countdown === null && !startRace) {
        setCountdown(5);
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
        setShouldShake(true);
        const timer = setTimeout(() => {
            setCountdown(null);
            setStartRace(true);
            setShouldShake(false);
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

const F1Lights = ({ count }: { count: number }) => (
    <div className="flex gap-4 p-6 bg-zinc-900 rounded-xl border-4 border-zinc-800 shadow-2xl">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-full border-2 border-zinc-700 ${5 - count >= i ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'bg-zinc-800'}`} />
                <div className={`w-8 h-8 rounded-full border-2 border-zinc-700 ${5 - count >= i ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]' : 'bg-zinc-800'}`} />
            </div>
        ))}
    </div>
);

const F1CarTopDown = ({ color, isLeader, label }: { color: typeof f1Colors[0], isLeader: boolean, label: string }) => (
    <div className="relative flex flex-col items-center">
        {/* Leader Crown/Trophy */}
        {isLeader && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.5, type: "spring" }}
                className="absolute -top-6 z-20"
            >
                <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            </motion.div>
        )}

        {/* Top-down F1 Car SVG */}
        <svg width="32" height="60" viewBox="0 0 24 50" className="drop-shadow-lg">
            {/* Rear Wing */}
            <rect x="4" y="46" width="16" height="4" fill={color.secondary} rx="0.5" />

            {/* Rear Wheels */}
            <rect x="0" y="36" width="6" height="10" fill="#111827" rx="1" />
            <rect x="18" y="36" width="6" height="10" fill="#111827" rx="1" />

            {/* Main Body (Tapered) */}
            <path d="M6 40 L18 40 L15 10 L9 10 Z" fill={color.primary} />

            {/* Sidepods */}
            <path d="M6 18 L4 32 L7 32 L8 18 Z" fill={color.accent} />
            <path d="M18 18 L20 32 L17 32 L16 18 Z" fill={color.accent} />

            {/* Cockpit */}
            <ellipse cx="12" cy="28" rx="3" ry="5" fill="#fbbf24" stroke="#000" strokeWidth="0.5" />

            {/* Front Wing */}
            <rect x="2" y="6" width="20" height="3" fill={color.secondary} rx="1" />

            {/* Front Wheels */}
            <rect x="0" y="8" width="5" height="8" fill="#111827" rx="1" />
            <rect x="19" y="8" width="5" height="8" fill="#111827" rx="1" />
        </svg>

        {/* Car Label (Side) */}
        <div
            className="absolute -right-12 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded text-[8px] font-black text-white bg-black/40 backdrop-blur-[1px] border-l-2 z-10 whitespace-nowrap"
            style={{ borderLeftColor: color.primary }}
        >
            {label}
        </div>
    </div>
);

return (
    <div className={`relative h-[650px] sm:h-[750px] card-glass backdrop-blur-xl rounded-3xl border border-slate-300 dark:border-white/10 p-4 sm:p-8 flex flex-col shadow-2xl transition-all ${shouldShake ? 'animate-[shake_0.2s_infinite]' : ''}`}>
        <style>
            {`
                    @keyframes shake {
                        0% { transform: translate(1px, 1px) rotate(0deg); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg); }
                        20% { transform: translate(-3px, 0px) rotate(1deg); }
                        30% { transform: translate(3px, 2px) rotate(0deg); }
                        40% { transform: translate(1px, -1px) rotate(1deg); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg); }
                        60% { transform: translate(-3px, 1px) rotate(0deg); }
                        70% { transform: translate(3px, 1px) rotate(-1deg); }
                        80% { transform: translate(-1px, -1px) rotate(1deg); }
                        90% { transform: translate(1px, 2px) rotate(0deg); }
                        100% { transform: translate(1px, -2px) rotate(-1deg); }
                    }
                `}
        </style>

        {/* Track Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-900 [.theme-clear_&]:from-slate-200 [.theme-clear_&]:via-slate-100 [.theme-clear_&]:to-slate-200 opacity-80 rounded-3xl overflow-hidden" />

        {/* Vertical Road Markings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-20"
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
            }}
        />

        {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} style={{ zIndex: 60 }} />}

        {/* Header */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-2">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg shadow-red-500/30">
                    <Flag className="w-6 h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-widest uppercase italic">
                        {title}
                    </h2>
                    <div className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-bold flex items-center justify-center sm:justify-start gap-2 mt-1 uppercase tracking-widest">
                        <Timer className="w-3 h-3" />
                        <span>{subtitle}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-white/60 bg-white/40 dark:bg-black/40 px-5 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_rgba(250,204,21,1)]" />
                    <span>Leader</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                    <span className="text-base">🏎️</span>
                    <span>Track Mode</span>
                </div>
            </div>
        </div>

        {/* Countdown Overlay */}
        <AnimatePresence mode="wait">
            {countdown !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 2 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md rounded-3xl"
                >
                    <motion.div
                        key={countdown}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.2, opacity: 0 }}
                        className="flex flex-col items-center gap-10"
                    >
                        <F1Lights count={countdown} />
                        <div className="text-4xl sm:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500 text-center tracking-tighter uppercase drop-shadow-2xl">
                            {countdown === 0 ? "LIGHTS OUT!" : "WARMING TIRES..."}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Race Arena */}
        <div className="flex-1 relative mb-4 z-10 px-2 sm:px-6">
            <div className="absolute inset-0 flex justify-between gap-2 sm:gap-4 overflow-hidden">
                {sortedParticipants.map((p, index) => {
                    const color = f1Colors[index % f1Colors.length];
                    const isLeader = index === 0;
                    const progress = (p.score / maxScore) * 85; // Max 85% to stay below finish line


                    return (
                        <div key={p.id} className="flex-1 flex flex-col h-full group">
                            {/* Participant Info (Top) */}
                            <div className="text-center mb-2 px-1">
                                <div className="text-[9px] font-black text-slate-800 dark:text-white/90 truncate uppercase tracking-tighter">
                                    {getAbbreviation(p.name)}
                                </div>
                                <div className="text-[10px] sm:text-xs font-mono font-black shadow-sm" style={{ color: color.primary }}>
                                    {p.score.toFixed(1)}
                                </div>
                            </div>

                            {/* Vertical Track Lane */}
                            <div className="flex-1 relative bg-slate-800/60 [.theme-clear_&]:bg-slate-300 shadow-inner overflow-hidden border-x border-white/5 [.theme-clear_&]:border-slate-400/30">
                                {/* Lane Markings (Dashed Line) */}
                                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 sm:w-1 border-l border-dashed border-white/10 [.theme-clear_&]:border-slate-900/10 h-full" />

                                {/* Finish Line (Top) */}
                                <div className="absolute top-0 left-0 right-0 h-4 z-10 opacity-60"
                                    style={{
                                        backgroundImage: `repeating-conic-gradient(#000 0deg 90deg, #fff 90deg 180deg)`,
                                        backgroundSize: '8px 8px',
                                    }}
                                />

                                {/* Position Flag (Bottom-Left) */}
                                <div className={`absolute bottom-2 left-1 z-20 w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-black border ${isLeader
                                    ? 'bg-yellow-400 text-yellow-900 border-yellow-500'
                                    : 'bg-white/10 text-white/40 border-white/10'
                                    }`}>
                                    P{index + 1}
                                </div>

                                {/* top heat/smoke effect at bottom */}
                                {startRace && (
                                    <motion.div
                                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent pointer-events-none"
                                    />
                                )}

                                {/* F1 Car (Animated Bottom-to-Top) */}
                                <motion.div
                                    initial={{ bottom: '2%' }}
                                    animate={startRace ? { bottom: `${Math.min(2 + progress, 88)}%` } : { bottom: '2%' }}
                                    transition={{ duration: 2.5, ease: "easeOut", delay: index * 0.1 }}
                                    className="absolute left-1/2 -translate-x-1/2 scale-[0.6] sm:scale-100 origin-bottom"
                                >
                                    <motion.div
                                        animate={startRace ? {
                                            y: [0, -1, 0, 1, 0],
                                            x: [-0.5, 0.5, -0.5],
                                        } : {}}
                                        transition={{ duration: 0.1, repeat: Infinity }}
                                    >
                                        <F1CarTopDown
                                            color={color}
                                            isLeader={isLeader && startRace}
                                            label={getAbbreviation(p.name)}
                                        />

                                        {/* Speed Exhaust Bubbles/Lines */}
                                        {startRace && (
                                            <motion.div
                                                animate={{ opacity: [0, 0.4, 0], y: [0, 10, 20] }}
                                                transition={{ duration: 0.2, repeat: Infinity }}
                                                className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                                            >
                                                <div className="w-1.5 h-1.5 bg-blue-300/40 rounded-full blur-[1px]" />
                                                <div className="w-1 h-3 bg-white/20 rounded-full blur-[2px]" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Quick Stats Panel (Bottom) */}
        <div className="relative z-20 mt-4 pt-6 border-t border-white/10 bg-black/20 rounded-b-3xl -mx-4 -mb-4 sm:-mx-8 sm:-mb-8 p-6 px-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/50">Race Standings</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedParticipants.slice(0, 4).map((p, index) => {
                    const color = f1Colors[index % f1Colors.length];
                    const trophies = ['🏆', '🥈', '🥉', '💠'];
                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: startRace ? 2.5 + index * 0.1 : 0 }}
                            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all"
                        >
                            <div className="text-sm border-r border-white/10 pr-3">{trophies[index]}</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[10px] font-black truncate text-white uppercase tracking-tight">{getAbbreviation(p.name)}</div>
                                <div className="text-[11px] font-black font-mono shadow-sm" style={{ color: color.primary }}>{p.score.toFixed(1)} <span className="text-[8px] opacity-40">XP</span></div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </div >
);
}
