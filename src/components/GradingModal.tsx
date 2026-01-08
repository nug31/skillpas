import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, MessageSquare, Award } from 'lucide-react';
import { KRSSubmission } from '../types';

interface GradingModalProps {
    submission: KRSSubmission;
    onClose: () => void;
    onConfirm: (score: number, result: 'Lulus' | 'Tidak Lulus', notes: string) => void;
    initialScore?: number;
}

export function GradingModal({ submission, onClose, onConfirm, initialScore }: GradingModalProps) {
    const [score, setScore] = useState<number>(initialScore || 80);
    const [result, setResult] = useState<'Lulus' | 'Tidak Lulus'>('Lulus');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleConfirm = async () => {
        if (score < 0 || score > 100) {
            alert("Skor harus antara 0 - 100");
            return;
        }
        try {
            setIsSaving(true);
            await onConfirm(score, result, notes);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Input Nilai Ujian</h2>
                        <p className="text-xs text-slate-400">{submission.siswa_nama} — {submission.kelas}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Score Input */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" /> Skor XP (0 - 100)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="w-full px-4 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-3xl font-black text-center text-white focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    {/* Result Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Hasil Keputusan</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setResult('Lulus')}
                                className={`py-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-1 ${result === 'Lulus'
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 grayscale'
                                    }`}
                            >
                                <CheckCircle className="w-6 h-6" />
                                <span>LULUS</span>
                            </button>
                            <button
                                onClick={() => setResult('Tidak Lulus')}
                                className={`py-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-1 ${result === 'Tidak Lulus'
                                    ? 'bg-red-500/10 border-red-500 text-red-500'
                                    : 'bg-slate-950 border-slate-800 text-slate-500 grayscale'
                                    }`}
                            >
                                <AlertTriangle className="w-6 h-6" />
                                <span>TIDAK LULUS</span>
                            </button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-indigo-400" /> Catatan Feedback
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Contoh: Sangat baik dalam perakitan, perlu diperdalam di bagian troubleshooting."
                            className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 transition-all outline-none resize-none text-sm"
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 text-slate-400 font-bold hover:text-white transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSaving}
                        className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <span>Simpan Penilaian</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
