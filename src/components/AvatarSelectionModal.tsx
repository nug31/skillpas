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

    const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;

    if (!isOpen) return null;

    const filteredCategory = AVATAR_CATEGORIES.find(c => c.id === activeCategory);

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
                            <Icons.RefreshCw className="w-5 h-5 text-indigo-400" />
                            Pilih Persona Kamu
                        </h3>
                        <p className="text-xs text-white/40 mt-1">Sesuaikan karakter dengan identitas belajarmu</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories Tabs */}
                <div className="flex px-6 pt-4 gap-2">
                    {AVATAR_CATEGORIES.map((cat) => {
                        const Icon = (Icons as any)[cat.icon] || Icons.User;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
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

                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-white/60 italic">"{filteredCategory?.description}"</p>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredCategory?.seeds.map((seed) => {
                            const url = getAvatarUrl(seed);
                            const isSelected = selectedSeed === seed || currentAvatar === url;

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
                </div>

                <div className="p-6 border-t border-white/5 bg-slate-900/50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-white/70 hover:bg-white/5 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => selectedSeed && onSelect(getAvatarUrl(selectedSeed))}
                        disabled={!selectedSeed}
                        className="flex-2 py-3 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-95"
                    >
                        Simpan Avatar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
