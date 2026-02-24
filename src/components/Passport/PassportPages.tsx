import React from 'react';
import { PASSPORT_COLORS, PAGE_TEXTURE } from './PassportStyles';
import { Fingerprint, Stamp, Image as ImageIcon, Video, CheckCircle } from 'lucide-react'; // Globe, ShieldCheck, Plane, Cpu removed
import type { SiswaWithSkill, CompetencyHistory, LevelSkill } from '../../types';


interface PageProps {
    children?: React.ReactNode;
    className?: string;
    pageNumber?: number;
}
// ... (PassportPage remains same)

export const PassportPage: React.FC<PageProps> = ({ children, className = '', pageNumber }) => {
    return (
        <div
            className={`w-full h-full ${PASSPORT_COLORS.page} relative overflow-hidden shadow-inner ${className}`}
            style={{ backgroundImage: PAGE_TEXTURE }}
        >
            {/* Watermark Pattern */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <img
                    src="/logo.png"
                    alt=""
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain grayscale contrast-50 opacity-[0.04] dark:opacity-[0.06] brightness-100 dark:brightness-200"
                />
            </div>

            {/* Page Number */}
            {pageNumber && (
                <div className="absolute bottom-2 w-full text-center text-[10px] text-slate-400 font-mono">
                    - {pageNumber} -
                </div>
            )}

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export const PassportCover: React.FC<{ schoolName?: string }> = ({ schoolName = "SMK Mitra Industri" }) => {
    return (
        <div className={`w-full h-full ${PASSPORT_COLORS.cover} flex flex-col items-center justify-between py-12 px-6 shadow-2xl border-r-4 border-black/20 text-center`}>
            <div className={`text-[#C5A059] font-serif tracking-[0.2em] font-bold text-lg uppercase opacity-80`}>
                SKILL PASSPORT
            </div>

            <div className={`text-[#C5A059] flex flex-col items-center gap-6`}>
                <div className="w-32 h-32 border-4 border-[#C5A059] rounded-full flex items-center justify-center p-4 opacity-90">
                    <img
                        src="/logo.png"
                        alt="Logo SMK"
                        className="w-full h-full object-contain drop-shadow-lg opacity-90"
                    />
                </div>
                <h1 className="font-serif font-bold text-lg tracking-[0.2em] uppercase border-y-2 border-[#C5A059] py-2 w-full opacity-80">
                    COMPETENCY<br />RECORD
                </h1>
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
                <div className={`text-[#C5A059] font-mono text-sm opacity-60 tracking-widest`}>
                    {schoolName}
                </div>
                <Fingerprint size={48} className="text-[#C5A059] opacity-30 animate-pulse" />
            </div>
        </div>
    );
};

interface IdentityPageProps {
    siswa: SiswaWithSkill;
    jurusanName: string;
    walasName?: string;
}

export const PassportIdentityPage: React.FC<IdentityPageProps> = ({ siswa, jurusanName, walasName = "Sri Wahyuni, S.Pd" }) => {
    return (
        <PassportPage pageNumber={1}>
            <div className="px-5 pt-3 pb-2 flex flex-col h-full font-mono text-sm">
                <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-800 pb-1">
                    <h2 className="font-bold text-lg uppercase tracking-wider text-slate-800">Identitas Pemilik</h2>
                </div>

                <div className="flex flex-row gap-3 mb-2 items-start">
                    <div className="w-20 h-28 bg-slate-200 border border-slate-300 relative overflow-hidden flex-shrink-0 grayscale contrast-125">
                        {siswa.photo_url || siswa.avatar_url ? (
                            <img
                                src={siswa.photo_url || siswa.avatar_url}
                                alt={siswa.nama}
                                className="w-full h-full object-cover object-top"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <span className="text-[10px]">FOTO</span>
                            </div>
                        )}
                        {/* Stamp overlay */}
                        <div className="absolute -bottom-3 -right-3 text-blue-900/40 rotate-[-30deg] border-4 border-double border-blue-900/40 rounded-full p-2 w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                            <span className="font-black text-[7px] uppercase text-center">Resmi Terdaftar</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-1">
                        <div>
                            <span className="block text-[10px] text-slate-500 uppercase leading-none">Nama Lengkap / Full Name</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 font-serif text-sm sm:text-base leading-tight uppercase">
                                {siswa.nama}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[9px] text-slate-500 uppercase leading-none">Nomor Induk / ID Number</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                {siswa.nisn || '---'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[9px] text-slate-500 uppercase leading-none">Jurusan / Major</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 leading-tight mb-0.5 text-xs sm:text-sm">
                                {jurusanName}
                            </span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="block text-[9px] text-slate-500 uppercase leading-none">Wali Kelas / Homeroom Teacher</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 leading-tight mb-0.5 text-xs sm:text-sm">
                                {walasName}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <span className="block text-[9px] text-slate-500 uppercase leading-none">Kelas / Class</span>
                                <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                    {siswa.kelas}
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="block text-[9px] text-slate-500 uppercase leading-none">Level</span>
                                <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                    {siswa.current_level?.nama_level || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sm:hidden mt-1">
                    <span className="block text-[9px] text-slate-500 uppercase leading-none">Wali Kelas / Homeroom Teacher</span>
                    <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 leading-tight text-xs">
                        {walasName}
                    </span>
                </div>

                <div className="mt-auto">
                    <span className="block text-[9px] text-slate-500 uppercase leading-none">Tanda Tangan Pemilik / Signature</span>
                    <div className="h-10 border-b border-slate-800 flex items-end pb-0.5 font-handwriting text-2xl text-slate-600 rotate-[-2deg]">
                        {siswa.nama}
                    </div>
                </div>

                <div className="text-[8px] text-center text-slate-400 mt-1 uppercase tracking-tight">
                    Paspor ini adalah dokumen resmi riwayat kompetensi siswa.
                </div>
            </div>
        </PassportPage>
    );
};

interface StampsPageProps {
    history: CompetencyHistory[];
    startIndex: number;
    itemsPerPage: number;
    pageNumber: number;
    levels: LevelSkill[];
    onStampClick: (item: CompetencyHistory) => void;
    title?: string;
}

export const PassportStampsPage: React.FC<StampsPageProps> = ({ history, startIndex, itemsPerPage, pageNumber, levels, onStampClick, title }) => {
    const pageItems = history.slice(startIndex, startIndex + itemsPerPage);

    return (
        <PassportPage pageNumber={pageNumber}>
            <div className="p-5 h-full">
                <h3 className="text-center text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest border-b border-slate-200 pb-2">
                    {title || "Visa & Validasi Kompetensi"}
                </h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 h-[350px] content-start">
                    {pageItems.map((item, idx) => {
                        const level = levels.find(l => l.id === item.level_id);
                        const isLulus = item.hasil.toLowerCase() === 'lulus';
                        const color = isLulus ? 'text-emerald-700 border-emerald-700' : 'text-red-700 border-red-700';
                        const rotate = (idx % 3 === 0 ? '-rotate-3' : idx % 3 === 1 ? 'rotate-2' : '-rotate-1');

                        return (
                            <button
                                key={item.id}
                                onClick={() => onStampClick(item)}
                                disabled={!isLulus}
                                className={`text-left aspect-[4/3] border-4 border-double ${color} p-2 rounded-lg ${rotate} opacity-90 hover:opacity-100 hover:scale-105 transition-all cursor-help relative group bg-white/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500`}
                            >
                                <div className="absolute top-1 right-1">
                                    {isLulus ? <Stamp size={16} /> : null}
                                </div>
                                <div className={`text-[8px] font-bold uppercase ${color} opacity-70`}>
                                    {item.tanggal}
                                </div>
                                <div className={`text-[10px] sm:text-xs font-black uppercase leading-tight mt-1 ${color}`}>
                                    {level?.nama_level || 'SKILL'}
                                </div>
                                <div className={`text-[9px] leading-tight mt-1 font-serif text-slate-900 line-clamp-2 ${isLulus ? '' : 'line-through'}`}>
                                    {item.unit_kompetensi}
                                </div>
                                <div className={`absolute bottom-1 right-2 text-[8px] font-mono uppercase ${color}`}>
                                    {item.penilai}
                                </div>

                                {/* Tooltip */}
                                <div className="absolute hidden group-hover:block z-50 bottom-full left-0 w-full bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl mb-1 pointer-events-none">
                                    {item.unit_kompetensi} ({item.hasil})
                                    {isLulus && <div className="mt-1 text-emerald-300">Klik untuk download sertifikat</div>}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </PassportPage>
    );
};

interface EvidencePageProps {
    photos: string[];
    videos: string[];
    pageNumber: number;
}

export const PassportEvidencePage: React.FC<EvidencePageProps> = ({ photos, videos, pageNumber }) => {
    return (
        <PassportPage pageNumber={pageNumber}>
            <div className="p-5 h-full flex flex-col">
                <h3 className="text-center text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest border-b border-slate-200 pb-2 flex items-center justify-center gap-2">
                    <Fingerprint size={14} /> Dokumen Bukti Ujian
                </h3>

                <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                    {(!photos || photos.length === 0) && (!videos || videos.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-3 opacity-60">
                            <div className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center">
                                <ImageIcon size={24} />
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-tighter">Belum Ada Bukti Dokumentasi</p>
                        </div>
                    ) : (
                        <>
                            {photos && photos.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                        <ImageIcon size={10} /> Foto Kegiatan
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {photos.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-lg border-2 border-slate-200 overflow-hidden bg-white shadow-sm -rotate-1 group hover:rotate-0 transition-all cursor-zoom-in">
                                                <img src={url} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="Bukti" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {videos && videos.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                        <Video size={10} /> Video Kegiatan
                                    </h4>
                                    <div className="space-y-2">
                                        {videos.map((url, i) => (
                                            <div key={i} className="rounded-lg border-2 border-slate-200 overflow-hidden bg-slate-900 aspect-video relative group">
                                                <video
                                                    src={url}
                                                    className="w-full h-full object-contain"
                                                    controls
                                                />
                                                <div className="absolute top-1 right-1 bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded backdrop-blur-sm opacity-60">
                                                    VIDEO #{i + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[8px] text-slate-400 italic font-mono">Verified by Skill Passport Engine</div>
                    <CheckCircle size={12} className="text-emerald-500" />
                </div>
            </div>
        </PassportPage>
    );
};
