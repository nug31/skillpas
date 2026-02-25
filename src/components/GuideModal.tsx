import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole?: string;
}

export function GuideModal({ isOpen, onClose, userRole = 'student' }: GuideModalProps) {
    if (!isOpen) return null;

    const isStudent = userRole === 'student';

    const studentSteps = [
        {
            icon: Icons.Target,
            title: "Pilih Misi",
            desc: "Klik tombol 'Upgrade Skill' dan pilih kriteria kompetensi yang ingin kamu kuasai.",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            icon: Icons.Clock,
            title: "Tunggu Persetujuan",
            desc: "Guru Produktif dan Wali Kelas akan mereview rencana belajarmu.",
            color: "text-amber-400",
            bg: "bg-amber-400/10"
        },
        {
            icon: Icons.Award,
            title: "Ujian & Sertifikasi",
            desc: "Ikuti ujian pada jadwal yang ditentukan dan unggah bukti dokumentasinya.",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10"
        },
        {
            icon: Icons.TrendingUp,
            title: "Naik Level",
            desc: "Skor XP akan bertambah setelah lulus ujian, membawamu ke level yang lebih tinggi.",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
        }
    ];

    const features = [
        {
            name: "Skill Card",
            icon: Icons.Contact,
            desc: "QR Code portofolio digitalmu untuk verifikasi industri."
        },
        {
            name: "Passport Book",
            icon: Icons.BookOpen,
            desc: "Riwayat lengkap kompetensi dan stempel keberhasilan."
        },
        {
            name: "Dokumentasi",
            icon: Icons.Upload,
            desc: "Simpan bukti foto dan video ujian secara permanen."
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-600/20 to-transparent">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                                <Icons.Zap className="w-5 h-5 text-white fill-current" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">
                                    {isStudent ? "Panduan Siswa" : "Panduan Pengguna"}
                                </h2>
                                <p className="text-xs text-white/50">Maksimalkan perjalanan kompetensimu</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <Icons.X className="w-5 h-5 text-white/50" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Section: Introduction */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Tentang Skill Passport</h3>
                            <p className="text-white/70 leading-relaxed">
                                **Skill Passport** adalah portofolio digital yang mencatat seluruh perjalanan kompetensi, prestasi, dan karaktermu selama menempuh pendidikan di SMK Mitra Industri.
                            </p>
                        </section>

                        {/* Section: Core Flow */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Alur Peningkatan Skill</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {studentSteps.map((step, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                                        <div className={`shrink-0 w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center`}>
                                            <step.icon className={`w-5 h-5 ${step.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                                            <p className="text-xs text-white/50 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Key Features */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Fitur Utama</h3>
                            <div className="space-y-3">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                                            <feature.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-white">{feature.name}</h4>
                                            <p className="text-xs text-white/40">{feature.desc}</p>
                                        </div>
                                        <Icons.ChevronRight className="w-4 h-4 text-white/20" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: PWA */}
                        <section className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 relative overflow-hidden">
                            <Icons.Smartphone className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
                            <div className="relative z-10">
                                <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                                    <Icons.Download className="w-4 h-4 text-indigo-400" />
                                    Install di Smartphone
                                </h4>
                                <p className="text-xs text-white/60 leading-relaxed max-w-md">
                                    Gunakan fitur PWA untuk memasang Skill Passport langsung di layar utama HP Anda tanpa melalui PlayStore. Lebih cepat, hemat kuota, dan praktis!
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-slate-800/50">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                        >
                            Saya Mengerti
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
