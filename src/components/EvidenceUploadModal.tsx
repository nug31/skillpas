import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { supabase, isMockMode } from '../lib/supabase';
import { krsStore } from '../lib/krsStore';
import { motion } from 'framer-motion';

interface EvidenceUploadModalProps {
    submissionId: string;
    siswaNama: string;
    onClose: () => void;
    onSuccess: () => void;
    initialPhotos?: string[];
    initialVideos?: string[];
}

export function EvidenceUploadModal({ submissionId, siswaNama, onClose, onSuccess, initialPhotos = [], initialVideos = [] }: EvidenceUploadModalProps) {
    const [photos, setPhotos] = useState<string[]>(initialPhotos);
    const [videos, setVideos] = useState<string[]>(initialVideos);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const photoInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError(null);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Limit size: 5MB for photos, 20MB for videos
            const maxSize = type === 'photo' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
            if (file.size > maxSize) {
                setError(`File ${file.name} terlalu besar. Maksimal ${type === 'photo' ? '5MB' : '20MB'}.`);
                continue;
            }

            if (isMockMode) {
                // In mock mode, we use Object URLs for preview and "persistence" in this session
                const url = URL.createObjectURL(file);
                if (type === 'photo') setPhotos(prev => [...prev, url]);
                else setVideos(prev => [...prev, url]);
            } else {
                // Real Supabase upload
                setUploading(true);
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${submissionId}-${Date.now()}-${i}.${fileExt}`;
                    const filePath = `evidence/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('student-photos') // Using existing bucket or we might need a new one
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('student-photos')
                        .getPublicUrl(filePath);

                    if (type === 'photo') setPhotos(prev => [...prev, publicUrl]);
                    else setVideos(prev => [...prev, publicUrl]);
                } catch (err: any) {
                    console.error("Upload error:", err);
                    setError(`Gagal mengunggah ${file.name}: ${err.message}`);
                } finally {
                    setUploading(false);
                }
            }
        }

        // Reset input
        e.target.value = '';
    };

    const handleRemove = (index: number, type: 'photo' | 'video') => {
        if (type === 'photo') {
            setPhotos(prev => prev.filter((_, i) => i !== index));
        } else {
            setVideos(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async () => {
        setUploading(true);
        try {
            const success = await krsStore.updateEvidence(submissionId, photos, videos);
            if (success) {
                onSuccess();
                onClose();
            } else {
                throw new Error("Gagal menyimpan ke database");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Upload className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Upload Bukti Ujian</h3>
                            <p className="text-xs text-slate-400">{siswaNama}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                            <X className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Photo Upload Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-emerald-400" />
                                Foto Kegiatan (Max 5MB)
                            </label>
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                                </div>
                                <span className="text-xs text-slate-500">Klik untuk pilih foto</span>
                                <input
                                    type="file"
                                    ref={photoInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileSelect(e, 'photo')}
                                />
                            </div>

                            {/* Photo Previews */}
                            <div className="grid grid-cols-3 gap-2">
                                {photos.map((url, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group">
                                        <img src={url} className="w-full h-full object-cover" alt="Preview" />
                                        <button
                                            onClick={() => handleRemove(idx, 'photo')}
                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Video Upload Section */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                <Video className="w-4 h-4 text-amber-400" />
                                Video Kegiatan (Max 20MB)
                            </label>
                            <div
                                onClick={() => videoInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer group"
                            >
                                <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
                                    <Plus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                                </div>
                                <span className="text-xs text-slate-500">Klik untuk pilih video</span>
                                <input
                                    type="file"
                                    ref={videoInputRef}
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) => handleFileSelect(e, 'video')}
                                />
                            </div>

                            {/* Video Previews */}
                            <div className="space-y-2">
                                {videos.map((_url, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-lg group">
                                        <div className="w-10 h-10 bg-amber-500/20 rounded flex items-center justify-center">
                                            <Video className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-slate-400 truncate">Video Bukti #{idx + 1}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(idx, 'video')}
                                            className="p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                        <p className="text-[11px] text-slate-400 leading-relaxed italic">
                            * Bukti ini sangat penting agar pihak industri mengetahui bahwa Anda benar-benar melaksanakan ujian praktik secara mandiri dan kompeten.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex items-center justify-end gap-3 bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={uploading || (photos.length === 0 && videos.length === 0)}
                        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Simpan Perubahan
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function Plus({ className, size }: { className?: string, size?: number }) {
    return (
        <svg
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}
