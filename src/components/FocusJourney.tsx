import { CheckCircle2, Circle, Lock } from 'lucide-react';

interface FocusJourneyProps {
    currentLevel: string;
    score: number;
}

export function FocusJourney({ currentLevel, score }: FocusJourneyProps) {
    // Define the level milestones
    const milestones = [
        { label: 'Basic', minScore: 0, maxScore: 25 },
        { label: 'Applied', minScore: 26, maxScore: 50 },
        { label: 'Advance', minScore: 51, maxScore: 75 },
        { label: 'Master', minScore: 76, maxScore: 100 },
    ];

    // Determine current milestone index based on score/level logic
    // Using score for more precision than just string matching
    const getCurrentIndex = () => {
        if (score >= 76) return 3;
        if (score >= 51) return 2;
        if (score >= 26) return 1;
        return 0;
    };

    const currentIndex = getCurrentIndex();

    return (
        <div className="w-full py-4">
            <div className="relative">
                {/* Progress Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />

                {/* Active Progress Line */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{ width: `${(currentIndex / (milestones.length - 1)) * 100}%` }}
                />

                {/* Milestones */}
                <div className="relative flex justify-between">
                    {milestones.map((milestone, idx) => {
                        const isCompleted = idx <= currentIndex;
                        const isCurrent = idx === currentIndex;
                        const isFuture = idx > currentIndex;

                        return (
                            <div key={milestone.label} className="flex flex-col items-center group cursor-default">
                                {/* Dot / Icon */}
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${isCompleted ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-[color:var(--card-bg)] border-white/20 text-white/20'}
                    ${isCurrent ? 'ring-4 ring-indigo-500/20 scale-110' : ''}
                  `}
                                >
                                    {isCompleted && !isCurrent ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : isCurrent ? (
                                        <Circle className="w-5 h-5 fill-current" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className={`mt-3 text-sm font-medium transition-colors ${isCompleted ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]'}`}>
                                    {milestone.label}
                                </div>

                                {/* Score Range */}
                                <div className="text-[10px] text-[color:var(--text-muted)] mt-0.5">
                                    {milestone.minScore}-{milestone.maxScore} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
