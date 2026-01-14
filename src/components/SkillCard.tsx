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
            color: { dark: '#000000', light: '#ffffff' },
        });
    } catch {
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

        <div className="relative w-32 h-32 flex items-center justify-center z-10">
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
        const url = `https://skillpassmitra.netlify.app/verify/${student.id}`;
        generateQRCode(url).then(setQrCode);
    }, [student.id]);

    const currentYear = 2026;
    const scoreProgress = Math.min(Math.max((student.skor || 0), 0), 100);

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl">
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-[360px]">
                {/* Actions */}
                <div className="flex items-center gap-3 w-full justify-center no-canvas-hide">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 h-12 bg-white/10 text-white rounded-xl font-bold text-sm border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> {isDownloading ? '...' : 'Download'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="flex-1 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold text-sm border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button onClick={onClose} className="w-12 h-12 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:text-white transition-all flex items-center justify-center">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Card Container - The "Glass" */}
                <div
                    ref={cardRef}
                    className="relative w-[360px] h-[600px] rounded-[48px] overflow-hidden shadow-2xl bg-[#0a0f1e] border border-white/10"
                >
                    {/* Deep Background with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#020617] to-[#0a0f1e]" />

                    {/* Circuit Lines Background */}
                    <CircuitLines />

                    {/* Reflection / Shine Sweep */}
                    <div className="absolute top-0 left-0 right-0 h-[250px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none skew-y-[-15deg] transform -translate-y-[50px]" />

                    <div className="relative z-10 h-full flex flex-col p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-8">
                            <img src={smkLogo} alt="Logo" className="w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                            <div className="text-[48px] font-black text-white/90 tracking-tighter leading-none drop-shadow-xl">
                                {currentYear}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow flex flex-col items-center">
                            {/* Avatar with Thick Neon Ring */}
                            <div className="relative mb-6">
                                {/* Glow layers */}
                                <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10 blur-[4px]" />
                                <div className="absolute inset-[-6px] rounded-full border-[6px] border-cyan-400 shadow-[0_0_50px_rgba(34,211,238,0.6)]" />

                                <div className="w-44 h-44 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center overflow-hidden relative">
                                    {student.photo_url || student.avatar_url ? (
                                        <img src={student.photo_url || student.avatar_url} alt={student.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-6xl font-black italic">
                                            {getInitials(student.nama)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Major */}
                            <div className="text-center space-y-1 z-20">
                                <h2 className="text-[36px] font-black text-white leading-none tracking-tight drop-shadow-lg uppercase">
                                    {student.nama}
                                </h2>
                                <p className="text-[14px] font-bold text-slate-400 uppercase tracking-[0.25em] opacity-80">
                                    {jurusanName || 'Teknik'}
                                </p>
                            </div>

                            {/* Medal */}
                            <div className="mt-4">
                                <GoldMedal level={student.level_name} />
                            </div>
                        </div>

                        {/* Metrics Section */}
                        <div className="mt-auto flex flex-col items-center gap-6 pb-2">
                            {/* Score Display */}
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[72px] font-black text-white drop-shadow-2xl leading-none">{student.skor ?? 0}</span>
                                    <span className="text-2xl font-black text-slate-500 italic">/100</span>
                                </div>

                                {/* Vibrant Progress Bar */}
                                <div className="w-[200px] h-2.5 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                        style={{ width: `${scoreProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Footer / QR */}
                            <div className="w-full flex items-center justify-between mt-4">
                                <div className="flex flex-col">
                                    {qrCode && (
                                        <div className="p-1 bg-white rounded-lg shadow-xl">
                                            <img src={qrCode} alt="QR" className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase block">VERIFIED PASS</span>
                                    <span className="text-slate-700 text-[9px] font-mono font-bold">{student.id?.slice(0, 10).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inner Bevel Detail */}
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-[1.5px] border-white/5" />
                    <div className="absolute inset-0 pointer-events-none rounded-[48px] border-t border-white/15" />
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
