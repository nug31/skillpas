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
            <div className="absolute inset-4 bg-yellow-500/10 blur-[40px] rounded-full animate-pulse" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] scale-125">
                <defs>
                    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBDF7E" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="100%" stopColor="#8A6624" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="45" r="38" fill="rgba(0,0,0,0.3)" />
                <circle cx="50" cy="45" r="35" fill="url(#gold)" />
                <circle cx="50" cy="45" r="32" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                <path d="M50 20 L58 36 L76 36 L62 47 L67 63 L50 53 L33 63 L38 47 L24 36 L42 36 Z" fill="rgba(255,255,255,0.6)" className="animate-pulse" />
                <path d="M10 52 L28 52 L35 44 L65 44 L72 52 L90 52 L90 68 L72 68 L65 60 L35 60 L28 68 L10 68 Z" fill="#8A6624" />
                <path d="M28 52 L72 52 L72 68 L28 68 Z" fill="url(#gold)" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
            </svg>
            <div className="absolute inset-x-0 top-[52px] flex justify-center">
                <span className="text-[11px] font-black text-amber-950 uppercase tracking-tighter">
                    {level || 'MASTERY'}
                </span>
            </div>
        </div>
    </div>
);

const getInitials = (n?: string) => {
    if (!n) return '??';
    return n.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
};

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
                backgroundColor: null, scale: 3, useCORS: true, logging: false,
                windowWidth: 360, windowHeight: 600,
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
            <div className="fixed inset-0" onClick={onClose} />
            <div className="relative z-10 flex flex-col items-center gap-8 my-auto w-full max-w-[360px]">
                {/* Fixed Control Buttons */}
                <div className="flex items-center gap-4 no-canvas-hide w-full justify-center">
                    <button onClick={handleDownload} disabled={isDownloading} className="px-6 py-3 bg-white/10 text-white rounded-2xl font-bold flex items-center gap-2 border border-white/10 transition-colors hover:bg-white/20">
                        <Download className="w-4 h-4" /> {isDownloading ? '...' : 'Unduh'}
                    </button>
                    <button onClick={handleShare} disabled={isSharing} className="px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-2xl font-bold flex items-center gap-2 border border-cyan-500/20 transition-colors hover:bg-cyan-500/30">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button onClick={onClose} className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500/20"><X className="w-6 h-6" /></button>
                </div>

                {/* Vertical Precision Card */}
                <div ref={cardRef} className="relative w-[360px] h-[600px] rounded-[50px] overflow-hidden shadow-2xl border border-white/10" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)' }}>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-10%] right-[-10%] w-[90%] h-[90%] bg-blue-600/10 blur-[130px] rounded-full" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[90%] h-[90%] bg-purple-600/10 blur-[130px] rounded-full" />
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                            <img src={smkLogo} alt="Logo" className="w-16 h-16 object-contain" />
                            <div className="text-5xl font-black text-white/90 tracking-tighter drop-shadow-2xl">{currentYear}</div>
                        </div>

                        <div className="flex-grow flex flex-col items-center justify-center gap-8">
                            <div className="relative w-44 h-44 flex items-center justify-center">
                                <div className="absolute inset-[-12px] rounded-full border border-cyan-400/10 blur-[3px]" />
                                <div className="absolute inset-[-6px] rounded-full border-2 border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,0.4)]" />
                                <div className="w-40 h-40 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden">
                                    {student.photo_url || student.avatar_url ? (
                                        <img src={student.photo_url || student.avatar_url} alt={student.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-6xl font-black">{getInitials(student.nama)}</div>
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-1">
                                <h2 className="text-4xl font-black text-white tracking-tight leading-tight px-4 break-words">{student.nama}</h2>
                                <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.2em]">{jurusanName || 'Teknik'}</p>
                            </div>

                            <GoldMedal level={student.level_name} />
                        </div>

                        <div className="mt-auto flex flex-col items-center gap-10 pb-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{student.skor ?? 0}</span>
                                    <span className="text-2xl font-bold text-slate-500">/100</span>
                                </div>
                                <div className="w-64 h-3.5 bg-slate-800/80 rounded-full p-0.5 border border-white/10 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" style={{ width: `${scoreProgress}%` }} />
                                </div>
                            </div>
                            <div className="w-full flex justify-start">
                                {qrCode && <div className="p-2.5 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10"><img src={qrCode} alt="QR" className="w-14 h-14 invert opacity-90" /></div>}
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 py-3 bg-white/5 border-t border-white/5 flex justify-center backdrop-blur-sm">
                        <span className="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase">VERIFIED SKILL PASSPORT • {student.id?.slice(0, 8).toUpperCase() || 'OFFICIAL'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkillCard;
