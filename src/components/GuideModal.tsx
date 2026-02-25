import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole?: string;
}

interface Step {
    icon: any;
    title: string;
    desc: string;
    color: string;
    bg: string;
}

interface Feature {
    name: string;
    icon: any;
    desc: string;
}

export function GuideModal({ isOpen, onClose, userRole = 'student' }: GuideModalProps) {
    if (!isOpen) return null;

    const getRoleContent = () => {
        const role = userRole?.toLowerCase();

        // --- STUDENT ---
        if (role === 'student') {
            return {
                title: "Panduan Siswa",
                intro: "Skill Passport adalah portofolio digital yang mencatat seluruh perjalanan kompetensi, prestasi, dan karaktermu selama menempuh pendidikan.",
                steps: [
                    { icon: Icons.Target, title: "Pilih Misi", desc: "Klik 'Upgrade Skill' dan pilih kompetensi yang ingin kamu kuasai.", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { icon: Icons.Clock, title: "Tunggu Review", desc: "Guru Produktif & Wali Kelas akan mereview rencana belajarmu.", color: "text-amber-400", bg: "bg-amber-400/10" },
                    { icon: Icons.Award, title: "Ujian", desc: "Ikuti ujian sesuai jadwal dan unggah bukti dokumentasinya.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { icon: Icons.TrendingUp, title: "Naik Level", desc: "XP bertambah setelah lulus ujian, membawamu ke level lebih tinggi.", color: "text-purple-400", bg: "bg-purple-400/10" }
                ],
                features: [
                    { name: "Skill Card", icon: Icons.Contact, desc: "QR Code portofolio digital untuk verifikasi industri." },
                    { name: "Passport Book", icon: Icons.BookOpen, desc: "Riwayat lengkap kompetensi dan stempel keberhasilan." },
                    { name: "Dokumentasi", icon: Icons.Upload, desc: "Simpan bukti foto dan video ujian secara permanen." }
                ]
            };
        }

        // --- WALAS ---
        if (role === 'wali_kelas') {
            return {
                title: "Panduan Wali Kelas",
                intro: "Anda berperan memantau perkembangan kompetensi dan membentuk karakter disiplin siswa di kelas binaan Anda.",
                steps: [
                    { icon: Icons.LayoutDashboard, title: "Walas Insight", desc: "Pantau rata-rata skor, progres level, dan status KRS siswa se-kelas.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { icon: Icons.UserCheck, title: "Kelola Hadir", desc: "Update data absensi (Masuk, Izin, Sakit, Alfa) secara berkala.", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { icon: Icons.ShieldCheck, title: "Skor Sikap", desc: "Berikan penilaian aspek non-teknis: Disiplin, Tanggung Jawab, & Kerja Sama.", color: "text-amber-400", bg: "bg-amber-400/10" },
                    { icon: Icons.FileDown, title: "Ekspor Laporan", desc: "Unduh rekapitulasi data kelas dalam format Excel/CSV untuk pelaporan.", color: "text-purple-400", bg: "bg-purple-400/10" }
                ],
                features: [
                    { name: "Monitoring Real-time", icon: Icons.Activity, desc: "Lihat status pendaftaran sertifikasi siswa secara langsung." },
                    { name: "Edit Data Profil", icon: Icons.UserCog, desc: "Bantu perbaiki Nama/Kelas siswa jika terjadi kesalahan input." },
                    { name: "Leaderboard Kelas", icon: Icons.Trophy, desc: "Lihat peringkat siswa terbaik di kelas Anda." }
                ]
            };
        }

        // --- GURU PRODUKTIF ---
        if (role === 'teacher_produktif' || role === 'teacher') {
            return {
                title: "Panduan Guru Produktif",
                intro: "Anda adalah penguji utama kompetensi teknis. Tugas Anda memverifikasi pendaftaran dan menginput nilai ujian.",
                steps: [
                    { icon: Icons.ClipboardCheck, title: "Verifikasi", desc: "Review pendaftaran kompetensi siswa di Tab Pengajuan.", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { icon: Icons.Edit3, title: "Input Nilai", desc: "Masukkan skor dan hasil ujian di Tab Penilaian setelah ujian selesai.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { icon: Icons.Settings, title: "Atur Kriteria", desc: "Sesuaikan standar unit kompetensi pada setiap level skill.", color: "text-amber-400", bg: "bg-amber-400/10" },
                    { icon: Icons.MessageSquare, title: "Notifikasi WA", desc: "Kirim pesan jadwal ujian langsung ke WhatsApp siswa.", color: "text-purple-400", bg: "bg-purple-400/10" }
                ],
                features: [
                    { name: "Batch Approval", icon: Icons.CheckSquare, desc: "Setujui banyak pengajuan pendaftaran sekaligus." },
                    { name: "Update Skor Langsung", icon: Icons.Zap, desc: "Edit skor siswa di tabel jurusan untuk penyesuaian cepat." },
                    { name: "Import Data", icon: Icons.FileSpreadsheet, desc: "Upload data siswa baru via Excel/CSV." }
                ]
            };
        }

        // --- HOD ---
        if (role === 'hod') {
            return {
                title: "Panduan Kaprodi (HOD)",
                intro: "Bertanggung jawab atas validasi akhir, penjadwalan ujian, dan pengawasan standar kompetensi jurusan.",
                steps: [
                    { icon: Icons.Calendar, title: "Penjadwalan", desc: "Tentukan tanggal ujian untuk pengajuan yang telah disetujui guru.", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { icon: Icons.ShieldCheck, title: "Validasi Akhir", desc: "Review dan finalisasi pengajuan sertifikasi di level jurusan.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { icon: Icons.BarChart3, title: "Analitik", desc: "Pantau tren performa dan rata-rata skor per angkatan.", color: "text-amber-400", bg: "bg-amber-400/10" },
                    { icon: Icons.Package, title: "Standar Industri", desc: "Pastikan kriteria level sesuai dengan kebutuhan industri terbaru.", color: "text-purple-400", bg: "bg-purple-400/10" }
                ],
                features: [
                    { name: "Jadwal Massal", icon: Icons.Layers, desc: "Setujui dan jadwalkan banyak siswa sekaligus dalam satu tanggal." },
                    { name: "Monitoring Race", icon: Icons.Timer, desc: "Pantau persaingan sehat antar kelas di bawah jurusan Anda." },
                    { name: "Podium Excellence", icon: Icons.Medal, desc: "Identifikasi siswa terbaik untuk program magang/kerja." }
                ]
            };
        }

        // --- DEFAULT / ADMIN ---
        return {
            title: "Panduan Sistem",
            intro: "Skill Passport mengintegrasikan progres kompetensi siswa, verifikasi penguji, dan monitoring pimpinan dalam satu platform.",
            steps: [
                { icon: Icons.UserCheck, title: "Kelola User", desc: "Pastikan semua akun siswa dan guru telah terdaftar dengan benar.", color: "text-blue-400", bg: "bg-blue-400/10" },
                { icon: Icons.Database, title: "Backup Data", desc: "Lakukan pencatatan cadangan data secara berkala.", color: "text-amber-400", bg: "bg-amber-400/10" },
                { icon: Icons.Lock, title: "Keamanan", desc: "Jaga kerahasiaan password dan akses akun masing-masing.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                { icon: Icons.HelpCircle, title: "Bantuan", desc: "Hubungi tim teknis jika terjadi kendala pada sistem.", color: "text-purple-400", bg: "bg-purple-400/10" }
            ],
            features: [
                { name: "Sync Database", icon: Icons.RefreshCw, desc: "Data terintegrasi real-time antara siswa dan guru." },
                { name: "Multi-Platform", icon: Icons.Smartphone, desc: "Akses lancar dari PC, Tablet, maupun Smartphone." },
                { name: "Report Engine", icon: Icons.FilePieChart, desc: "Laporan otomatis dalam berbagai format dokumen." }
            ]
        };
    };

    const content = getRoleContent();

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
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-600/20 to-transparent text-left">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                                <Icons.Zap className="w-5 h-5 text-white fill-current" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">{content.title}</h2>
                                <p className="text-xs text-white/50 tracking-tight">Maksimalkan perjalanan kompetensimu</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors shrink-0"
                        >
                            <Icons.X className="w-5 h-5 text-white/50" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar text-left font-sans">
                        {/* Section: Introduction */}
                        <section className="space-y-3">
                            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Tentang Sistem</h3>
                            <p className="text-white/70 leading-relaxed text-sm">
                                {content.intro}
                            </p>
                        </section>

                        {/* Section: Core Flow */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Alur Kerja Utama</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.steps.map((step, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 hover:bg-white/[0.08] transition-colors group">
                                        <div className={`shrink-0 w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <step.icon className={`w-5 h-5 ${step.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm mb-1">{step.title}</h4>
                                            <p className="text-[11px] text-white/50 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: Key Features */}
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Fitur & Kemampuan</h3>
                            <div className="space-y-3">
                                {content.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <div className="p-2 bg-slate-800 rounded-lg text-indigo-400 shrink-0">
                                            <feature.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-white">{feature.name}</h4>
                                            <p className="text-[11px] text-white/40">{feature.desc}</p>
                                        </div>
                                        <Icons.ChevronRight className="w-4 h-4 text-white/20" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section: PWA for Students only */}
                        {userRole === 'student' && (
                            <section className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 relative overflow-hidden">
                                <Icons.Smartphone className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
                                <div className="relative z-10 text-left">
                                    <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                                        <Icons.Download className="w-4 h-4 text-indigo-400" />
                                        Install di Smartphone
                                    </h4>
                                    <p className="text-[11px] text-white/60 leading-relaxed max-w-md">
                                        Gunakan fitur PWA untuk memasang Skill Passport langsung di layar utama HP Anda tanpa melalui PlayStore. Lebih cepat dan praktis!
                                    </p>
                                </div>
                            </section>
                        )}
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
