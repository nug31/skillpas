import React from 'react';
import { X, Check, Download, Award, Clock } from 'lucide-react';
import type { CompetencyHistory, LevelSkill } from '../types';
import { generateCertificate } from '../lib/certificateGenerator';

interface StudentHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    studentNisn?: string;
    studentKelas: string;
    jurusanName: string;
    history: CompetencyHistory[];
    levels: LevelSkill[];
    hodName?: string;
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
    isOpen,
    onClose,
    studentName,
    studentNisn,
    studentKelas,
    jurusanName,
    history,
    levels,
    hodName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Riwayat Kompetensi</h3>
                            <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider">{studentName} • {studentKelas}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                                <Award className="w-4 h-4 text-yellow-500" />
                                Sertifikat Kompetensi Terbit
                            </h4>
                            <p className="text-[10px] text-slate-400 italic font-medium">
                                * Klik tombol <span className="text-indigo-400 font-bold">PDF</span> jika ingin mengunduh ulang sertifikat.
                            </p>
                        </div>

                        <div className="overflow-x-auto border border-white/5 rounded-xl bg-black/20">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] uppercase font-bold text-slate-400 border-b border-white/10">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Level</th>
                                        <th className="px-4 py-3">Unit Kompetensi</th>
                                        <th className="px-4 py-3">Hasil</th>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Penilai</th>
                                        <th className="px-4 py-3">Catatan</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs text-slate-300">
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-12 text-center text-slate-500 italic">
                                                Belum ada riwayat kompetensi yang tercatat.
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((entry, idx) => {
                                            const lvl = levels.find(l => l.id === entry.level_id);
                                            const isLulus = entry.hasil.toLowerCase() === 'lulus';

                                            return (
                                                <tr key={entry.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                                                    <td className="px-4 py-4 text-slate-500">{idx + 1}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-white/10 text-[10px] font-bold text-white">
                                                            {lvl?.nama_level || 'Lainnya'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 font-medium text-white max-w-[200px] truncate" title={entry.unit_kompetensi}>
                                                        {entry.unit_kompetensi}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit`}>
                                                            <Check className="w-3 h-3" />
                                                            {entry.hasil}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-400">{entry.tanggal}</td>
                                                    <td className="px-4 py-4 text-slate-400">{entry.penilai}</td>
                                                    <td className="px-4 py-4 text-slate-400 max-w-[150px] truncate" title={entry.catatan || '-'}>
                                                        {entry.catatan || '-'}
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        {isLulus && (
                                                            <button
                                                                onClick={() => generateCertificate({
                                                                    studentName: studentName,
                                                                    nisn: studentNisn || '-',
                                                                    kelas: studentKelas,
                                                                    jurusan: jurusanName,
                                                                    unitKompetensi: entry.unit_kompetensi,
                                                                    level: lvl?.nama_level || 'Advanced',
                                                                    tanggal: entry.tanggal,
                                                                    penilai: entry.penilai,
                                                                    hodName: hodName
                                                                })}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase ring-1 ring-indigo-500/20 hover:ring-0"
                                                            >
                                                                <Download className="w-3.5 h-3.5" />
                                                                PDF
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold text-sm transition-all"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
