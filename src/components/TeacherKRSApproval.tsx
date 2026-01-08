import { useState, useEffect } from 'react';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { KRSSubmission, User } from '../types';
import { Check, X, Calendar, MessageSquare, ChevronLeft, Award, Clock } from 'lucide-react';
import { GradingModal } from './GradingModal';

interface TeacherKRSApprovalProps {
    onBack: () => void;
    user: User;
}

export function TeacherKRSApproval({ onBack, user }: TeacherKRSApprovalProps) {
    const [submissions, setSubmissions] = useState<KRSSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<KRSSubmission | null>(null);
    const [examDate, setExamDate] = useState('');
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'pending' | 'grading'>('pending');
    const [gradingSub, setGradingSub] = useState<KRSSubmission | null>(null);

    const userRole = user.role;

    // Helper to normalize class names (e.g., "12 TKR 3" vs "XII TKR 3")
    const normalizeClass = (name?: string) => {
        if (!name) return '';
        return name.toUpperCase()
            .replace(/\s+/g, ' ')
            .replace(/^10\s/, 'X ')
            .replace(/^11\s/, 'XI ')
            .replace(/^12\s/, 'XII ')
            .trim();
    };

    useEffect(() => {
        loadSubmissions();
        window.addEventListener(KRS_UPDATED_EVENT, loadSubmissions);
        return () => window.removeEventListener(KRS_UPDATED_EVENT, loadSubmissions);
    }, [user.id, userRole, activeTab]);

    const loadSubmissions = () => {
        setLoading(true);
        const all = krsStore.getSubmissions();
        const userDeptId = user.jurusan_id;
        const userNormClass = normalizeClass(user.kelas);

        // Filter based on role, department, and class
        const filtered = all.filter((s: KRSSubmission) => {
            // Filter by Tab
            if (activeTab === 'pending') {
                if (s.status === 'completed' || s.status === 'rejected' || s.status === 'scheduled') return false;
            } else {
                if (s.status !== 'scheduled') return false;
            }

            // 1. Check Status Role Match
            let statusMatch = false;
            if (userRole === 'teacher_produktif' || userRole === 'teacher') {
                statusMatch = s.status === 'pending_produktif' || s.status === 'scheduled';
            } else if (userRole === 'wali_kelas') {
                statusMatch = s.status === 'pending_wali' || s.status === 'pending_produktif' || s.status === 'scheduled';
            } else if (userRole === 'hod') {
                statusMatch = s.status === 'pending_hod' || s.status === 'scheduled';
            } else if (userRole === 'admin') {
                statusMatch = true;
            }

            if (!statusMatch) return false;

            // 2. Check Department Match (except Admin)
            if (userRole !== 'admin') {
                if (userDeptId && s.jurusan_id !== userDeptId) return false;
            }

            // 3. Check Class Match for Wali Kelas (specifically for the walas stage)
            if (userRole === 'wali_kelas' && s.status === 'pending_wali') {
                const studentNormClass = normalizeClass(s.kelas);
                if (userNormClass && studentNormClass !== userNormClass) return false;
            }

            return true;
        });
        setSubmissions(filtered);
        setLoading(false);
    };

    const handleApprove = (id: string | KRSSubmission) => {
        const submissionId = typeof id === 'string' ? id : id.id;
        const sub = typeof id === 'string' ? submissions.find(s => s.id === id) : id;

        if (!sub) return;

        if (userRole === 'hod' && !examDate) {
            alert("HOD wajib menentukan tanggal ujian.");
            return;
        }

        // Determine acting role for krsStore
        let actingRole = userRole as string;
        if (userRole === 'wali_kelas' && sub.status === 'pending_produktif') {
            actingRole = 'teacher_produktif';
        }

        krsStore.approveKRS(submissionId, actingRole, notes, examDate);
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

    const handleGrading = (score: number, result: 'Lulus' | 'Tidak Lulus', gradingNotes: string) => {
        if (!gradingSub) return;
        krsStore.completeKRS(gradingSub.id, score, result, gradingNotes, user.nama);
        setGradingSub(null);
        alert("Penilaian berhasil disimpan!");
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

                {/* Tab Navigation */}
                <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pending'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Pengajuan
                    </button>
                    <button
                        onClick={() => setActiveTab('grading')}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'grading'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Award className="w-4 h-4" />
                        Penilaian Ujian
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-indigo-500 font-bold text-indigo-500"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
                        <Check className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-500">
                            {activeTab === 'pending' ? 'Tidak ada pengajuan KRS baru' : 'Tidak ada ujian yang perlu dinilai'}
                        </h2>
                        <p className="text-slate-600">Terima kasih atas dedikasi Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map((sub: KRSSubmission) => (
                            <div
                                key={sub.id}
                                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-500/10 transition-colors"></div>

                                <div className="flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs font-black text-indigo-400 uppercase mb-1">{sub.kelas}</div>
                                            <h3 className="text-xl font-bold text-white truncate">{sub.siswa_nama}</h3>
                                        </div>
                                        {sub.status === 'scheduled' && (
                                            <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-500 font-black uppercase">
                                                Jadwal: {sub.exam_date}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-2">Kompetensi yang dipilih:</div>
                                        <ul className="space-y-1">
                                            {sub.items.map((item: string, i: number) => (
                                                <li key={i} className="text-sm text-slate-300 flex gap-2">
                                                    <span className="text-indigo-500 mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (activeTab === 'pending') {
                                                setSelectedSub(sub);
                                            } else {
                                                setGradingSub(sub);
                                            }
                                        }}
                                        className={`w-full py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'pending'
                                            ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                                            }`}
                                    >
                                        {activeTab === 'pending' ? 'Review Pengajuan' : 'Input Nilai Ujian'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Grading Modal */}
            {gradingSub && (
                <GradingModal
                    submission={gradingSub}
                    onClose={() => setGradingSub(null)}
                    onConfirm={handleGrading}
                />
            )}

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
                                    {(selectedSub.items as string[]).map((item: string, i: number) => (
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
