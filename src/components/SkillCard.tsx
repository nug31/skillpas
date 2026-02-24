import { useRef, useState, useEffect } from 'react';
import { Download, Share2, X } from 'lucide-react';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import type { StudentListItem, LevelSkill } from '../types';

interface SkillCardProps {
    student: StudentListItem;
    levels: LevelSkill[];
    jurusanName?: string;
    onClose: () => void;
}

async function generateQRCode(text: string): Promise<string> {
    try {
        if (!text) return '';
        return await QRCode.toDataURL(text, {
            width: 220,
            margin: 1,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'M'
        });
    } catch (err) {
        console.error('QR Error:', err);
        return '';
    }
}

const CircuitLines = () => (
    <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 360 600">
        <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Horizontal Traces - Left Side */}
        <g stroke="url(#lineGrad)" strokeWidth="1.5" fill="none">
            <path d="M 0 180 H 60 L 80 200 H 120" />
            <path d="M 0 220 H 50 L 70 240 H 110" />
            <path d="M 0 260 H 40 L 60 280 H 100" />
            <path d="M 0 300 H 50 L 70 320 H 110" />
        </g>

        {/* Horizontal Traces - Right Side */}
        <g stroke="url(#lineGrad)" strokeWidth="1.5" fill="none">
            <path d="M 360 180 H 300 L 280 200 H 240" />
            <path d="M 360 220 H 310 L 290 240 H 250" />
            <path d="M 360 260 H 320 L 300 280 H 260" />
            <path d="M 360 300 H 310 L 290 320 H 250" />
        </g>

        {/* Purple Accents */}
        <g stroke="url(#purpleGrad)" strokeWidth="1" fill="none">
            <path d="M 0 400 H 100 L 120 420 H 360" />
            <path d="M 360 100 H 260 L 240 80 H 0" />
        </g>
    </svg>
);

const GoldMedal = ({ level }: { level: string }) => (
    <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind medal */}
        <div className="absolute w-24 h-24 bg-yellow-400 blur-[30px] opacity-40 animate-pulse" />

        <div className="relative w-28 h-28 flex items-center justify-center z-10">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                <defs>
                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE68A" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                </defs>

                {/* Ribbon behind */}
                <path d="M25 40 L35 75 L50 65 L65 75 L75 40" fill="#92400e" stroke="#78350f" strokeWidth="1" />

                {/* Medal Body */}
                <circle cx="50" cy="50" r="38" fill="url(#gold-grad)" stroke="#78350f" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1" />

                {/* Scalloped edge */}
                {[...Array(24)].map((_, i) => (
                    <circle key={i} cx={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)} cy={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)} r="2" fill="#FDE68A" />
                ))}

                {/* Banner Ribbon */}
                <path d="M20 70 H80 V85 H20 Z" fill="#78350f" className="hidden" />

                {/* Inner Star */}
                <path
                    d="M50 30 L56 42 H70 L59 50 L63 64 L50 55 L37 64 L41 50 L30 42 H44 Z"
                    fill="white"
                    fillOpacity="0.8"
                    className="drop-shadow-md"
                />
            </svg>

            {/* Banner Text Overlay */}
            <div className="absolute top-[68px] bg-gradient-to-r from-[#78350f] via-[#b45309] to-[#78350f] px-4 py-0.5 rounded shadow-lg border border-yellow-200/20 transform -skew-x-12">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block transform skew-x-12">
                    {level || 'MASTERY'}
                </span>
            </div>
        </div>
    </div>
);

export const SkillCard = ({ student, jurusanName, onClose }: Omit<SkillCardProps, 'levels'>) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const origin = window.location.origin;
        const url = `${origin}?verify=${student.id}`;
        generateQRCode(url).then(setQrCode);
    }, [student.id]);

    const currentYear = 2026;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl [.theme-clear_&]:bg-white/90">
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[360px]">
                {/* Actions */}
                <div className="flex items-center gap-3 w-full justify-center no-canvas-hide">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 h-12 bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 [.theme-clear_&]:bg-slate-800 [.theme-clear_&]:text-white [.theme-clear_&]:border-slate-700 [.theme-clear_&]:hover:bg-slate-700">
                        <Download className="w-4 h-4" /> {isDownloading ? '...' : 'Download'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="flex-1 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 [.theme-clear_&]:bg-cyan-600 [.theme-clear_&]:text-white [.theme-clear_&]:border-cyan-500 [.theme-clear_&]:hover:bg-cyan-700">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button onClick={onClose} className="w-12 h-12 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:text-white transition-all flex items-center justify-center [.theme-clear_&]:bg-slate-200 [.theme-clear_&]:text-slate-700 [.theme-clear_&]:border-slate-300 [.theme-clear_&]:hover:bg-slate-300 [.theme-clear_&]:hover:text-slate-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Card Container - The "Glass" */}
                <div
                    ref={cardRef}
                    className="relative w-[360px] h-[600px] rounded-[48px] overflow-hidden shadow-2xl bg-[#0a0f1e] border border-white/10 [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200"
                >
                    {/* Deep Background with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#020617] to-[#0a0f1e] [.theme-clear_&]:bg-gradient-to-br [.theme-clear_&]:from-slate-50 [.theme-clear_&]:via-white [.theme-clear_&]:to-slate-100" />

                    {/* Circuit Lines Background */}
                    <CircuitLines />

                    {/* Reflection / Shine Sweep */}
                    <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none skew-y-[-15deg] transform -translate-y-[50px]" />

                    <div className="relative z-10 h-full flex flex-col p-5">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-2">
                            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] logo-gold" />
                            <div className="text-[14px] font-black text-white/90 [.theme-clear_&]:text-slate-800 tracking-tighter leading-none pt-2 opacity-80">
                                {currentYear}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow flex flex-col items-center">
                            {/* Avatar with Thick Neon Ring */}
                            <div className="relative mb-2 scale-90">
                                {/* Glow layers */}
                                <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10 blur-[4px]" />
                                <div className="absolute inset-[-6px] rounded-full border-[6px] border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.6)]" />

                                <div className="w-28 h-28 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden relative">
                                    {student.photo_url || student.avatar_url ? (
                                        <img src={student.photo_url || student.avatar_url} alt={student.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-3xl font-black italic">
                                            {getInitials(student.nama)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Major */}
                            <div className="text-center space-y-1 z-20 px-2 w-full">
                                <h2 className={`font-black text-white [.theme-clear_&]:text-slate-900 leading-none tracking-tight drop-shadow-lg uppercase ${student.nama.length > 20 ? 'text-[20px]' : 'text-[24px]'
                                    }`}>
                                    {student.nama}
                                </h2>
                                <p className="text-[10px] font-bold text-slate-400 [.theme-clear_&]:text-slate-500 uppercase tracking-[0.25em] opacity-80">
                                    {jurusanName || 'Teknik'}
                                </p>
                            </div>

                            {/* Medal */}
                            <div className="mt-1 transform scale-75">
                                <GoldMedal level={student.level_name} />
                            </div>
                        </div>

                        {/* QR Code Section - Now in Center */}
                        <div className="flex-grow flex flex-col items-center justify-center -mt-6 mb-2">
                            {qrCode ? (
                                <div className="p-2 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.4)] border-4 border-cyan-500/20 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <img src={qrCode} alt="QR" className="w-32 h-32 block grayscale-0" />
                                </div>
                            ) : (
                                <div className="w-32 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin" />
                                </div>
                            )}
                            <p className="mt-2 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] opacity-80 animate-pulse">
                                Scan to Verify
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-slate-500 [.theme-clear_&]:text-slate-400 text-[9px] font-black tracking-[0.2em] uppercase block">TECHNICAL PASSPORT</span>
                                <span className="text-slate-700 [.theme-clear_&]:text-slate-500 text-[8px] font-mono font-bold opacity-60">ID: {student.id?.slice(0, 10).toUpperCase()}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-emerald-500 [.theme-clear_&]:text-emerald-600 text-[10px] font-black tracking-[0.1em] uppercase block">VERIFIED PASS</span>
                                <span className="text-slate-600 text-[7px] font-bold opacity-40">SMK MI MM2100</span>
                            </div>
                        </div>
                    </div>

                    {/* Inner Bevel Detail */}
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-[1.5px] border-white/5" />
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-t border-white/15" />
                </div>
            </div>
        </div >
    );
};

export default SkillCard;
