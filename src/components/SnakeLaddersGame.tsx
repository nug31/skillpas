import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import type { RaceParticipant } from '../types';

interface SnakeLaddersGameProps {
    participants: RaceParticipant[];
}

interface Portal {
    start: number;
    end: number;
    type: 'snake' | 'ladder';
}

const BOARD_PORTALS: Portal[] = [
    // Ladders
    { start: 2, end: 38, type: 'ladder' },
    { start: 7, end: 14, type: 'ladder' },
    { start: 8, end: 31, type: 'ladder' },
    { start: 15, end: 26, type: 'ladder' },
    { start: 21, end: 42, type: 'ladder' },
    { start: 28, end: 84, type: 'ladder' },
    { start: 36, end: 44, type: 'ladder' },
    { start: 51, end: 67, type: 'ladder' },
    { start: 71, end: 91, type: 'ladder' },
    { start: 78, end: 98, type: 'ladder' },

    // Snakes
    { start: 16, end: 6, type: 'snake' },
    { start: 46, end: 25, type: 'snake' },
    { start: 49, end: 11, type: 'snake' },
    { start: 62, end: 19, type: 'snake' },
    { start: 64, end: 60, type: 'snake' },
    { start: 74, end: 53, type: 'snake' },
    { start: 89, end: 68, type: 'snake' },
    { start: 92, end: 88, type: 'snake' },
    { start: 95, end: 75, type: 'snake' },
    { start: 99, end: 80, type: 'snake' },
];

export function SnakeLaddersGame({ participants }: SnakeLaddersGameProps) {
    // Generate 100 tiles (10x10) in zig-zag order from bottom
    const tiles = useMemo(() => {
        const grid: number[] = [];
        for (let row = 9; row >= 0; row--) {
            for (let col = 0; col < 10; col++) {
                let num;
                if (row % 2 === 0) {
                    num = row * 10 + col + 1;
                } else {
                    num = row * 10 + (10 - col);
                }
                grid.push(num);
            }
        }
        return grid;
    }, []);

    // Helper to get center coordinates (0-100) for a tile number
    const getTilePos = (num: number) => {
        const row = Math.floor((num - 1) / 10);
        const colRaw = (num - 1) % 10;
        const col = row % 2 === 0 ? colRaw : 9 - colRaw;
        // x: col 0 is 5%, col 9 is 95%
        // y: row 0 is 95%, row 9 is 5%
        return {
            x: col * 10 + 5,
            y: (9 - row) * 10 + 5
        };
    };

    // Group participants by score (clamped 1-100)
    const participantsByTile = useMemo(() => {
        const map = new Map<number, RaceParticipant[]>();
        participants.forEach(p => {
            let tileNum = Math.floor(p.score);
            if (tileNum < 1) tileNum = 1;
            if (tileNum > 100) tileNum = 100;

            if (!map.has(tileNum)) {
                map.set(tileNum, []);
            }
            map.get(tileNum)?.push(p);
        });
        return map;
    }, [participants]);

    return (
        <div className="card-glass p-4 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl border border-white/10 [.theme-clear_&]:bg-white/40 [.theme-clear_&]:border-slate-200 [.theme-clear_&]:shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
                <div className="text-left">
                    <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent uppercase tracking-tight">
                        Skill Quest
                    </h2>
                    <p className="text-slate-400 text-sm font-medium [.theme-clear_&]:text-slate-600">Ular Tangga Kompetensi</p>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {participants.length} Siswa
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Target: 100 XP
                    </span>
                </div>
            </div>

            <div className="relative aspect-square w-full max-w-[600px] mx-auto bg-slate-900/50 rounded-2xl border-4 border-slate-800 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] overflow-hidden [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200 [.theme-clear_&]:shadow-lg">
                {/* Board Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none [.theme-clear_&]:opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Grid Tiles */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 p-1">
                    {tiles.map((num) => {
                        const playersHere = participantsByTile.get(num) || [];
                        const isSpecial = num === 1 || num === 100;
                        const row = Math.floor((num - 1) / 10);
                        const colRaw = (num - 1) % 10;
                        const col = row % 2 === 0 ? colRaw : 9 - colRaw;

                        return (
                            <div
                                key={num}
                                className={`relative border border-white/[0.03] flex items-center justify-center transition-colors [.theme-clear_&]:border-slate-900/[0.05]
                                    ${num === 100 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : ''}
                                    ${num === 1 ? 'bg-indigo-500/10' : ''}
                                    hover:bg-white/[0.02] [.theme-clear_&]:hover:bg-black/[0.02]
                                `}
                            >
                                <span className={`absolute top-1 left-1.5 text-[8px] sm:text-[10px] font-black tracking-tighter select-none pointer-events-none
                                    ${isSpecial ? 'text-white opacity-100 [.theme-clear_&]:text-indigo-950' : 'text-slate-600 opacity-40'}
                                `}>
                                    {num === 100 ? 'FINISH' : num === 1 ? 'START' : num}
                                </span>

                                {/* Avatars Container */}
                                <div className="flex -space-x-2 items-center justify-center w-full h-full p-0.5">
                                    <AnimatePresence>
                                        {playersHere.slice(0, 3).map((p, idx) => (
                                            <motion.div
                                                key={p.id}
                                                layoutId={`player-${p.id}`}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="group relative"
                                            >
                                                <div
                                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white/90 shadow-xl flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white transition-transform group-hover:scale-125 group-hover:z-50 cursor-help"
                                                    style={{
                                                        backgroundColor: generateColor(p.name),
                                                        zIndex: 30 - idx
                                                    }}
                                                >
                                                    {p.alias || p.name.substring(0, 1)}
                                                </div>

                                                {/* Tooltip */}
                                                <div className={`absolute ${num > 90 ? 'top-full mt-2' : 'bottom-full mb-2'} 
                                                    ${col === 0 ? 'left-0 translate-x-0' : col === 9 ? 'right-0 translate-x-0' : 'left-1/2 -translate-x-1/2'} 
                                                    hidden group-hover:block z-[100] pointer-events-none`}>
                                                    <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-2xl border border-white/10 whitespace-nowrap [.theme-clear_&]:bg-white [.theme-clear_&]:text-slate-900 [.theme-clear_&]:border-slate-200">
                                                        {p.name} ({p.score} XP)
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {playersHere.length > 3 && (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-700/80 backdrop-blur-md text-white flex items-center justify-center text-[8px] font-bold border border-white/50 z-20 [.theme-clear_&]:bg-slate-100/90 [.theme-clear_&]:text-slate-700 [.theme-clear_&]:border-slate-300">
                                            +{playersHere.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SVG Overlay for Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="ladderLine" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {BOARD_PORTALS.map((portal, idx) => {
                        const start = getTilePos(portal.start);
                        const end = getTilePos(portal.end);

                        if (portal.type === 'ladder') {
                            // Draw a ladder
                            const dx = end.x - start.x;
                            const dy = end.y - start.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            return (
                                <g key={`ladder-${idx}`} className="opacity-40">
                                    {/* Two side rails */}
                                    <line x1={start.x - 1} y1={start.y} x2={end.x - 1} y2={end.y} stroke="url(#ladderLine)" strokeWidth="0.8" />
                                    <line x1={start.x + 1} y1={start.y} x2={end.x + 1} y2={end.y} stroke="url(#ladderLine)" strokeWidth="0.8" />
                                    {/* Rungs */}
                                    {[...Array(Math.floor(dist / 4))].map((_, i) => {
                                        const t = (i + 1) / (Math.floor(dist / 4) + 1);
                                        const rx = start.x + dx * t;
                                        const ry = start.y + dy * t;
                                        // Perpendicular vector for rungs
                                        const px = -dy / dist * 1.5;
                                        const py = dx / dist * 1.5;
                                        return (
                                            <line
                                                key={i}
                                                x1={rx - px} y1={ry - py}
                                                x2={rx + px} y2={ry + py}
                                                stroke="url(#ladderLine)"
                                                strokeWidth="0.5"
                                            />
                                        );
                                    })}
                                </g>
                            );
                        } else {
                            // Draw a wavy snake
                            const midX = (start.x + end.x) / 2 + (Math.random() - 0.5) * 10;
                            const midY = (start.y + end.y) / 2 + (Math.random() - 0.5) * 10;
                            return (
                                <path
                                    key={`snake-${idx}`}
                                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                                    fill="none"
                                    stroke={idx % 2 === 0 ? "#ef4444" : "#f43f5e"}
                                    strokeWidth="1.2"
                                    strokeLinecap="round"
                                    strokeDasharray="2 1"
                                    className="opacity-30"
                                    filter="url(#glow)"
                                />
                            );
                        }
                    })}
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="w-8 h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                    <span className="text-xs font-bold text-amber-500 uppercase">Tangga Bonus</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="w-8 h-1 bg-red-500 rounded-full border-t border-red-400 border-dashed" />
                    <span className="text-xs font-bold text-red-500 uppercase">Ular Jebakan</span>
                </div>
            </div>
        </div>
    );
}

function generateColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 50%)`;
}

