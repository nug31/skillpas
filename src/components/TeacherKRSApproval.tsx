import { useState, useEffect } from 'react';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { KRSSubmission, UserRole } from '../types';
import { Check, X, Calendar, MessageSquare, ChevronLeft } from 'lucide-react';

interface TeacherKRSApprovalProps {
    onBack: () => void;
    userRole: UserRole;
}

export function TeacherKRSApproval({ onBack, userRole }: TeacherKRSApprovalProps) {
    const [submissions, setSubmissions] = useState<KRSSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<KRSSubmission | null>(null);
    const [examDate, setExamDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadSubmissions();
        window.addEventListener(KRS_UPDATED_EVENT, loadSubmissions);
        return () => window.removeEventListener(KRS_UPDATED_EVENT, loadSubmissions);
    }, [userRole]);

    const loadSubmissions = () => {
        setLoading(true);
        const all = krsStore.getSubmissions();
        // Filter based on role and status
        const filtered = all.filter(s => {
            if (userRole === 'teacher_produktif') return s.status === 'pending_produktif';
            if (userRole === 'wali_kelas') return s.status === 'pending_wali';
            if (userRole === 'hod') return s.status === 'pending_hod';
            if (userRole === 'admin') return true; // Admin sees everything
            return false;
        });
        setSubmissions(filtered);
        setLoading(false);
    };

    const handleApprove = (id: string) => {
        if (userRole === 'hod' && !examDate) {
            alert("HOD wajib menentukan tanggal ujian.");
            return;
        }
        krsStore.approveKRS(id, userRole, notes, examDate);
        setSelectedSub(null);
        setExamDate('');
        setNotes('');
    };

    const handleReject = (id: string) => {
        if (!notes) {
            alert("Harap berikan catatan alasan penolakan.");
            return;
        }
        krsStore.rejectKRS(id, notes);
        setSelectedSub(null);
        setNotes('');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">Persetujuan KRS</h1>
                            <p className="text-slate-400 text-sm">Review dan verifikasi rencana belajar siswa</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                            Role: {userRole.replace('_', ' ')}
                        </span>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
                        <Check className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-500">Tidak ada pengajuan KRS baru</h2>
                        <p className="text-slate-600">Semua tugas Anda telah selesai.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map((sub) => (
                            <div
                                key={sub.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors"></div>

                                <div className="flex flex-col h-full space-y-4">
                                    <div>
                                        <div className="text-xs font-black text-indigo-400 uppercase mb-1">{sub.kelas}</div>
                                        <h3 className="text-xl font-bold text-white truncate">{sub.siswa_nama}</h3>
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-2">Kompetensi yang dipilih:</div>
                                        <ul className="space-y-1">
                                            {sub.items.map((item, i) => (
                                                <li key={i} className="text-sm text-slate-300 flex gap-2">
                                                    <span className="text-indigo-500 mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => setSelectedSub(sub)}
                                        className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                                    >
                                        Review Pengajuan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedSub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black uppercase">Detail KRS</h2>
                                    <p className="text-indigo-100 font-medium">{selectedSub.siswa_nama} — {selectedSub.kelas}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedSub(null)}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="space-y-3 font-medium">
                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Kriteria yang diajukan:</div>
                                <div className="space-y-2">
                                    {selectedSub.items.map((item, i) => (
                                        <div key={i} className="p-3 bg-slate-800/50 border border-slate-800 rounded-xl text-sm">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {userRole === 'hod' && (
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-400" /> Tentukan Jadwal Ujian (Wajib)
                                    </label>
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 transition-all outline-none"
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Catatan untuk Siswa (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Beri masukan atau alasan penolakan..."
                                    className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 transition-all outline-none resize-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex gap-4">
                            <button
                                onClick={() => handleReject(selectedSub.id)}
                                className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-all"
                            >
                                Tolak
                            </button>
                            <button
                                onClick={() => handleApprove(selectedSub.id)}
                                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
