import { useRef, useState, useEffect } from 'react';
import { Download, Share2, X } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import type { StudentListItem, LevelSkill } from '../types';
import smkLogo from '../assets/smk-logo.png';

interface SkillCardProps {
    student: StudentListItem;
    levels: LevelSkill[];
    jurusanName?: string;
    onClose: () => void;
}

async function generateQRCode(text: string): Promise<string> {
    try {
        return await QRCode.toDataURL(text, {
            width: 100,
            margin: 1,
            color: { dark: '#ffffff', light: 'transparent' },
        });
    } catch {
        return '';
    }
}

const GoldMedal = ({ level }: { level: string }) => (
    <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Medal Bloom */}
            <div className="absolute inset-0 bg-yellow-400 blur-[45px] opacity-30 animate-pulse" />
            <div className="absolute inset-4 bg-orange-500 blur-[20px] opacity-20" />

            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
                <defs>
                    <linearGradient id="gold-premium" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2AC" />
                        <stop offset="25%" stopColor="#FDE68A" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="70%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>
                    <linearGradient id="gold-shine" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="metal-texture">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                        <feDiffuseLighting in="noise" lightingColor="#FDE68A" surfaceScale="1">
                            <feDistantLight azimuth="45" elevation="60" />
                        </feDiffuseLighting>
                    </filter>
                </defs>

                {/* Ribbon behind */}
                <path d="M25 40 L35 75 L50 65 L65 75 L75 40" fill="#991b1b" stroke="#450a0a" strokeWidth="0.5" />
                <path d="M25 40 L35 75 L50 65 L65 75 L75 40" fill="url(#gold-shine)" opacity="0.1" />

                {/* Outer Glow Ring */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="#FDE68A" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.3" />

                {/* Medal Body */}
                <circle cx="50" cy="50" r="39" fill="url(#gold-premium)" />

                {/* Scalloped edge */}
                {[...Array(32)].map((_, i) => (
                    <circle key={i} cx={50 + 39 * Math.cos((i * 11.25 * Math.PI) / 180)} cy={50 + 39 * Math.sin((i * 11.25 * Math.PI) / 180)} r="2" fill="url(#gold-premium)" />
                ))}

                {/* Inner Bezel */}
                <circle cx="50" cy="50" r="34" fill="none" stroke="black" strokeOpacity="0.15" strokeWidth="2" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeOpacity="0.25" strokeWidth="0.5" />

                {/* Star Icon - Polished white/gold */}
                <path
                    d="M50 28 L57 42 H72 L61 51 L66 65 L50 56 L34 65 L39 51 L28 42 H43 Z"
                    fill="white"
                    fillOpacity="0.9"
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                />
            </svg>

            {/* Banner with text */}
            <div className="absolute top-[68px] flex flex-col items-center">
                <div className="bg-gradient-to-r from-[#78350F] via-[#B45309] to-[#78350F] px-4 py-0.5 rounded-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-yellow-200/20 transform -skew-x-12">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.1em] block transform skew-x-12 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        {level || 'MASTERY'}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const CircuitLines = () => (
    <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 360 600">
        <defs>
            <linearGradient id="traceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="traceGradSide" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="30%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Side Accents - Thin PCB lines */}
        <g stroke="url(#traceGrad)" strokeWidth="0.5" fill="none">
            <path d="M 10 0 V 600" />
            <path d="M 350 0 V 600" />
        </g>

        {/* Horizontal Traces with Nodes */}
        <g stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.3">
            <path d="M 10 120 H 60 L 80 140 H 120" />
            <path d="M 350 180 H 300 L 280 200 H 240" />
            <path d="M 10 450 H 50 L 70 470 H 150" />
            <path d="M 350 420 H 310 L 290 400 H 200" />
        </g>

        {/* Tiny Nodes */}
        <g fill="#22d3ee" opacity="0.5">
            <circle cx="120" cy="140" r="1.2" />
            <circle cx="240" cy="200" r="1.2" />
            <circle cx="150" cy="470" r="1.2" />
            <circle cx="200" cy="400" r="1.2" />
        </g>
    </svg>
);

export const SkillCard = ({ student, jurusanName, onClose }: Omit<SkillCardProps, 'levels'>) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const url = `https://skillpassmitra.netlify.app/verify/${student.id}`;
        generateQRCode(url).then(setQrCode);
    }, [student.id]);

    const currentYear = 2026; // Fixed as per reference
    const scoreProgress = Math.min(Math.max((student.skor || 0), 0), 100);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            // Wait a bit for QR code to be fully ready
            await new Promise(r => setTimeout(r, 100));
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
                logging: false,
                width: 360,
                height: 600,
            });
            const link = document.createElement('a');
            link.download = `skill-card-${student.nama.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) { console.error(err); } finally { setIsDownloading(false); }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsSharing(true);
        try {
            const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 3, useCORS: true });
            canvas.toBlob(async (blob) => {
                if (!blob) return;
                const file = new File([blob], `skill-card-${student.nama}.png`, { type: 'image/png' });
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ title: `Skill Card - ${student.nama}`, files: [file] });
                } else {
                    const dataUrl = canvas.toDataURL('image/png');
                    await navigator.clipboard.writeText(dataUrl);
                    alert('Gambar telah disalin ke clipboard!');
                }
            });
        } catch (err) { console.error(err); } finally { setIsSharing(false); }
    };

    const getInitials = (n?: string) => {
        if (!n) return '??';
        const parts = n.split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return n.slice(0, 2).toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl">
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[360px]">
                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full justify-center no-canvas-hide">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 h-12 bg-white/10 hover:bg-white/15 text-white rounded-xl font-bold text-sm border border-white/10 transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> {isDownloading ? '...' : 'Download'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="flex-1 h-12 bg-cyan-900/40 hover:bg-cyan-900/50 text-cyan-400 rounded-xl font-bold text-sm border border-cyan-500/20 transition-all flex items-center justify-center gap-2 font-mono">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button onClick={onClose} className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl border border-white/5 transition-all flex items-center justify-center">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* The Card */}
                <div
                    ref={cardRef}
                    className="relative w-[360px] h-[600px] rounded-[48px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] bg-[#020617]"
                >
                    {/* Dark Premium Background with Noise */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

                    <CircuitLines />

                    {/* Glossy Reflections */}
                    <div className="absolute top-0 inset-x-0 h-[120px] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />
                    <div className="absolute -inset-x-[100%] top-0 h-[300px] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent rotate-45 pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col p-8 pt-10">
                        {/* Top Identification */}
                        <div className="flex justify-between items-center mb-12">
                            <div className="w-16 h-16 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm flex items-center justify-center">
                                <img src={smkLogo} alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                            </div>
                            <div className="text-[44px] font-black italic text-white/90 tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-none -mr-1">
                                {currentYear}
                            </div>
                        </div>

                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group">
                                {/* Neon Bloom Rings */}
                                <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10 blur-[3px]" />
                                <div className="absolute inset-[-6px] rounded-full border-2 border-cyan-400/80 shadow-[0_0_45px_rgba(34,211,238,0.5),inset_0_0_20px_rgba(34,211,238,0.3)] animate-[pulse_3s_ease-in-out_infinite]" />

                                {/* Sharp Inner Ring */}
                                <div className="absolute inset-[0px] rounded-full border-[1.5px] border-cyan-300 z-10 opacity-60" />

                                <div className="w-44 h-44 rounded-full bg-[#0a0f1e] border-2 border-slate-700/50 flex items-center justify-center overflow-hidden relative shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)]">
                                    {student.photo_url || student.avatar_url ? (
                                        <img src={student.photo_url || student.avatar_url} alt={student.nama} className="w-full h-full object-cover grayscale-[0.2]" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-700 text-white">
                                            <span className="text-6xl font-black tracking-tighter drop-shadow-lg">{getInitials(student.nama)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student Identity */}
                        <div className="text-center space-y-1 z-20">
                            <h2 className="text-[38px] font-black text-white leading-none tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                                {student.nama}
                            </h2>
                            <p className="text-[13px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-80">
                                {jurusanName || 'Teknik'}
                            </p>
                        </div>

                        {/* Achievement Badge */}
                        <div className="flex-1 flex flex-col items-center justify-center -mt-4">
                            <GoldMedal level={student.level_name} />
                        </div>

                        {/* Metrics Section */}
                        <div className="mt-auto flex flex-col items-center gap-8 pb-4">
                            {/* Centered Score */}
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[82px] font-black text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] leading-none">{student.skor ?? 0}</span>
                                    <span className="text-2xl font-black text-slate-500 italic">/100</span>
                                </div>

                                {/* High-Contrast Progress Bar */}
                                <div className="w-[240px] h-3 bg-black/60 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.7)]"
                                        style={{ width: `${scoreProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Verification Footer */}
                            <div className="w-full relative flex items-center justify-center h-12">
                                <div className="absolute left-0 bottom-0">
                                    {qrCode && (
                                        <div className="p-1 px-1.5 bg-white/5 backdrop-blur-3xl rounded-xl border border-white/10 shadow-2xl">
                                            <img src={qrCode} alt="QR" className="w-11 h-11 invert opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-slate-500 text-[10px] font-black tracking-[0.5em] uppercase text-center block mb-0.5">
                                        VERIFIED SKILL PASSPORT
                                    </span>
                                    <span className="text-slate-700 text-[9px] font-bold tracking-[0.3em] font-mono">
                                        {student.id?.slice(0, 12).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Light-Catcher Borders */}
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-[1.5px] border-white/5" />
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-t border-white/15" />
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
