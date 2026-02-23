import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Upload, ImageIcon, Video, CheckCircle,
    XCircle, Clock, Trash2, RefreshCw, Camera, Film
} from 'lucide-react';
import { krsStore } from '../lib/krsStore';
import type { KRSSubmission } from '../types';
import type { User } from '../types';
import { EvidenceUploadModal } from './EvidenceUploadModal';

interface EvidenceDashboardProps {
    user: User;
    onBack: () => void;
}

export function EvidenceDashboard({ user, onBack }: EvidenceDashboardProps) {
    const [submission, setSubmission] = useState<KRSSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const sub = await krsStore.getStudentSubmission(user.id);
            if (sub) {
                setSubmission(sub);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user.id]);

    const totalPhotos = submission?.evidence_photos?.length ?? 0;
    const totalVideos = submission?.evidence_videos?.length ?? 0;
    const hasEvidence = totalPhotos > 0 || totalVideos > 0;

    const statusConfig = {
        pending_produktif: { label: 'Menunggu Guru Produktif', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
        pending_wali: { label: 'Menunggu Wali Kelas', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
        pending_hod: { label: 'Menunggu Ketua Jurusan', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Clock },
        approved: { label: 'Disetujui – Jadwal Ujian Ditetapkan', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
        scheduled: { label: 'Ujian Dijadwalkan', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', icon: Clock },
        completed: { label: 'Ujian Selesai', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
        rejected: { label: 'Ditolak', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle },
    };

    const currentStatus = submission ? statusConfig[submission.status as keyof typeof statusConfig] : null;
    const canUpload = submission && (
        submission.status === 'scheduled' ||
        submission.status === 'completed' ||
        submission.status === 'approved'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a]">
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-white/70" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard Dokumentasi Ujian</h1>
                        <p className="text-sm text-white/50 mt-0.5">Kelola bukti foto dan video ujian kompetensi Anda</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                    </div>
                ) : !submission ? (
                    /* No submission found */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-10 h-10 text-white/30" />
                        </div>
                        <p className="text-white/50">Belum ada pengajuan KRS yang ditemukan.</p>
                        <p className="text-white/30 text-sm mt-1">Upload bukti tersedia setelah ujian dijadwalkan.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-6">

                        {/* Status Card */}
                        {currentStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl border ${currentStatus.bg} flex items-center gap-3`}
                            >
                                <currentStatus.icon className={`w-5 h-5 ${currentStatus.color} flex-shrink-0`} />
                                <div>
                                    <div className="text-sm font-semibold text-white">Status KRS: <span className={currentStatus.color}>{currentStatus.label}</span></div>
                                    {submission.exam_date && (
                                        <div className="text-xs text-white/50 mt-0.5">
                                            Jadwal Ujian: {new Date(submission.exam_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Foto Terupload', value: totalPhotos, icon: Camera, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                                { label: 'Video Terupload', value: totalVideos, icon: Film, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                                { label: 'Status Upload', value: hasEvidence ? 'Tersedia' : 'Kosong', icon: hasEvidence ? CheckCircle : XCircle, color: hasEvidence ? 'text-emerald-400' : 'text-red-400', bg: hasEvidence ? 'bg-emerald-500/10' : 'bg-red-500/10' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 text-center"
                                >
                                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Upload Button */}
                        {canUpload ? (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                <Upload className="w-5 h-5" />
                                {hasEvidence ? 'Tambah / Perbarui Bukti' : 'Upload Bukti Pertama'}
                            </button>
                        ) : (
                            <div className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-medium flex items-center justify-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                Upload tersedia setelah ujian dijadwalkan
                            </div>
                        )}

                        {/* Photo Gallery */}
                        {totalPhotos > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                                    <h3 className="font-semibold text-white">Foto Bukti <span className="text-white/40 font-normal">({totalPhotos} foto)</span></h3>
                                    <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {submission.evidence_photos!.map((url, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="relative aspect-video rounded-xl overflow-hidden bg-white/5 cursor-pointer group border border-white/5"
                                            onClick={() => setSelectedPhoto(url)}
                                        >
                                            <img
                                                src={url}
                                                alt={`Foto bukti ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                                <span className="text-white opacity-0 group-hover:opacity-100 transition-all text-xs font-medium">Lihat</span>
                                            </div>
                                            <div className="absolute top-2 right-2 bg-black/50 rounded-full px-1.5 py-0.5 text-xs text-white/70">
                                                {idx + 1}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Video List */}
                        {totalVideos > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/[0.03] border border-white/8 rounded-2xl p-5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Video className="w-5 h-5 text-amber-400" />
                                    <h3 className="font-semibold text-white">Video Bukti <span className="text-white/40 font-normal">({totalVideos} video)</span></h3>
                                    <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5" /> Terverifikasi
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {submission.evidence_videos!.map((url, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
                                            <video
                                                src={url}
                                                controls
                                                className="w-full max-h-64 object-contain bg-black"
                                                preload="metadata"
                                            />
                                            <div className="px-3 py-2 flex items-center gap-2">
                                                <Film className="w-4 h-4 text-amber-400/70" />
                                                <span className="text-xs text-white/50">Video Bukti #{idx + 1}</span>
                                                <span className="ml-auto text-xs text-emerald-400">✓ Upload berhasil</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Empty state */}
                        {!hasEvidence && canUpload && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl p-10 text-center"
                            >
                                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Camera className="w-8 h-8 text-indigo-400/60" />
                                </div>
                                <p className="text-white/50 font-medium">Belum ada bukti yang diunggah</p>
                                <p className="text-white/30 text-sm mt-1">Klik tombol di atas untuk mulai mengunggah foto atau video bukti ujian Anda.</p>
                            </motion.div>
                        )}

                        {/* Info box */}
                        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-2xl p-4 flex gap-3">
                            <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-white/60">
                                <span className="text-white/80 font-medium">Bukti ini akan terlihat oleh industri</span> yang memindai QR Code Paspor digital Anda. Pastikan foto atau video menunjukkan kegiatan ujian praktik secara nyata.
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Photo Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
                        <Trash2 className="w-5 h-5 text-white" />
                    </button>
                    <img
                        src={selectedPhoto}
                        alt="Bukti ujian"
                        className="max-w-full max-h-full rounded-xl object-contain"
                        onClick={e => e.stopPropagation()}
                    />
                    <button
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <XCircle className="w-5 h-5 text-white" />
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && submission && (
                <EvidenceUploadModal
                    submissionId={submission.id}
                    siswaNama={user.name}
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={() => {
                        setShowUploadModal(false);
                        loadData();
                    }}
                    initialPhotos={submission.evidence_photos}
                    initialVideos={submission.evidence_videos}
                />
            )}
        </div>
    );
}
