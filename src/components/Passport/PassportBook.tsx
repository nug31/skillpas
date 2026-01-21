import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PassportCover, PassportIdentityPage, PassportStampsPage, PassportPage } from './PassportPages';
import { PASSPORT_DIMENSIONS } from './PassportStyles';
import type { SiswaWithSkill, LevelSkill, CompetencyHistory } from '../../types';
import { generateCertificate } from '../../lib/certificateGenerator';

interface PassportBookProps {
    siswa: SiswaWithSkill;
    jurusanName: string;
    levels: LevelSkill[];
    onClose: () => void;
    hodName?: string;
    walasName?: string;
}

export const PassportBook: React.FC<PassportBookProps> = ({ siswa, jurusanName, levels, onClose, hodName, walasName }) => {
    // Current page index (0 = Cover). Always even numbers for "spread" logic if we were doing true 3D
    // But for simplicity on screen, we'll view one "Spread" (2 pages) or Cover (1 page) at a time?
    // Actually, a nice flip effect usually shows the right page becoming the left page.
    // Let's stick to a simpler model: An array of "Page Content" components.
    // We treat index 0 as Front Cover.
    // Index 1 = Inside Front (Empty/Intro), Index 2 = Identity (Right side of first spread usually?)
    // Real passport: 
    // - Cover (Face)
    // - Inside Cover (Page 1 - often notes) | Page 2 (Identity)
    // - Page 3 (Stamps) | Page 4 (Stamps)

    // We'll generate an array of React Nodes.
    const history = siswa.riwayat_kompetensi || [];
    const stampsPerPage = 6;
    const [selectedCompetency, setSelectedCompetency] = useState<CompetencyHistory | null>(null);

    const handleStampClick = (item: CompetencyHistory) => {
        // Open detail modal instead of directly downloading
        setSelectedCompetency(item);
    };

    const handleDownloadCertificate = () => {
        if (!selectedCompetency) return;
        const lvl = levels.find(l => l.id === selectedCompetency.level_id);
        const isLulus = selectedCompetency.hasil.toLowerCase() === 'lulus';
        if (isLulus) {
            generateCertificate({
                studentName: siswa.nama,
                nisn: siswa.nisn || '-',
                kelas: siswa.kelas,
                jurusan: jurusanName,
                unitKompetensi: selectedCompetency.unit_kompetensi,
                level: lvl?.nama_level || 'Advanced',
                tanggal: selectedCompetency.tanggal,
                penilai: selectedCompetency.penilai,
                hodName: hodName
            });
        }
        setSelectedCompetency(null); // Close modal after download
    };

    // Construct pages array
    const pages: React.ReactNode[] = [
        <PassportCover key="cover" schoolName="SMK Mitra Industri" />, // 0
        <PassportPage key="inside-cover" pageNumber={0}><div className="flex items-center justify-center h-full text-xs text-slate-300 italic p-8 text-center">Dokumen resmi sekolah. Harap dijaga dengan baik.</div></PassportPage>, // 1 (Left)
        <PassportIdentityPage key="identity" siswa={siswa} jurusanName={jurusanName} walasName={walasName} />, // 2 (Right)
    ];

    // Add Stamp Pages
    // Add Stamp Pages grouped by Level
    // Ensure levels are sorted (lowest to highest)
    const sortedLevels = [...levels].sort((a, b) => a.min_skor - b.min_skor);

    sortedLevels.forEach(level => {
        const levelHistory = history.filter(h => h.level_id === level.id);

        // Calculate pages needed for this level (at least 1 page if there are items, 
        // OR optionally show 1 empty page per level to encourage progress?)
        // Let's show at least 1 page per level even if empty, so students see what's next.
        const levelPages = Math.max(1, Math.ceil(levelHistory.length / stampsPerPage));

        for (let i = 0; i < levelPages; i++) {
            pages.push(
                <PassportStampsPage
                    key={`stamps-${level.id}-${i}`}
                    history={levelHistory}
                    startIndex={i * stampsPerPage}
                    itemsPerPage={stampsPerPage}
                    pageNumber={pages.length + 1}
                    levels={levels}
                    onStampClick={handleStampClick}
                    title={level.nama_level?.toUpperCase()}
                />
            );
        }
    });

    // Ensure even number of pages for back cover
    if (pages.length % 2 === 0) {
        pages.push(<PassportPage key="empty-end" pageNumber={pages.length} />);
    }

    pages.push(<div key="back-cover" className={`w-full h-full bg-[#1a472a] shadow-inner flex items-center justify-center text-[#C5A059]/50 font-serif`}>SMK Mitra Industri</div>);

    const [spreadIndex, setSpreadIndex] = useState(0);
    // 0: Cover (Right side is Cover, Left is nothing/hidden)
    // 1: Left=Page1, Right=Page2
    // 2: Left=Page3, Right=Page4
    // etc.

    const totalSpreads = Math.ceil(pages.length / 2); // roughly

    const nextSpread = () => {
        if (spreadIndex < totalSpreads) setSpreadIndex(p => p + 1);
    };

    const prevSpread = () => {
        if (spreadIndex > 0) setSpreadIndex(p => p - 1);
    };

    // Get content for current spread
    // Spread 0: Left=null, Right=Page[0]
    // Spread 1: Left=Page[1], Right=Page[2]
    // Spread 2: Left=Page[3], Right=Page[4]

    const leftPageIndex = spreadIndex === 0 ? -1 : (spreadIndex * 2) - 1;
    const rightPageIndex = spreadIndex === 0 ? 0 : (spreadIndex * 2);

    const leftPage = leftPageIndex >= 0 && leftPageIndex < pages.length ? pages[leftPageIndex] : null;
    const rightPage = rightPageIndex < pages.length ? pages[rightPageIndex] : null;

    // Helper for rich text rendering (**bold** and \n)
    const renderRichText = (text: string) => {
        if (!text) return null;

        // Handle JSON array or single string
        let processedText = text;
        try {
            if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
                const parsed = JSON.parse(text);
                processedText = Array.isArray(parsed) ? parsed.join('\n') : text;
            }
        } catch (e) {
            // Not JSON or parse error, use original
        }

        const segments = processedText.split(/(\*\*.*?\*\*)/g);
        return segments.map((segment, index) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
                return <strong key={index} className="font-bold text-slate-900">{segment.slice(2, -2)}</strong>;
            }
            return segment.split('\n').map((line, i) => (
                <span key={`${index}-${i}`}>
                    {i > 0 && <br />}
                    {line}
                </span>
            ));
        });
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 perspective-[2000px]">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[130]"
            >
                <X />
            </button>


            {/* Navigation Controls */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-12 pointer-events-none max-w-6xl mx-auto z-[125]">
                <button
                    onClick={prevSpread}
                    disabled={spreadIndex === 0}
                    className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 transition-all backdrop-blur-md"
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={nextSpread}
                    disabled={spreadIndex === totalSpreads} // Allow closing to back?
                    className="pointer-events-auto p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-0 transition-all backdrop-blur-md"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Book Container */}
            <motion.div
                className="relative flex items-center justify-center shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    height: PASSPORT_DIMENSIONS.height,
                    width: spreadIndex === 0 ? PASSPORT_DIMENSIONS.width : PASSPORT_DIMENSIONS.width * 2 // Cover is single width, open is double
                }}
            >
                {/* Book Spine (Visual only when open) */}
                {spreadIndex > 0 && spreadIndex < totalSpreads && (
                    <div className="absolute left-1/2 top-0 bottom-0 w-4 -ml-2 bg-gradient-to-r from-black/20 via-black/10 to-black/20 z-20 rounded-sm" />
                )}

                {/* Left Page (Only if not closed cover) */}
                <AnimatePresence mode='popLayout' custom={-1}>
                    {spreadIndex > 0 && (
                        <motion.div
                            key={`spread-${spreadIndex}-left`}
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute right-1/2 top-0 bottom-0 origin-right backface-hidden"
                            style={{ width: PASSPORT_DIMENSIONS.width }}
                        >
                            <div className="w-full h-full rounded-l-lg overflow-hidden shadow-xl border-y border-l border-white/10 bg-[#fdfaf5]">
                                {leftPage}
                                {/* Page Curl shadow */}
                                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Right Page */}
                <AnimatePresence mode='popLayout' custom={1}>
                    {rightPage && (
                        <motion.div
                            key={`spread-${spreadIndex}-right`}
                            initial={{ rotateY: 90, opacity: 0 }} // If coming from cover (index 0), different anim?
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 90, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className={`absolute ${spreadIndex === 0 ? 'left-0' : 'left-1/2'} top-0 bottom-0 origin-left backface-hidden`}
                            style={{ width: PASSPORT_DIMENSIONS.width }}
                        >
                            <div className={`w-full h-full ${spreadIndex === 0 ? 'rounded-r-xl rounded-l-xl' : 'rounded-r-lg'} overflow-hidden shadow-xl border-y border-r border-white/10 bg-[#fdfaf5]`}>
                                {rightPage}
                                {/* Page Curl shadow */}
                                {spreadIndex > 0 && (
                                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Help Text */}
            <div className="absolute bottom-8 text-white/50 text-sm font-medium animate-pulse">
                {spreadIndex === 0 ? "Click arrow to open passport" : "Flip pages to view history"}
            </div>

            {/* Competency Detail Modal */}
            <AnimatePresence>
                {selectedCompetency && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 rounded-xl"
                        onClick={() => setSelectedCompetency(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-lg shadow-2xl w-80 max-w-[90%] p-6 text-slate-800 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCompetency(null)}
                                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-lg font-bold text-emerald-700 mb-4 border-b pb-2">
                                Detail Kompetensi
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase">Unit Kompetensi</span>
                                    <span className="font-medium leading-relaxed">
                                        {renderRichText(selectedCompetency.unit_kompetensi)}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase">Level</span>
                                    <span className="font-medium">
                                        {levels.find(l => l.id === selectedCompetency.level_id)?.nama_level || '-'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase">Aktivitas Pembuktian</span>
                                    <span className="font-medium">{selectedCompetency.aktivitas_pembuktian || '-'}</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <span className="block text-xs text-slate-400 uppercase">Tanggal</span>
                                        <span className="font-medium">{selectedCompetency.tanggal}</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="block text-xs text-slate-400 uppercase">Hasil</span>
                                        <span className={`font-bold ${selectedCompetency.hasil.toLowerCase() === 'lulus' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {selectedCompetency.hasil}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs text-slate-400 uppercase">Penilai</span>
                                    <span className="font-medium">{selectedCompetency.penilai}</span>
                                </div>
                                {selectedCompetency.catatan && (
                                    <div>
                                        <span className="block text-xs text-slate-400 uppercase">Catatan</span>
                                        <span className="font-medium italic">{selectedCompetency.catatan}</span>
                                    </div>
                                )}
                            </div>
                            {selectedCompetency.hasil.toLowerCase() === 'lulus' && (
                                <button
                                    onClick={handleDownloadCertificate}
                                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
                                >
                                    Download Sertifikat
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
