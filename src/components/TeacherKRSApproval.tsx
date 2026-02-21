import { useState, useEffect } from 'react';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import { KRSSubmission, User } from '../types';
import { Check, X, Calendar, MessageSquare, ChevronLeft, Award, Clock } from 'lucide-react';
import { GradingModal } from './GradingModal';
import { cleanSubItemText, isSubItem } from '../lib/criteriaHelper';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';

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
    const [currentScore, setCurrentScore] = useState<number>(80);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [passedItems, setPassedItems] = useState<Set<string>>(new Set());
    const [lastActionResult, setLastActionResult] = useState<{
        type: 'scheduled' | 'graded',
        name: string,
        result?: string,
        score?: number,
        wa_number?: string,
        exam_date?: string,
        count?: number
    } | null>(null);

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

    useEffect(() => {
        const fetchMasteryHistory = async () => {
            if (!selectedSub) {
                setPassedItems(new Set());
                return;
            }

            const studentId = selectedSub.siswa_id;
            const items = new Set<string>();

            if (isMockMode) {
                const history = mockData.mockCompetencyHistory.filter(h => h.siswa_id === studentId && h.hasil === 'Lulus');
                history.forEach((h: any) => {
                    h.unit_kompetensi.split(',').forEach((item: string) => items.add(item.trim()));
                });
            } else {
                const { data } = await supabase
                    .from('competency_history')
                    .select('unit_kompetensi')
                    .eq('siswa_id', studentId)
                    .eq('hasil', 'Lulus');

                if (data) {
                    data.forEach((h: any) => {
                        h.unit_kompetensi.split(',').forEach((item: string) => items.add(item.trim()));
                    });
                }
            }
            setPassedItems(items);
        };

        fetchMasteryHistory();
    }, [selectedSub]);

    const loadSubmissions = async () => {
        setLoading(true);
        const all = await krsStore.getSubmissions();
        const userDeptId = user.jurusan_id;

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
                // Walas can see everything submitted in their class, regardless of current status stage
                statusMatch = true;
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

            // 3. Class Match for Wali Kelas or checking specific class assignments
            const studentNormClass = normalizeClass(s.kelas);
            const userClasses = (user.kelas || '').split(',').map(c => normalizeClass(c.trim())).filter(Boolean);

            if (userRole === 'wali_kelas') {
                if (userClasses.length > 0 && !userClasses.includes(studentNormClass)) return false;
                if (userClasses.length === 0) return false;
            }

            return true;
        });
        setSubmissions(filtered);
        setLoading(false);
    };

    const handleApprove = async (id: string | KRSSubmission) => {
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

        const success = await krsStore.approveKRS(submissionId, actingRole, notes, examDate);
        if (success) {
            let wa = '';
            if (isMockMode) {
                const s = mockData.mockSiswa.find(si => si.id === sub.siswa_id);
                if (s) wa = (s as any).wa_number || '';
            }

            if (examDate) {
                setLastActionResult({ type: 'scheduled', name: sub.siswa_nama, wa_number: wa, exam_date: examDate });
            }

            setSelectedSub(null);
            setExamDate('');
            setNotes('');
            loadSubmissions();
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.length === 0) return;

        if (userRole === 'hod' && !examDate) {
            alert("HOD wajib menentukan satu tanggal ujian untuk batch ini.");
            return;
        }

        const confirmMsg = `Setujui ${selectedIds.length} pendaftaran sekaligus?`;
        if (!confirm(confirmMsg)) return;

        let actingRole = userRole as string;
        // Simplified: Bulk approval assumes productivity approval if walas does it
        if (userRole === 'wali_kelas') actingRole = 'teacher_produktif';

        const success = await krsStore.approveBulkKRS(selectedIds, actingRole, notes, examDate);
        if (success) {
            if (examDate) {
                setLastActionResult({ type: 'scheduled', name: `${selectedIds.length} Siswa`, count: selectedIds.length, exam_date: examDate });
            } else {
                alert(`${selectedIds.length} pendaftaran berhasil disetujui!`);
            }
            setSelectedIds([]);
            setExamDate('');
            setNotes('');
            loadSubmissions();
        }
    };

    const handleReject = async (id: string) => {
        if (!notes) {
            alert("Harap berikan catatan alasan penolakan.");
            return;
        }
        await krsStore.rejectKRS(id, notes);
        setSelectedSub(null);
        setNotes('');
    };

    const handleGrading = async (score: number, result: 'Lulus' | 'Tidak Lulus', gradingNotes: string) => {
        if (!gradingSub) return;
        const studentName = gradingSub.siswa_nama;
        const success = await krsStore.completeKRS(gradingSub.id, score, result, gradingNotes, user.name);

        if (success) {
            // Find student's WA number for the notification
            let wa = '';
            if (isMockMode) {
                const s = mockData.mockSiswa.find(si => si.id === gradingSub.siswa_id);
                if (s) wa = (s as any).wa_number || '';
            }

            setLastActionResult({ type: 'graded', name: studentName, result, score, wa_number: wa });
            setGradingSub(null);
            loadSubmissions();
        } else {
            alert("Gagal menyimpan penilaian. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--bg-from)] text-[color:var(--text-primary)] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors [.theme-clear_&]:bg-white [.theme-clear_&]:border [.theme-clear_&]:border-slate-200"
                        >
                            <ChevronLeft className="w-5 h-5 [.theme-clear_&]:text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase [.theme-clear_&]:text-indigo-950">Verifikasi Sertifikasi</h1>
                            <p className="text-slate-400 text-sm [.theme-clear_&]:text-slate-500">Review dan verifikasi pendaftaran sertifikasi competency siswa</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 bg-[color:var(--accent-1)]/10 border border-[color:var(--accent-1)]/20 rounded-full [.theme-clear_&]:bg-emerald-50 [.theme-clear_&]:border-emerald-200">
                        <span className="text-xs font-bold text-[color:var(--accent-1)] uppercase tracking-widest [.theme-clear_&]:text-emerald-700">
                            Role: {userRole.replace('_', ' ')}
                        </span>
                    </div>
                </header>

                {/* Action Success Alert (Scheduled or Graded) */}
                {lastActionResult && (
                    <div className={`border rounded-2xl p-6 animate-fadeInUp flex flex-col sm:flex-row items-center justify-between gap-4 ${lastActionResult.type === 'scheduled'
                        ? 'bg-indigo-500/10 border-indigo-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20'
                        }`}>
                        <div className="flex items-center gap-4 text-center sm:text-left">
                            <div className={`p-3 rounded-full ${lastActionResult.type === 'scheduled' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                                }`}>
                                {lastActionResult.type === 'scheduled' ? (
                                    <Clock className="w-6 h-6 text-indigo-400" />
                                ) : (
                                    <Check className="w-6 h-6 text-emerald-500" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold text-white [.theme-clear_&]:text-slate-900`}>
                                    {lastActionResult.type === 'scheduled' ? 'Jadwal Ujian Tersimpan!' : 'Penilaian Berhasil Disimpan!'}
                                </h3>
                                <p className="text-slate-400 text-sm [.theme-clear_&]:text-slate-500">
                                    {lastActionResult.type === 'scheduled' ? (
                                        <>
                                            Ujian untuk <span className="text-indigo-400 font-bold">{lastActionResult.name}</span> telah dijadwalkan pada {lastActionResult.exam_date}.
                                        </>
                                    ) : (
                                        <>
                                            {lastActionResult.name} dinyatakan <span className="text-emerald-500 font-bold">{lastActionResult.result?.toUpperCase()}</span>.
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            {lastActionResult.type === 'scheduled' && !lastActionResult.count && (
                                <button
                                    onClick={() => {
                                        const msg = `Halo ${lastActionResult.name}, ujian sertifikasi competency Anda telah dijadwalkan pada tanggal ${lastActionResult.exam_date}. Mohon persiapkan diri dengan baik. Terima kasih!`;
                                        const url = `https://wa.me/${lastActionResult.wa_number?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(msg)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    Kirim WA Jadwal
                                </button>
                            )}
                            {lastActionResult.type === 'graded' && (
                                <button
                                    onClick={() => {
                                        const msg = `Halo ${lastActionResult.name}! Selamat, Anda telah dinyatakan ${lastActionResult.result?.toUpperCase()} dalam ujian sertifikasi competency. Tetap semangat dan terus tingkatkan kompetensi Anda! - Tim SkillPas`;
                                        const url = `https://wa.me/${lastActionResult.wa_number?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(msg)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20"
                                >
                                    Kirim WA Hasil
                                </button>
                            )}
                            <button
                                onClick={() => setLastActionResult(null)}
                                className="flex-1 sm:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-bold transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex bg-[color:var(--glass)] border border-white/10 p-1.5 rounded-2xl w-fit [.theme-clear_&]:bg-slate-200/50 [.theme-clear_&]:border-slate-300">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pending'
                            ? 'bg-[color:var(--accent-1)] text-white shadow-lg'
                            : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        Pengajuan
                    </button>
                    {['teacher_produktif', 'hod', 'admin', 'teacher'].includes(userRole) && (
                        <button
                            onClick={() => setActiveTab('grading')}
                            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'grading'
                                ? 'bg-[color:var(--accent-1)] text-white shadow-lg'
                                : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
                                }`}
                        >
                            <Award className="w-4 h-4" />
                            Penilaian Ujian
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-indigo-500 font-bold text-indigo-500"></div>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="text-center py-20 card-glass border border-white/10 rounded-3xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                        <Check className="w-16 h-16 text-[color:var(--text-muted)] mx-auto mb-4 opacity-50" />
                        <h2 className="text-xl font-bold text-[color:var(--text-muted)]">
                            {activeTab === 'pending' ? 'Tidak ada pendaftaran sertifikasi baru' : 'Tidak ada ujian yang perlu dinilai'}
                        </h2>
                        <p className="text-[color:var(--text-muted)]/60">Terima kasih atas dedikasi Anda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {submissions.map((sub: KRSSubmission) => (
                            <div
                                key={sub.id}
                                className={`card-glass border ${selectedIds.includes(sub.id) ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/6'} rounded-2xl p-6 hover:border-[color:var(--accent-1)]/50 transition-all group relative overflow-hidden [.theme-clear_&]:border-slate-200 [.theme-clear_&]:shadow-sm`}
                            >
                                {activeTab === 'pending' && userRole !== 'wali_kelas' && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(sub.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds([...selectedIds, sub.id]);
                                                } else {
                                                    setSelectedIds(selectedIds.filter(id => id !== sub.id));
                                                }
                                            }}
                                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[color:var(--accent-1)]/5 rounded-full -mr-12 -mt-12 group-hover:bg-[color:var(--accent-1)]/10 transition-colors"></div>

                                <div className={`flex flex-col h-full space-y-4 ${activeTab === 'pending' && userRole !== 'wali_kelas' ? 'pl-8' : ''}`}>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs font-black text-[color:var(--accent-1)] uppercase mb-1 [.theme-clear_&]:text-emerald-600 truncate">{sub.kelas}</div>
                                            <h3 className="text-xl font-bold text-[color:var(--text-primary)] truncate" title={sub.siswa_nama}>{sub.siswa_nama}</h3>
                                        </div>
                                        {sub.status === 'scheduled' && (
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-500 font-black uppercase">
                                                    Jadwal: {sub.exam_date}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        let wa = '';
                                                        if (isMockMode) {
                                                            const s = mockData.mockSiswa.find(si => si.id === sub.siswa_id);
                                                            if (s) wa = (s as any).wa_number || '';
                                                        }
                                                        const msg = `Halo ${sub.siswa_nama}, ujian sertifikasi competency Anda telah dijadwalkan pada tanggal ${sub.exam_date}. Mohon persiapkan diri dengan baik. Terima kasih!`;
                                                        const url = `https://wa.me/${wa.replace(/\D/g, '') || ''}?text=${encodeURIComponent(msg)}`;
                                                        window.open(url, '_blank');
                                                    }}
                                                    className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded text-[10px] text-indigo-500 font-bold transition-colors"
                                                >
                                                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.597 6.02L0 24l6.135-1.61a11.782 11.782 0 005.912 1.59c6.633 0 12.036-5.403 12.04-12.043a11.776 11.776 0 00-3.414-8.528z" />
                                                    </svg>
                                                    WA Jadwal
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 font-bold uppercase mb-2 [.theme-clear_&]:text-slate-400">Kompetensi yang dipilih:</div>
                                        <ul className="space-y-1">
                                            {sub.items.map((item: string, i: number) => {
                                                const subItem = isSubItem(item);
                                                return (
                                                    <li key={i} className={`text-sm flex gap-2 ${subItem ? 'ml-4 text-slate-400 [.theme-clear_&]:text-slate-500' : 'text-slate-300 [.theme-clear_&]:text-slate-700'}`}>
                                                        <span className="text-indigo-500 mt-1">{subItem ? '└' : '•'}</span>
                                                        {subItem ? cleanSubItemText(item) : item}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={async () => {
                                            if (activeTab === 'pending') {
                                                setSelectedSub(sub);
                                            } else {
                                                const score = await krsStore.getStudentScore(sub.siswa_id);
                                                setCurrentScore(score);
                                                setGradingSub(sub);
                                            }
                                        }}
                                        className={`w-full py-3 rounded-xl font-bold transition-all text-sm ${activeTab === 'pending'
                                            ? 'bg-white/5 border border-white/10 text-[color:var(--text-primary)] hover:bg-white/10'
                                            : 'bg-[color:var(--accent-1)] text-white hover:opacity-90'
                                            }`}
                                    >
                                        {activeTab === 'pending' ? (userRole === 'wali_kelas' ? 'Lihat Detail' : 'Review Pengajuan') : 'Input Nilai Ujian'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fadeInUp">
                    <div className="bg-[#1e1b4b] border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-6 shadow-2xl backdrop-blur-xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-300">
                        <div className="flex flex-col">
                            <span className="text-white font-black text-sm [.theme-clear_&]:text-slate-900">{selectedIds.length} Terpilih</span>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider hover:text-indigo-300"
                            >
                                Batalkan semua
                            </button>
                        </div>

                        {userRole === 'hod' && (
                            <div className="h-10 w-px bg-white/10" />
                        )}

                        {userRole === 'hod' && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Tanggal Ujian Batch</span>
                                <input
                                    type="date"
                                    value={examDate}
                                    onChange={(e) => setExamDate(e.target.value)}
                                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white outline-none focus:border-indigo-500/50 [.theme-clear_&]:bg-slate-100 [.theme-clear_&]:text-black [.theme-clear_&]:border-slate-200"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleBulkApprove}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Setujui Batch
                        </button>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {gradingSub && (
                <GradingModal
                    submission={gradingSub}
                    initialScore={currentScore}
                    onClose={() => setGradingSub(null)}
                    onConfirm={handleGrading}
                />
            )}

            {/* Review Modal */}
            {selectedSub && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-[color:var(--bg-from)] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-2)] text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black uppercase">Verifikasi Sertifikasi</h2>
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
                            {userRole === 'wali_kelas' && (
                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-xs font-medium italic mb-4">
                                    Wali Kelas hanya memantau progres pengajuan ini. Persetujuan dilakukan oleh Guru Produktif dan HOD.
                                </div>
                            )}

                            <div className="space-y-3 font-medium">
                                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Kriteria yang diajukan:</div>
                                <div className="space-y-2">
                                    {(selectedSub.items as string[]).flatMap(item => typeof item === 'string' ? item.split('\n') : [item]).map((item: any, i: number) => {
                                        const trimmed = typeof item === 'string' ? item.trim() : String(item);
                                        if (!trimmed) return null;
                                        const subItem = isSubItem(trimmed);
                                        return (
                                            <div key={i} className={`p-3 card-glass border border-white/10 rounded-xl text-sm ${subItem ? 'ml-6' : ''} ${passedItems.has(trimmed) ? 'border-emerald-500/30 opacity-80' : ''}`}>
                                                {subItem ? (
                                                    <div className="flex gap-2 items-center">
                                                        <span className="text-[color:var(--accent-1)]">└</span>
                                                        <span className="text-[color:var(--text-muted)] font-medium flex-1">{cleanSubItemText(trimmed)}</span>
                                                        {passedItems.has(trimmed) && (
                                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Lulus</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[color:var(--text-primary)] font-bold flex-1">{trimmed.replace(/\*\*/g, '')}</span>
                                                        {passedItems.has(trimmed) && (
                                                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Lulus</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {userRole === 'hod' && (
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-[color:var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-emerald-400" /> Tentukan Jadwal Ujian (Wajib)
                                    </label>
                                    <input
                                        type="date"
                                        value={examDate}
                                        onChange={(e) => setExamDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-[color:var(--glass)] border border-white/10 rounded-xl text-[color:var(--text-primary)] focus:border-[color:var(--accent-1)] transition-all outline-none"
                                    />
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-xs font-black text-[color:var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-[color:var(--accent-1)]" /> Catatan untuk Siswa (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Beri masukan atau alasan penolakan..."
                                    className="w-full h-24 px-4 py-3 bg-[color:var(--glass)] border border-white/10 rounded-xl text-[color:var(--text-primary)] focus:border-[color:var(--accent-1)] transition-all outline-none resize-none text-sm"
                                />
                            </div>
                        </div>

                        {userRole !== 'wali_kelas' && (
                            <div className="p-8 border-t border-white/5 bg-white/5 flex gap-4">
                                <button
                                    onClick={() => handleReject(selectedSub.id)}
                                    className="flex-1 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-all"
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedSub.id)}
                                    className="flex-1 py-3 bg-[color:var(--accent-1)] text-white rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[color:var(--accent-1)]/20"
                                >
                                    Setujui
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
