import { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import { SiswaWithSkill } from '../types';
import { ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    RadialLinearScale,
    PointElement,
    LineElement
);

interface AnalyticsPanelProps {
    students: SiswaWithSkill[];
}

export function AnalyticsPanel({ students }: AnalyticsPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Level Distribution Data
    const levelDistributionData = useMemo(() => {
        const distribution = students.reduce((acc: any, s: any) => {
            const levelName = s.current_level?.nama_level || 'Level 1';
            acc[levelName] = (acc[levelName] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(distribution),
            datasets: [{
                label: 'Jumlah Siswa',
                data: Object.values(distribution),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(168, 85, 247, 0.7)'
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                    'rgb(168, 85, 247)'
                ],
                borderWidth: 2
            }]
        };
    }, [students]);

    // Attendance Distribution Data
    const attendanceData = useMemo(() => {
        const totalMasuk = students.reduce((sum: number, s: any) => sum + (s.discipline_data?.masuk || 0), 0);
        const totalIzin = students.reduce((sum: number, s: any) => sum + (s.discipline_data?.izin || 0), 0);
        const totalSakit = students.reduce((sum: number, s: any) => sum + (s.discipline_data?.sakit || 0), 0);
        const totalAlfa = students.reduce((sum: number, s: any) => sum + (s.discipline_data?.alfa || 0), 0);

        return {
            labels: ['Masuk', 'Izin', 'Sakit', 'Alfa'],
            datasets: [{
                data: [totalMasuk, totalIzin, totalSakit, totalAlfa],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }]
        };
    }, [students]);

    // Attitude Scores Radar Data
    const attitudeData = useMemo(() => {
        const attitudeAspects: any = {};

        students.forEach((s: any) => {
            if (s.discipline_data?.attitude_scores) {
                s.discipline_data.attitude_scores.forEach((item: any) => {
                    if (!attitudeAspects[item.aspect]) {
                        attitudeAspects[item.aspect] = [];
                    }
                    attitudeAspects[item.aspect].push(item.score);
                });
            }
        });

        const labels = Object.keys(attitudeAspects);
        const averages = labels.map(aspect => {
            const scores = attitudeAspects[aspect];
            return scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
        });

        return {
            labels,
            datasets: [{
                label: 'Rata-rata Nilai',
                data: averages,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(99, 102, 241)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(99, 102, 241)'
            }]
        };
    }, [students]);

    // KRS Status Distribution
    const krsStatusData = useMemo(() => {
        const statusCount = students.reduce((acc: any, s: any) => {
            const status = s.latest_krs?.status || 'none';
            const statusLabel =
                status === 'completed' ? 'Selesai' :
                    status === 'rejected' ? 'Ditolak' :
                        status === 'scheduled' ? 'Terjadwal' :
                            status === 'pending_produktif' ? 'Review Guru' :
                                status === 'pending_hod' ? 'Review HOD' :
                                    'Tidak Ada';

            acc[statusLabel] = (acc[statusLabel] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount),
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(148, 163, 184, 0.7)'
                ],
                borderWidth: 2
            }]
        };
    }, [students]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: 'rgb(203, 213, 225)'
                }
            }
        },
        scales: {
            y: {
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'rgb(203, 213, 225)',
                    padding: 15
                }
            }
        }
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                pointLabels: { color: 'rgb(203, 213, 225)' }
            }
        },
        plugins: {
            legend: {
                labels: { color: 'rgb(203, 213, 225)' }
            }
        }
    };

    if (students.length === 0) {
        return null;
    }

    return (
        <div className="card-glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
                        <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight [.theme-clear_&]:text-slate-900">Analytics & Insights</h3>
                        <p className="text-xs text-slate-400 [.theme-clear_&]:text-slate-500">Grafik visualisasi data kelas</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>

            {isExpanded && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Level Distribution */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider [.theme-clear_&]:text-slate-900">Distribusi Level</h4>
                        <Bar data={levelDistributionData} options={chartOptions} />
                    </div>

                    {/* Attendance Breakdown */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider [.theme-clear_&]:text-slate-900">Breakdown Kehadiran</h4>
                        <div className="max-w-xs mx-auto">
                            <Pie data={attendanceData} options={pieOptions} />
                        </div>
                    </div>

                    {/* Attitude Scores */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider [.theme-clear_&]:text-slate-900">Nilai Sikap (Rata-rata)</h4>
                        <div className="max-w-sm mx-auto">
                            <Radar data={attitudeData} options={radarOptions} />
                        </div>
                    </div>

                    {/* KRS Status */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200">
                        <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider [.theme-clear_&]:text-slate-900">Status KRS</h4>
                        <div className="max-w-xs mx-auto">
                            <Pie data={krsStatusData} options={pieOptions} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
