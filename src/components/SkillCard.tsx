import { useRef, useState, useEffect } from 'react';
import { Download, Share2, X } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import type { StudentListItem, LevelSkill } from '../types';
import { ProfileAvatar } from './ProfileAvatar';
import smkLogo from '../assets/smk-logo.png';

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
            width: 100,
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

// Custom Gold Medal Component
const GoldMedal = ({ level }: { level: string }) => (
    <div className="relative flex flex-col items-center">
        <div className="relative w-24 h-24">
            {/* Medal Bloom/Glow */}
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse" />

            {/* The Medal SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBDF7E" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#8A6624" />
                    </linearGradient>
                    <filter id="innerShadow">
                        <feOffset dx="0" dy="2" />
                        <feGaussianBlur stdDeviation="1" result="offset-blur" />
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                        <feFlood floodColor="black" floodOpacity="0.4" result="color" />
                        <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                        <feComposite operator="over" in="shadow" in2="SourceGraphic" />
                    </filter>
                </defs>

                {/* Outer decorative circle */}
                <circle cx="50" cy="45" r="35" fill="url(#goldGradient)" />
                <circle cx="50" cy="45" r="32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

                {/* Main Medal face */}
                <circle cx="50" cy="45" r="30" fill="url(#goldGradient)" filter="url(#innerShadow)" />

                {/* Center Star */}
                <path
                    d="M50 25 L56 38 L70 38 L59 47 L63 60 L50 52 L37 60 L41 47 L30 38 L44 38 Z"
                    fill="rgba(255,255,255,0.4)"
                    className="animate-pulse"
                />

                {/* Banner/Ribbon */}
                <path
                    d="M15 55 L30 55 L35 48 L65 48 L70 55 L85 55 L85 68 L70 68 L65 61 L35 61 L30 68 L15 68 Z"
                    fill="#B8860B"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                />
                <path
                    d="M30 55 L70 55 L70 68 L30 68 Z"
                    fill="url(#goldGradient)"
                />
            </svg>

            {/* Banner Text */}
            <div className="absolute inset-x-0 top-[53px] flex justify-center">
                <span className="text-[9px] font-black text-amber-900 uppercase tracking-tighter">
                    {level || 'MASTERY'}
                </span>
            </div>
        </div>
    </div>
);

export function SkillCard({ student, jurusanName, onClose }: Omit<SkillCardProps, 'levels'>) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    // Generate QR code on mount
    useEffect(() => {
        const url = `${window.location.origin}/verify/${student.id}`;
        generateQRCode(url).then(setQrCode);
    }, [student.id]);

    const currentYear = new Date().getFullYear();
    const scoreProgress = (student.skor / 100) * 100;

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
                logging: false,
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
                scale: 3,
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
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-6">
                {/* Action Buttons */}
                <div className="flex items-center gap-3 no-canvas-hide">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-2xl font-bold text-sm hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        {isDownloading ? 'Mengunduh...' : 'Unduh Kartu'}
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl font-bold text-sm hover:bg-cyan-500/30 transition-all backdrop-blur-md border border-cyan-500/20 disabled:opacity-50"
                    >
                        <Share2 className="w-4 h-4" />
                        {isSharing ? 'Membagikan...' : 'Bagikan'}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-2xl transition-colors border border-red-500/10 group"
                    >
                        <X className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                {/* The Skill Card Container */}
                <div
                    ref={cardRef}
                    className="relative w-[360px] aspect-[3/4] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10"
                    style={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
                    }}
                >
                    {/* Background Visual Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[100px] rounded-full" />

                        {/* Grid Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                        />
                    </div>

                    {/* Circuit Lines Background */}
                    <div className="absolute top-[20%] inset-x-0 h-48 opacity-[0.15]">
                        <svg className="w-full h-full" viewBox="0 0 360 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            {/* Horizontal and diagonal lines matching the image style */}
                            {[...Array(6)].map((_, i) => (
                                <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>
                                    <path d={`M 0 ${60 + i * 20} H 120 L 150 ${90 + i * 10}`} stroke="url(#lineGrad)" strokeWidth="1" fill="none" />
                                    <path d={`M 360 ${60 + i * 20} H 240 L 210 ${90 + i * 10}`} stroke="url(#lineGrad)" strokeWidth="1" fill="none" />
                                    <circle cx={150} cy={90 + i * 10} r="1.5" fill="#3b82f6" />
                                    <circle cx={210} cy={90 + i * 10} r="1.5" fill="#3b82f6" />
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 p-8 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <img src={smkLogo} alt="Logo" className="w-14 h-14 object-contain filter drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                            <div className="text-3xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                {currentYear}
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="mt-4 flex flex-col items-center">
                            <div className="relative">
                                {/* Double Glowing Ring */}
                                <div className="absolute inset-[-12px] rounded-full border-[1.5px] border-cyan-400/20 blur-[2px]" />
                                <div className="absolute inset-[-8px] rounded-full border-[2.5px] border-cyan-400/40 blur-[1px]" />
                                <div className="absolute inset-[-4px] rounded-full border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" />

                                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-700">
                                    {student.photo_url ? (
                                        <img src={student.photo_url} alt={student.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <ProfileAvatar name={student.nama} avatarUrl={student.avatar_url} size="lg" />
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="mt-8 text-center">
                                <h2 className="text-3xl font-black text-white mb-1 tracking-tight">
                                    {student.nama}
                                </h2>
                                <p className="text-lg font-medium text-slate-400">
                                    {jurusanName || 'Teknik'}
                                </p>
                            </div>
                        </div>

                        {/* Medal & Level */}
                        <div className="mt-6 flex justify-center">
                            <GoldMedal level={student.level_name} />
                        </div>

                        {/* Score & Progress */}
                        <div className="mt-auto mb-4 flex flex-col items-center gap-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-white">{student.skor}</span>
                                <span className="text-xl font-bold text-slate-500">/100</span>
                            </div>

                            {/* Custom Progress Bar */}
                            <div className="w-full max-w-[200px] h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    style={{ width: `${scoreProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-start">
                            {qrCode && (
                                <div className="relative p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 group overflow-hidden">
                                    <div className="absolute inset-0 bg-white opacity-[0.02] transform rotate-45 translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700" />
                                    <img src={qrCode} alt="QR" className="w-16 h-16 invert opacity-80" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Glass Overlay Shine */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                        }}
                    />
                </div>

                <p className="text-center text-slate-500 text-xs font-medium tracking-wide bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                    VERIFIED SKILL PASSPORT • {student.id.slice(0, 8).toUpperCase()}
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(200%) rotate(45deg); }
                }
                .shimmer-effect {
                    position: relative;
                    overflow: hidden;
                }
                .shimmer-effect::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(255, 255, 255, 0.1),
                        transparent
                    );
                    transform: rotate(45deg);
                    animation: shimmer 3s infinite;
                }
            `}</style>
        </div>
    );
}

export default SkillCard;
