import { useRef, useState } from 'react';
import { Download, Share2, X, Award, Star, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import type { StudentListItem, LevelSkill } from '../types';
import { ProfileAvatar } from './ProfileAvatar';

interface SkillCardProps {
    student: StudentListItem;
    levels: LevelSkill[];
    jurusanName?: string;
    onClose: () => void;
}

// Helper to generate QR code data URL
async function generateQRCode(text: string): Promise<string> {
    try {
        return await QRCode.toDataURL(text, {
            width: 80,
            margin: 1,
            color: {
                dark: '#ffffff',
                light: 'transparent',
            },
        });
    } catch {
        return '';
    }
}

// Get badge configuration based on level
function getBadgeConfig(levelName: string): { color: string; gradient: string; icon: typeof Award } {
    const configs: Record<string, { color: string; gradient: string; icon: typeof Award }> = {
        'Mastery': {
            color: '#FFD700',
            gradient: 'from-amber-400 via-yellow-500 to-amber-600',
            icon: Star
        },
        'Advanced': {
            color: '#C0C0C0',
            gradient: 'from-slate-300 via-gray-400 to-slate-500',
            icon: Award
        },
        'Intermediate': {
            color: '#CD7F32',
            gradient: 'from-orange-400 via-amber-600 to-orange-700',
            icon: Sparkles
        },
        'Beginner 2': {
            color: '#4CAF50',
            gradient: 'from-emerald-400 via-green-500 to-emerald-600',
            icon: Award
        },
        'Beginner 1': {
            color: '#2196F3',
            gradient: 'from-blue-400 via-cyan-500 to-blue-600',
            icon: Award
        },
    };
    return configs[levelName] || configs['Beginner 1'];
}

export function SkillCard({ student, levels, jurusanName, onClose }: SkillCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Generate QR code on mount
    useState(() => {
        const url = `${window.location.origin}/verify/${student.id}`;
        generateQRCode(url).then(setQrCode);
    });

    // Get current level info
    const currentLevel = levels.find(l => l.nama_level === student.level_name) || levels[0];
    const badgeConfig = getBadgeConfig(student.level_name);
    const BadgeIcon = badgeConfig.icon;
    const currentYear = new Date().getFullYear();

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `skill-card-${student.nama.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to download:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    // Share card
    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
            });
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `skill-card-${student.nama}.png`, { type: 'image/png' });

                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({
                        title: `Skill Card - ${student.nama}`,
                        text: `Lihat Skill Card saya dari SMK Mitra Industri!`,
                        files: [file],
                    });
                } else {
                    // Fallback: copy image URL to clipboard
                    const url = canvas.toDataURL('image/png');
                    await navigator.clipboard.writeText(url);
                    alert('Link gambar telah disalin ke clipboard!');
                }
            });
        } catch (err) {
            console.error('Failed to share:', err);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/30 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Mengunduh...' : 'Unduh Kartu'}
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-sm hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                    >
                        <Share2 className="w-4 h-4" />
                        {isSharing ? 'Membagikan...' : 'Bagikan'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* The Skill Card */}
                <div
                    ref={cardRef}
                    className="relative w-[320px] rounded-3xl overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1), 0 0 60px rgba(59, 130, 246, 0.15)',
                    }}
                >
                    {/* Holographic overlay */}
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, transparent 20%, rgba(99,102,241,0.3) 40%, rgba(139,92,246,0.3) 50%, rgba(236,72,153,0.3) 60%, transparent 80%)',
                            backgroundSize: '200% 200%',
                            animation: 'shimmer 3s ease-in-out infinite',
                        }}
                    />

                    {/* Circuit pattern overlay */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 320 480">
                            {/* Left circuit lines */}
                            <path d="M 0 120 L 40 120 L 50 130 L 50 200 L 40 210 L 0 210" stroke="url(#circuitGradient)" strokeWidth="1" fill="none" />
                            <path d="M 0 150 L 30 150 L 35 155 L 35 180 L 30 185 L 0 185" stroke="url(#circuitGradient)" strokeWidth="0.5" fill="none" />
                            {/* Right circuit lines */}
                            <path d="M 320 120 L 280 120 L 270 130 L 270 200 L 280 210 L 320 210" stroke="url(#circuitGradient)" strokeWidth="1" fill="none" />
                            <path d="M 320 150 L 290 150 L 285 155 L 285 180 L 290 185 L 320 185" stroke="url(#circuitGradient)" strokeWidth="0.5" fill="none" />
                            {/* Dots */}
                            <circle cx="50" cy="200" r="2" fill="#818cf8" />
                            <circle cx="270" cy="200" r="2" fill="#818cf8" />
                            <circle cx="35" cy="175" r="1.5" fill="#a78bfa" />
                            <circle cx="285" cy="175" r="1.5" fill="#a78bfa" />
                            <defs>
                                <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#c084fc" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Card content */}
                    <div className="relative z-10 p-6">
                        {/* Header: Logo & Year */}
                        <div className="flex items-start justify-between mb-6">
                            {/* School Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <div className="text-[8px] font-bold text-cyan-300 text-center leading-tight">
                                        SMK<br />MITRA
                                    </div>
                                </div>
                            </div>

                            {/* Year Badge */}
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm">
                                <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                                    {currentYear}
                                </span>
                            </div>
                        </div>

                        {/* Photo with ring */}
                        <div className="flex justify-center mb-5">
                            <div className="relative">
                                {/* Outer glow */}
                                <div
                                    className="absolute inset-0 rounded-full opacity-50 blur-md"
                                    style={{ background: `linear-gradient(135deg, ${badgeConfig.color}, #6366f1)` }}
                                />
                                {/* Ring */}
                                <div
                                    className="relative w-32 h-32 rounded-full p-1"
                                    style={{
                                        background: `linear-gradient(135deg, ${badgeConfig.color}, #6366f1, ${badgeConfig.color})`,
                                    }}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                                        {student.photo_url ? (
                                            <img
                                                src={student.photo_url}
                                                alt={student.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ProfileAvatar
                                                name={student.nama}
                                                avatarUrl={student.avatar_url}
                                                level={student.level_name}
                                                size="lg"
                                                showRing={false}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name & Department */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-white mb-1 tracking-wide">
                                {student.nama}
                            </h2>
                            <p className="text-sm font-medium text-cyan-300/80">
                                {jurusanName || 'Teknik'}
                            </p>
                        </div>

                        {/* Level Badge Section - Without Score */}
                        <div
                            className="relative rounded-2xl p-4 mb-4 border border-white/10"
                            style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                            }}
                        >
                            {/* Level Badge */}
                            <div className="flex justify-center mb-3">
                                <div
                                    className={`relative px-5 py-2 rounded-full bg-gradient-to-r ${badgeConfig.gradient} shadow-lg`}
                                    style={{ boxShadow: `0 4px 15px ${badgeConfig.color}40` }}
                                >
                                    <div className="flex items-center gap-2">
                                        <BadgeIcon className="w-5 h-5 text-white drop-shadow-md" />
                                        <span className="text-sm font-black text-white uppercase tracking-widest drop-shadow-md">
                                            {student.level_name || 'Beginner'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status text instead of score */}
                            <div className="text-center">
                                <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
                                    Skill Passport Active
                                </p>
                            </div>
                        </div>

                        {/* Footer: QR Code & Verification */}
                        <div className="flex items-end justify-between">
                            {/* QR Code */}
                            <div className="flex flex-col items-center">
                                {qrCode ? (
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10">
                                        <img src={qrCode} alt="QR Code" className="w-16 h-16" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-white/5 rounded-lg animate-pulse" />
                                )}
                                <span className="text-[8px] text-white/40 mt-1 font-mono">SCAN TO VERIFY</span>
                            </div>

                            {/* Verification info */}
                            <div className="text-right">
                                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-0.5">
                                    Verified by
                                </p>
                                <p className="text-xs font-bold text-cyan-300">
                                    SMK Mitra Industri
                                </p>
                                <p className="text-[10px] text-white/40 font-mono mt-1">
                                    ID: {student.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom gradient line */}
                    <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                </div>

                {/* Caption */}
                <p className="text-center text-white/50 text-sm max-w-xs">
                    Kartu ini adalah bukti pencapaian kompetensi resmi yang dapat diverifikasi
                </p>
            </div>

            {/* Keyframes for shimmer animation */}
            <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
        </div>
    );
}

export default SkillCard;
