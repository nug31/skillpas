import { motion } from 'framer-motion';
import { Star, Mountain, Flag } from 'lucide-react';

interface LevelJourneyProps {
    currentScore: number;
    allLevels: any[];
}

export function LevelJourney({ currentScore, allLevels }: LevelJourneyProps) {
    const normalizedScore = Math.min(100, Math.max(0, currentScore));

    // Fixed positions for levels to ensure perfect alignment
    // (x, y) coordinates in 400x200 viewbox
    const stations = [
        { x: 50, y: 160 },   // Level 1
        { x: 120, y: 140 },  // Level 2
        { x: 190, y: 110 },  // Level 3
        { x: 260, y: 80 },   // Level 4
        { x: 350, y: 40 }    // Level 5 (Master)
    ];

    // Helper to get position based on 0-100 score
    const getPos = (score: number) => {
        const segmentSize = 100 / (stations.length - 1);
        const segmentIdx = Math.min(Math.floor(score / segmentSize), stations.length - 2);
        const t = (score % segmentSize) / segmentSize;

        const p1 = stations[segmentIdx];
        const p2 = stations[segmentIdx + 1];

        return {
            x: p1.x + (p2.x - p1.x) * t,
            y: p1.y + (p2.y - p1.y) * t
        };
    };

    const climberPos = getPos(normalizedScore);
    const pathD = `M ${stations.map(s => `${s.x} ${s.y}`).join(' L ')}`;

    return (
        <div className="relative w-full aspect-[2/1] card-glass rounded-2xl p-6 border border-white/5 overflow-hidden group">
            {/* Background Mountain Peaks (Distant) - More subtle */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <Mountain className="absolute bottom-4 left-10 w-24 h-24 text-white" />
                <Mountain className="absolute bottom-8 left-40 w-32 h-32 text-white" />
                <Mountain className="absolute bottom-4 right-20 w-28 h-28 text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                        <Mountain className="w-3 h-3" />
                        Level Progression
                    </h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[9px] font-black border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                        <Star className="w-3 h-3 fill-current" />
                        TARGET: MASTER
                    </div>
                </div>

                <div className="relative flex-1">
                    <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                        {/* Define Gradients */}
                        <defs>
                            <linearGradient id="journeyGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>

                        {/* Base Path */}
                        <path
                            d={pathD}
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Progress Path */}
                        <motion.path
                            d={pathD}
                            fill="none"
                            stroke="url(#journeyGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: normalizedScore / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        {/* Station Milestones */}
                        {allLevels.map((lvl, idx) => {
                            const pos = stations[idx] || stations[stations.length - 1];
                            const isReached = currentScore >= lvl.min_skor;
                            const isMaster = idx === allLevels.length - 1;

                            return (
                                <g key={lvl.id}>
                                    {!isMaster && (
                                        <circle
                                            cx={pos.x}
                                            cy={pos.y}
                                            r="4"
                                            className={`${isReached ? 'fill-white' : 'fill-white/10'}`}
                                        />
                                    )}
                                    {isMaster && (
                                        <motion.g
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: isReached ? [1, 1.2, 1] : 0.8 }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Star
                                                x={pos.x - 12}
                                                y={pos.y - 12}
                                                width={24}
                                                height={24}
                                                className={`${isReached ? 'fill-yellow-400 text-yellow-500' : 'fill-white/10 text-white/10'} drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]`}
                                            />
                                        </motion.g>
                                    )}
                                    <text
                                        x={pos.x}
                                        y={pos.y - 18}
                                        textAnchor="middle"
                                        className={`text-[9px] font-black uppercase tracking-tighter ${isReached ? 'fill-white' : 'fill-white/30'}`}
                                    >
                                        {lvl.badge_name || lvl.nama_level?.split(' ')[0]}
                                    </text>
                                </g>
                            );
                        })}

                        {/* The Climber */}
                        <motion.g
                            initial={{ x: stations[0].x, y: stations[0].y }}
                            animate={{ x: climberPos.x, y: climberPos.y }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <circle r="12" className="fill-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            <Flag
                                x={-5}
                                y={-5}
                                width={10}
                                height={10}
                                className="text-indigo-600 fill-current"
                            />
                            <circle r="16" className="stroke-white/30 fill-none stroke-[2] animate-ping" />
                        </motion.g>
                    </svg>
                </div>
            </div>

            {/* Decorative Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        </div>
    );
}
