import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface AvatarSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (avatarUrl: string) => void;
    currentAvatar?: string;
}

const AVATAR_CATEGORIES = [
    {
        id: 'techie',
        label: 'Techie',
        icon: 'Cpu',
        seeds: ['Felix', 'Casper', 'Midnight', 'Bear', 'Ziggy', 'Kobe'],
        description: 'Mekanik & Ahli Teknologi'
    },
    {
        id: 'professional',
        label: 'Professional',
        icon: 'Briefcase',
        seeds: ['Vivian', 'Oliver', 'Willow', 'Leo', 'Piper'],
        description: 'Bisnis & Perhotelan'
    },
    {
        id: 'creator',
        label: 'Creator',
        icon: 'Palette',
        seeds: ['Aneka', 'Luna', 'Sasha', 'Milo', 'Shadow'],
        description: 'Pemikir Kreatif & Inovatif'
    }
];

export const AvatarSelectionModal: React.FC<AvatarSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    currentAvatar,
}) => {
    const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState(AVATAR_CATEGORIES[0].id);
    const [photoUrl, setPhotoUrl] = useState(currentAvatar || '');
    const [mode, setMode] = useState<'avatar' | 'photo'>('avatar');

    const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    if (!isOpen) return null;

    const filteredCategory = AVATAR_CATEGORIES.find(c => c.id === activeCategory);

    const handleSave = () => {
        if (mode === 'avatar' && selectedSeed) {
            onSelect(getAvatarUrl(selectedSeed));
        } else if (mode === 'photo' && photoUrl) {
            onSelect(photoUrl);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Icons.UserCircle className="w-5 h-5 text-indigo-400" />
                            Update Foto Profil
                        </h3>
                        <p className="text-xs text-white/40 mt-1">Gunakan identitas nyata untuk pengalaman lebih profesional</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Primary Tabs: Avatar vs Photo */}
                <div className="flex px-6 pt-6 gap-4">
                    <button
                        onClick={() => setMode('avatar')}
                        className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${mode === 'avatar'
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                            }`}
                    >
                        <Icons.User className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">Pilih Avatar</span>
                    </button>
                    <button
                        onClick={() => setMode('photo')}
                        className={`flex-1 py-3 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${mode === 'photo'
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400'
                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                            }`}
                    >
                        <Icons.Camera className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-wider">Gunakan Foto Asli</span>
                    </button>
                </div>

                <div className="p-6">
                    {mode === 'avatar' ? (
                        <>
                            {/* Categories Tabs */}
                            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
                                {AVATAR_CATEGORIES.map((cat) => {
                                    const Icon = (Icons as any)[cat.icon] || Icons.User;
                                    const isActive = activeCategory === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredCategory?.seeds.map((seed) => {
                                    const url = getAvatarUrl(seed);
                                    const isSelected = selectedSeed === seed || (currentAvatar === url && mode === 'avatar');

                                    return (
                                        <button
                                            key={seed}
                                            onClick={() => setSelectedSeed(seed)}
                                            className={`relative group aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? 'ring-4 ring-indigo-500 scale-95' : 'hover:bg-white/5 hover:scale-105'
                                                }`}
                                        >
                                            <img src={url} alt={seed} className="w-full h-full object-cover" />
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                                                    <div className="bg-indigo-500 text-white rounded-full p-1 shadow-lg">
                                                        <Icons.Check className="w-4 h-4 font-black" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-white/5 border-4 border-indigo-500/20 flex items-center justify-center shadow-2xl">
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <Icons.ImagePlus className="w-12 h-12 text-white/20" />
                                    )}
                                </div>
                                <p className="text-xs text-white/40 text-center max-w-xs">
                                    Masukkan URL foto dari Supabase Gallery atau tempel link foto profil lainnya.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Photo URL</label>
                                <div className="relative">
                                    <Icons.Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="text"
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                        placeholder="https://supabase.co/storage/v1/object/public/student-photos/..."
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
                                <Icons.AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                                <p className="text-[11px] text-amber-200/70 leading-relaxed">
                                    **Penting:** Selalu kompres foto sebelum diunggah (max 500KB) untuk menghemat kuota penyimpanan gratis Supabase kamu.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-slate-900/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 px-4 rounded-2xl font-bold text-white/70 hover:bg-white/5 transition-all text-sm"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={(mode === 'avatar' && !selectedSeed) || (mode === 'photo' && !photoUrl)}
                        className="flex-2 py-4 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95 text-sm"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
