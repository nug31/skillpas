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
    const pathData = "M 20 180 Q 100 160 200 100 T 380 20";

    // Helper to calculate position on path (roughly)
    // In a real SVG we'd use getPointAtLength, but for this simple curve we can interpolate
    const getPositionOnPath = (percent: number) => {
        const t = percent / 100;
        // Cubic bezier interpolation simplified
        const x = 20 + 360 * t;
        const y = 180 - 160 * (t * t); // parabolic curve upward
        return { x, y };
    };

    const climberPos = getPositionOnPath(normalizedScore);

    return (
        <div className="relative w-full aspect-[2/1] bg-slate-900/40 rounded-3xl p-6 border border-white/5 overflow-hidden group">
            {/* Background Mountain Peaks (Distant) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Mountain className="absolute bottom-0 left-10 w-32 h-32 text-white" />
                <Mountain className="absolute bottom-4 left-40 w-48 h-48 text-white" />
                <Mountain className="absolute bottom-0 right-20 w-40 h-40 text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Mountain className="w-4 h-4" />
                        Skill Journey
                    </h3>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-[10px] font-black border border-yellow-500/20">
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
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            strokeLinecap="round"
                        />

                        {/* Active Path (Current Progress) */}
                        <motion.path
                            d={pathData}
                            fill="none"
                            stroke="url(#journeyGradient)"
                            strokeWidth="12"
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
                        </defs>

                        {/* Level Stations */}
                        {allLevels.map((lvl, idx) => {
                            const pos = getPositionOnPath((idx / (allLevels.length - 1)) * 100);
                            const isReached = currentScore >= lvl.min_skor;

                            return (
                                <g key={lvl.id}>
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r="6"
                                        className={`${isReached ? 'fill-white' : 'fill-white/20'}`}
                                    />
                                    <text
                                        x={pos.x}
                                        y={pos.y + 20}
                                        textAnchor="middle"
                                        className={`text-[8px] font-bold uppercase tracking-tighter ${isReached ? 'fill-white' : 'fill-white/40'}`}
                                    >
                                        {lvl.badge_name}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Peak Star */}
                        <motion.g
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [0.8, 1.2, 0.8] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <Star
                                x={375}
                                y={10}
                                width={20}
                                height={20}
                                className="fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                            />
                        </motion.g>

                        {/* The Climber */}
                        <motion.g
                            initial={{ x: 20, y: 180 }}
                            animate={{ x: climberPos.x, y: climberPos.y }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <circle r="14" className="fill-white shadow-xl" />
                            <Flag
                                x={-6}
                                y={-6}
                                width={12}
                                height={12}
                                className="text-indigo-600 fill-current"
                            />
                            <circle r="18" className="stroke-white/20 fill-none stroke-[2] animate-ping" />
                        </motion.g>
                    </svg>
                </div>
            </div>

            {/* Decorative Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>
    );
}
