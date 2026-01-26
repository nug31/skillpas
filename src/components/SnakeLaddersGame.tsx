import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { RaceParticipant } from '../types';

interface SnakeLaddersGameProps {
    participants: RaceParticipant[];
}

export function SnakeLaddersGame({ participants }: SnakeLaddersGameProps) {
    // Generate 100 tiles (10x10) in zig-zag order
    // Row 0 (bottom) = 1-10
    // Row 1 = 20-11
    // Row 2 = 21-30, etc.
    const tiles = useMemo(() => {
        const grid: number[][] = [];
        for (let row = 9; row >= 0; row--) {
            const rowTiles: number[] = [];
            for (let col = 0; col < 10; col++) {
                let num;
                if (row % 2 === 0) {
                    // Even rows (0-based from bottom): Left to Right
                    // Row 0: 1..10
                    // Row 2: 21..30
                    num = row * 10 + col + 1;
                } else {
                    // Odd rows: Right to Left
                    // Row 1: 20..11
                    num = row * 10 + (10 - col);
                }
                rowTiles.push(num);
            }
            grid.push(rowTiles);
        }
        return grid.flat();
    }, []);

    // Group participants by score (clamped 1-100)
    const participantsByTile = useMemo(() => {
        const map = new Map<number, RaceParticipant[]>();
        participants.forEach(p => {
            // Clamp score between 1 and 100
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
        <div className="card-glass p-6 rounded-2xl shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl font-bold text-center mb-6 text-indigo-400 uppercase tracking-widest">
                🐍 Ular Tangga Kompetensi 🪜
            </h2>

            <div className="relative aspect-square max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-4 border-slate-700 shadow-inner">
                {/* Grid */}
                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
                    {tiles.map((num, i) => {
                        const isEven = (Math.floor((num - 1) / 10) + (num - 1) % 10) % 2 === 0; // Checkerboard pattern logic
                        // Simpler checkerboard: index based
                        const isLight = i % 2 === 0; // Wait, wrapping rows offsets this.
                        // Let's stick to simple CSS styling for now or alternating colors.

                        const playersHere = participantsByTile.get(num) || [];

                        return (
                            <div
                                key={num}
                                className={`relative border-[0.5px] border-white/5 flex items-center justify-center
                                    ${num === 100 ? 'bg-yellow-500/20' : ''}
                                `}
                            >
                                <span className={`absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold opacity-10 select-none pointer-events-none
                                    ${num === 100 ? 'text-yellow-400 opacity-100 text-lg' : 'text-slate-500'}
                                `}>
                                    {num}
                                </span>

                                {/* Avatars */}
                                <div className="flex -space-x-2 overflow-hidden items-center justify-center w-full h-full p-1 flex-wrap content-center">
                                    {playersHere.slice(0, 3).map((p, idx) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-indigo-500 text-white flex items-center justify-center text-[8px] sm:text-[10px] font-bold shadow-lg"
                                            title={`${p.name} (${p.score})`}
                                            style={{ backgroundColor: generateColor(p.name) }}
                                        >
                                            {p.alias || p.name.substring(0, 2).toUpperCase()}
                                        </motion.div>
                                    ))}
                                    {playersHere.length > 3 && (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[8px] font-bold border border-white z-20">
                                            +{playersHere.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* SVG Overlay for Snakes and Ladders (Static for now, can be randomized or fixed) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Definition of gradients */}
                    <defs>
                        <linearGradient id="ladderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="snakeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>

                    {/* Example Ladders (Approximate Coordinates based on 10x10 grid percentage) */}
                    {/* Ladder: 4 -> 14 */}
                    <line x1="35" y1="95" x2="65" y2="85" stroke="url(#ladderGrad)" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Ladder: 9 -> 31 */}
                    <line x1="85" y1="95" x2="5" y2="65" stroke="url(#ladderGrad)" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Ladder: 28 -> 84 */}
                    <line x1="75" y1="75" x2="35" y2="15" stroke="url(#ladderGrad)" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Ladder: 40 -> 59 */}
                    <line x1="5" y1="65" x2="15" y2="45" stroke="url(#ladderGrad)" strokeWidth="2" strokeDasharray="4 2" />
                    {/* Ladder: 51 -> 67 */}
                    <line x1="5" y1="45" x2="65" y2="35" stroke="url(#ladderGrad)" strokeWidth="2" strokeDasharray="4 2" />

                    {/* Example Snakes */}
                    {/* Snake: 17 -> 7 */}
                    <path d="M 65 85 Q 75 90 65 95" stroke="url(#snakeGrad)" strokeWidth="1.5" fill="none" />
                    {/* Snake: 62 -> 19 */}
                    <path d="M 15 35 C 35 55, 65 65, 15 85" stroke="url(#snakeGrad)" strokeWidth="1.5" fill="none" />
                    {/* Snake: 87 -> 24 */}
                    <path d="M 65 15 C 85 45, 15 55, 35 75" stroke="url(#snakeGrad)" strokeWidth="1.5" fill="none" />
                    {/* Snake: 54 -> 34 */}
                    <path d="M 65 45 Q 85 55 65 65" stroke="url(#snakeGrad)" strokeWidth="1.5" fill="none" />
                    {/* Snake: 93 -> 73 */}
                    <path d="M 75 5 Q 85 25 75 25" stroke="url(#snakeGrad)" strokeWidth="1.5" fill="none" />

                </svg>
            </div>

            <div className="text-center mt-6 text-slate-400 text-sm">
                <span className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Tangga (Bonus Poin)</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Ular (Penurunan)</span>
                </span>
            </div>
        </div>
    );
}

// Helper to generate consistent colors from names
function generateColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}
