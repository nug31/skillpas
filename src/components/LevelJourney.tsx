import { motion } from 'framer-motion';
import { Star, Mountain, Flag } from 'lucide-react';

interface LevelJourneyProps {
    currentScore: number;
    allLevels: any[];
}

export function LevelJourney({ currentScore, allLevels }: LevelJourneyProps) {
    // Normalize score to 0-100
    const normalizedScore = Math.min(100, Math.max(0, currentScore));

    // Define path points for the mountain ridge (SVG viewbox 0,0 to 400,200)
    // Shifted slightly to ensure no cut-offs
    const pathData = "M 40 160 Q 120 150 200 100 T 360 40";

    // Helper to calculate position on path (roughly)
    const getPositionOnPath = (percent: number) => {
        const t = percent / 100;
        // Cubic bezier interpolation simplified for the curve
        const x = 40 + 320 * t;
        const y = 160 - 120 * (t * t); // smoother parabolic curve
        return { x, y };
    };

    const climberPos = getPositionOnPath(normalizedScore);

    return (
        <div className="relative w-full aspect-[2/1] bg-slate-900/40 rounded-3xl p-6 border border-white/5 overflow-hidden group">
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
                        {/* Draw Path */}
                        <motion.path
                            d={pathData}
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="10"
                            strokeLinecap="round"
                        />

                        {/* Active Path (Current Progress) */}
                        <motion.path
                            d={pathData}
                            fill="none"
                            stroke="url(#journeyGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: normalizedScore / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        <defs>
                            <linearGradient id="journeyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Level Stations */}
                        {allLevels.map((lvl, idx) => {
                            const percent = allLevels.length > 1 ? (idx / (allLevels.length - 1)) * 100 : 0;
                            const pos = getPositionOnPath(percent);
                            const isReached = currentScore >= lvl.min_skor;

                            // For the very first level, ensure label is distinct if it's the current one
                            const label = lvl.badge_name || lvl.nama_level?.split(' ')[0] || 'Level';

                            return (
                                <g key={lvl.id}>
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r="5"
                                        className={`${isReached ? 'fill-white' : 'fill-white/10'}`}
                                    />
                                    <text
                                        x={pos.x}
                                        y={pos.y - 12} // Labels ABOVE the dots
                                        textAnchor="middle"
                                        className={`text-[9px] font-black uppercase tracking-tighter ${isReached ? 'fill-white' : 'fill-white/30'}`}
                                        style={{ filter: isReached ? 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' : 'none' }}
                                    >
                                        {label}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Peak Star */}
                        <motion.g
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [0.8, 1.1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                        >
                            <Star
                                x={350}
                                y={30}
                                width={24}
                                height={24}
                                className="fill-yellow-400 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]"
                            />
                        </motion.g>

                        {/* The Climber */}
                        <motion.g
                            initial={{ x: 40, y: 160 }}
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
