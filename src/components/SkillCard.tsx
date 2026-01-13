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
        <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Medal Bloom */}
            <div className="absolute inset-0 bg-yellow-400 blur-[35px] opacity-20 animate-pulse" />

            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
                <defs>
                    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBDF7E" />
                        <stop offset="25%" stopColor="#FDE68A" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="75%" stopColor="#B45309" />
                        <stop offset="100%" stopColor="#78350F" />
                    </linearGradient>
                    <filter id="shine">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Ribbon behind */}
                <path d="M20 40 L35 70 L50 60 L65 70 L80 40" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

                {/* Medal Body */}
                <circle cx="50" cy="50" r="38" fill="url(#gold)" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="33" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

                {/* Scalloped edge effect */}
                {[...Array(24)].map((_, i) => (
                    <circle key={i} cx={50 + 38 * Math.cos((i * 15 * Math.PI) / 180)} cy={50 + 38 * Math.sin((i * 15 * Math.PI) / 180)} r="2" fill="url(#gold)" />
                ))}

                {/* Star Icon */}
                <path
                    d="M50 28 L56.5 41 H71 L59.5 50 L64 63 L50 55 L36 63 L40.5 50 L29 41 H43.5 Z"
                    fill="rgba(255,255,255,0.7)"
                    filter="url(#shine)"
                />
            </svg>

            {/* Banner with text */}
            <div className="absolute top-[65px] flex flex-col items-center">
                <div className="bg-[#B45309] px-4 py-0.5 rounded-sm shadow-lg border border-[#78350F] transform -skew-x-12">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider block transform skew-x-12">
                        {level || 'MASTERY'}
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const CircuitLines = () => (
    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 360 600">
        <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4">
                <circle cx="5" cy="5" r="3" fill="#22d3ee" />
            </marker>
        </defs>

        {/* Horizontal & Vertical PCB Lines */}
        <g stroke="url(#lineGrad)" strokeWidth="1" fill="none">
            <path d="M 0 150 H 120 V 250 H 360" />
            <path d="M 360 180 H 240 V 300 H 0" />
            <path d="M 0 450 H 150 V 350 H 360" />

            {/* Pulsing traces around avatar */}
            <circle cx="180" cy="300" r="140" strokeOpacity="0.1" />
            <circle cx="180" cy="300" r="160" strokeOpacity="0.05" />

            {/* Angled Traces */}
            <path d="M 50 0 L 120 100 H 200" opacity="0.5" />
            <path d="M 310 600 L 240 500 H 100" opacity="0.5" />
        </g>

        {/* Circuit Nodes */}
        <g fill="#22d3ee" opacity="0.6">
            <circle cx="120" cy="150" r="2" />
            <circle cx="240" cy="180" r="2" />
            <circle cx="150" cy="450" r="2" />
            <circle cx="120" cy="250" r="2" />
            <circle cx="240" cy="300" r="2" />
        </g>
    </svg>
);

export const SkillCard = ({ student, jurusanName, onClose }: Omit<SkillCardProps, 'levels'>) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [qrCode, setQrCode] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        const url = `${window.location.origin}/verify/${student.id}`;
        generateQRCode(url).then(setQrCode);
    }, [student.id]);

    const currentYear = new Date().getFullYear();
    const scoreProgress = Math.min(Math.max((student.skor || 0) / 100 * 100, 0), 100);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 3,
                useCORS: true,
                logging: false,
                windowWidth: 360,
                windowHeight: 600,
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
        return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl overflow-y-auto">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative z-10 flex flex-col items-center gap-6 my-auto w-full max-w-[360px]">
                {/* Actions */}
                <div className="flex items-center gap-3 no-canvas-hide w-full justify-center">
                    <button onClick={handleDownload} disabled={isDownloading} className="flex-1 px-4 py-2.5 bg-white/15 text-white rounded-xl font-bold text-sm border border-white/10 hover:bg-white/25 transition-all outline-none">
                        <Download className="w-4 h-4 mr-2 inline" /> {isDownloading ? 'Downloading' : 'Download'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="flex-1 px-4 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl font-bold text-sm border border-cyan-500/20 hover:bg-cyan-500/30 transition-all outline-none">
                        <Share2 className="w-4 h-4 mr-2 inline" /> Share
                    </button>
                    <button onClick={onClose} className="p-2.5 bg-white/5 text-white/50 rounded-xl border border-white/5 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Card Container */}
                <div
                    ref={cardRef}
                    className="relative w-[360px] h-[600px] rounded-[42px] overflow-hidden shadow-2xl bg-[#020617] border border-white/10"
                >
                    {/* Background Detail */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0f172a] to-[#020617]" />
                    <CircuitLines />

                    {/* Top Shine */}
                    <div className="absolute top-0 inset-x-0 h-[80px] bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col p-8">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <img src={smkLogo} alt="Logo" className="w-14 h-14 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                            <div className="text-4xl font-black text-white/90 tracking-tighter drop-shadow-lg">{currentYear}</div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-grow flex flex-col items-center justify-center -mt-8">
                            {/* Avatar Neon Ring */}
                            <div className="relative flex items-center justify-center h-48 w-48 mb-8">
                                <div className="absolute inset-0 rounded-full border-[3px] border-cyan-400/20 blur-[1px]" />
                                <div className="absolute inset-[-4px] rounded-full border-[6px] border-cyan-400 opacity-80 shadow-[0_0_40px_rgba(34,211,238,0.8),inset_0_0_20px_rgba(34,211,238,0.6)]" />

                                <div className="w-36 h-36 rounded-full bg-slate-900 border-2 border-slate-700/50 flex items-center justify-center overflow-hidden relative shadow-inner">
                                    {student.photo_url || student.avatar_url ? (
                                        <img src={student.photo_url || student.avatar_url} alt={student.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-5xl font-black tracking-tighter">
                                            {getInitials(student.nama)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Name & Title */}
                            <div className="text-center space-y-1 mt-2">
                                <h2 className="text-[34px] font-black text-white leading-none tracking-tight drop-shadow-md">
                                    {student.nama}
                                </h2>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                                    {jurusanName || 'Teknik'}
                                </p>
                            </div>

                            {/* Medal */}
                            <div className="mt-8">
                                <GoldMedal level={student.level_name} />
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-auto flex flex-col items-center gap-6">
                            {/* Score Display */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl font-black text-white drop-shadow-lg leading-none">{student.skor ?? 0}</span>
                                    <span className="text-xl font-bold text-slate-500">/100</span>
                                </div>
                                <div className="w-[200px] h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        style={{ width: `${scoreProgress}%` }}
                                    />
                                </div>
                            </div>

                            {/* Bottom Label and QR */}
                            <div className="w-full relative flex items-center justify-center py-4 border-t border-white/5">
                                <div className="absolute left-0 bottom-0">
                                    {qrCode && (
                                        <div className="p-1 px-1 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl">
                                            <img src={qrCode} alt="QR" className="w-10 h-10 invert opacity-80" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-slate-600 text-[9px] font-bold tracking-[0.4em] uppercase">
                                    VERIFIED SKILL PASSPORT • {student.id?.slice(0, 8).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Final Glass Overlay */}
                    <div className="absolute inset-0 pointer-events-none rounded-[42px] border border-white/[0.05]" />
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
