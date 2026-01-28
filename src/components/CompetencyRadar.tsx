import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface CompetencyRadarProps {
    score: number;
}

export function CompetencyRadar({ score }: CompetencyRadarProps) {
    // Generate dummy data based on the single "score" to make the chart look realistic
    // In a real app, these would come from sub-scores in the database
    const variability = 10; // how much sub-scores vary from main score

    const clamp = (val: number) => Math.min(100, Math.max(0, val));

    const data = [
        { subject: 'Technical', A: score, fullMark: 100 },
        { subject: 'Safety (K3)', A: clamp(score + 5), fullMark: 100 },
        { subject: 'Troubleshooting', A: clamp(score - 5), fullMark: 100 },
        { subject: 'Soft Skills', A: clamp(score + 10), fullMark: 100 },
        { subject: 'Theory', A: clamp(score - 2), fullMark: 100 },
        { subject: 'Tools', A: clamp(score + 8), fullMark: 100 },
    ];

    return (
        <div className="w-full h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="var(--card-border)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="My Competency"
                        dataKey="A"
                        stroke="#8884d8"
                        strokeWidth={3}
                        fill="#8884d8"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Overlay Stat - "Industry Ready" */}
            <div className="absolute top-0 right-0 p-3 card-glass rounded-xl !bg-white/10 [.theme-clear_&]:!bg-white/30">
                <div className="text-[10px] text-[color:var(--text-muted)] uppercase tracking-widest text-center font-bold">Industry Ready</div>
                <div className="text-2xl font-black text-center text-green-400 [.theme-clear_&]:text-emerald-600">{Math.round(score * 0.95)}%</div>
            </div>
        </div>
    );
}
