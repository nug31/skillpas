import React from 'react';
import { PASSPORT_COLORS, PAGE_TEXTURE } from './PassportStyles';
import { Fingerprint, Globe, Stamp } from 'lucide-react'; // ShieldCheck, Plane, Cpu removed
import type { SiswaWithSkill, CompetencyHistory, LevelSkill } from '../../types';
import smkLogo from '../../assets/smk-logo.png';

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
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <Globe size={200} />
            </div>

            {/* Page Number */}
            {pageNumber && (
                <div className="absolute bottom-4 w-full text-center text-xs text-slate-400 font-mono">
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
                        src={smkLogo}
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
            <div className="p-5 flex flex-col h-full font-mono text-sm">
                <div className="flex items-center gap-2 mb-2 border-b-2 border-slate-800 pb-1">
                    <h2 className="font-bold text-lg uppercase tracking-wider text-slate-800">Identitas Pemilik</h2>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-24 h-32 sm:w-32 sm:h-40 bg-slate-200 border border-slate-300 relative overflow-hidden flex-shrink-0 grayscale contrast-125 mx-auto sm:mx-0">
                        {siswa.photo_url || siswa.avatar_url ? (
                            <img
                                src={siswa.photo_url || siswa.avatar_url}
                                alt={siswa.nama}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <span className="text-[10px]">FOTO</span>
                            </div>
                        )}
                        {/* Stamp overlay */}
                        <div className="absolute -bottom-4 -right-4 text-blue-900/40 rotate-[-30deg] border-4 border-double border-blue-900/40 rounded-full p-2 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                            <span className="font-black text-[7px] sm:text-[8px] uppercase text-center">Resmi Terdaftar</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-1 sm:space-y-1.5">
                        <div>
                            <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Nama Lengkap / Full Name</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 font-serif text-sm sm:text-lg leading-tight uppercase">
                                {siswa.nama}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Nomor Induk / ID Number</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                {siswa.nisn || '---'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Jurusan / Major</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 leading-tight mb-1 text-xs sm:text-sm">
                                {jurusanName}
                            </span>
                        </div>
                        <div>
                            <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Wali Kelas / Homeroom Teacher</span>
                            <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 leading-tight mb-1 text-xs sm:text-sm">
                                {walasName}
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Kelas / Class</span>
                                <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                    {siswa.kelas}
                                </span>
                            </div>
                            <div className="flex-1">
                                <span className="block text-[9px] sm:text-[10px] text-slate-500 uppercase">Level</span>
                                <span className="block font-bold text-slate-900 border-b border-dotted border-slate-400 text-xs sm:text-sm">
                                    {siswa.current_level?.nama_level || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto mb-0">
                    <span className="block text-[9px] text-slate-500 uppercase">Tanda Tangan Pemilik / Signature</span>
                    <div className="h-10 border-b border-slate-800 flex items-end pb-1 font-handwriting text-2xl text-slate-600 rotate-[-2deg]">
                        {siswa.nama}
                    </div>
                </div>

                <div className="text-[9px] text-center text-slate-400 leading-tight">
                    <p>Paspor ini adalah dokumen resmi riwayat kompetensi siswa.</p>
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
