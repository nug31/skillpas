import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface StudentXPBarProps {
    score: number;
    level: string;
    levelColor: string;
}

export function StudentXPBar({ score, level, levelColor }: StudentXPBarProps) {
    // Gamification logic: simpler XP calculation
    // 0-25: Level 1 (0-1000 XP)
    // 26-50: Level 2
    // 51-75: Level 3
    // 76-100: Level 4 (Master)

    // Normalize score (0-100) to XP (0-1000 per level roughly)
    // Let's just say Max XP is 100 for simplicity of display relative to score
    const maxXP = 100;
    const progressPercent = (score / maxXP) * 100;

    // Calculate "Next Level" target
    let nextTarget = 100;
    let nextLabel = "Max Level";

    if (score < 26) { nextTarget = 26; nextLabel = "Applied"; }
    else if (score < 51) { nextTarget = 51; nextLabel = "Advance"; }
    else if (score < 76) { nextTarget = 76; nextLabel = "Master"; }

    const xpToNext = nextTarget - score;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 animate-pulse">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <div className="text-xs text-[color:var(--text-muted)] font-bold tracking-wider">CURRENT LEVEL</div>
                        <div className="text-lg font-black text-[color:var(--text-primary)] flex items-center gap-2">
                            <span style={{ color: levelColor }}>{level}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">Lvl {Math.ceil(score / 25)}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black italic text-[color:var(--text-primary)]">
                        {score}<span className="text-sm text-[color:var(--text-muted)] not-italic ml-1">XP</span>
                    </div>
                    <div className="text-xs text-[color:var(--text-muted)]">
                        {xpToNext > 0 ? `${xpToNext} XP to ${nextLabel}` : 'Max Level Reached!'}
                    </div>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="h-6 bg-black/20 rounded-full relative overflow-hidden border border-white/5 backdrop-blur-sm">
                {/* Background Stripes */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>

                {/* Fill Bar */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full relative overflow-hidden"
                    style={{
                        backgroundColor: levelColor,
                        boxShadow: `0 0 20px ${levelColor}80`
                    }}
                >
                    {/* Shine Effect */}
                    <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-20deg] animate-shimmer"></div>
                </motion.div>
            </div>

            {/* Milestones / Ticks */}
            <div className="flex justify-between mt-1 text-[10px] text-[color:var(--text-muted)] font-mono">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
            </div>
        </div>
    );
}
