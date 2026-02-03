import { SiswaWithSkill } from '../types';
import { formatStudentData, calculateClassStatistics } from '../lib/exportUtils';
import { X } from 'lucide-react';

interface ReportViewProps {
    students: SiswaWithSkill[];
    kelas: string;
    walasName: string;
    onClose: () => void;
}

export function ReportView({ students, kelas, walasName, onClose }: ReportViewProps) {
    const formattedData = formatStudentData(students);
    const stats = calculateClassStatistics(students);
    const today = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-white overflow-auto">
            {/* Print-only styles */}
            <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          @page {
            margin: 1.5cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .page-break {
            page-break-after: always;
          }
        }
        @media screen {
          .report-container {
            max-width: 21cm;
            min-height: 29.7cm;
            margin: 2rem auto;
            padding: 2cm;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
        }
      `}</style>

            {/* Action Bar - Hidden on print */}
            <div className="no-print sticky top-0 z-10 bg-indigo-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">
                <div>
                    <h2 className="text-xl font-bold">Laporan Kelas {kelas}</h2>
                    <p className="text-sm text-indigo-100">Siap untuk dicetak</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
                    >
                        🖨️ Cetak
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="report-container">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-1">
                        SMK MITRA INDUSTRI MM2100
                    </h1>
                    <p className="text-sm text-slate-600">
                        Jl. Kalimantan Blok DD 1-1, Kawasan Industri MM2100, Cikarang Barat, Bekasi 17530
                    </p>
                    <p className="text-xs text-slate-500">Telp: (021) 89983961 | Email: info@smkmitraindustrimm2100.sch.id</p>
                </div>

                {/* Report Title */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-black uppercase text-slate-900 mb-2">
                        Laporan Perkembangan Kompetensi Siswa
                    </h2>
                    <p className="text-sm text-slate-600">Kelas: <span className="font-bold">{kelas}</span></p>
                    <p className="text-sm text-slate-600">Periode: Tahun Ajaran 2025/2026</p>
                    <p className="text-sm text-slate-600">Tanggal Cetak: {today}</p>
                </div>

                {/* Summary Statistics */}
                <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-black text-slate-900 mb-3 uppercase">Ringkasan Statistik</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-slate-500 text-xs font-bold">Total Siswa</div>
                            <div className="text-2xl font-black text-indigo-600">{stats.total}</div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-bold">Rata-rata Skor</div>
                            <div className="text-2xl font-black text-emerald-600">{stats.avgScore} XP</div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-bold">Rata-rata Kehadiran</div>
                            <div className="text-2xl font-black text-blue-600">{stats.avgAttendance}%</div>
                        </div>
                        <div>
                            <div className="text-slate-500 text-xs font-bold">Rata-rata Sikap</div>
                            <div className="text-2xl font-black text-amber-600">{stats.avgAttitude}</div>
                        </div>
                    </div>
                </div>

                {/* Student Table */}
                <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 mb-3 uppercase">Data Siswa</h3>
                    <table className="w-full text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="border border-slate-300 px-2 py-2 text-left">No</th>
                                <th className="border border-slate-300 px-2 py-2 text-left">Nama</th>
                                <th className="border border-slate-300 px-2 py-2 text-left">NISN</th>
                                <th className="border border-slate-300 px-2 py-2 text-center">Level</th>
                                <th className="border border-slate-300 px-2 py-2 text-center">Skor</th>
                                <th className="border border-slate-300 px-2 py-2 text-center">Hadir %</th>
                                <th className="border border-slate-300 px-2 py-2 text-center">Sikap</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formattedData.map((siswa, index) => (
                                <tr key={index} className="hover:bg-slate-50">
                                    <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                                    <td className="border border-slate-300 px-2 py-2">{siswa.Nama}</td>
                                    <td className="border border-slate-300 px-2 py-2">{siswa.NISN}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-center">{siswa.Level}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-center font-bold">{siswa['Skor (XP)']}</td>
                                    <td className="border border-slate-300 px-2 py-2 text-center">{siswa['Kehadiran (%)']}%</td>
                                    <td className="border border-slate-300 px-2 py-2 text-center">{siswa['Nilai Sikap (Rata-rata)']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Level Distribution */}
                <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 mb-3 uppercase">Distribusi Level</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(stats.levelDistribution).map(([level, count]) => (
                            <div key={level} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                                <div className="text-xs text-slate-500 font-bold">{level}</div>
                                <div className="text-xl font-black text-indigo-600">{count as number}</div>
                                <div className="text-xs text-slate-400">siswa</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Signatures */}
                <div className="mt-12 grid grid-cols-2 gap-12 text-sm">
                    <div className="text-center">
                        <p className="mb-16 text-slate-600">Wali Kelas,</p>
                        <div className="border-b-2 border-slate-900 pb-1 mb-1 font-bold text-slate-900">{walasName}</div>
                        <p className="text-xs text-slate-500">NIP: _______________</p>
                    </div>
                    <div className="text-center">
                        <p className="mb-16 text-slate-600">Kepala Sekolah,</p>
                        <div className="border-b-2 border-slate-900 pb-1 mb-1 font-bold text-slate-900">Lispiyatmini, M.Pd</div>
                        <p className="text-xs text-slate-500">NIP: -</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                    <p>Dokumen ini dicetak dari Sistem Skill Pass - SMK MITRA INDUSTRI MM2100</p>
                    <p>Tanggal: {today}</p>
                </div>
            </div>
        </div>
    );
}
