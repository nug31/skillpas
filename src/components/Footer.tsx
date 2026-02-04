import { Instagram, MessageCircle, Globe } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full relative z-40 mt-auto">
            {/* Main Container */}
            <div className="bg-[color:var(--bg-from)]/95 backdrop-blur-md border-t border-[color:var(--card-border)] rounded-t-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.2)] flex flex-col items-center py-8 relative overflow-hidden [.theme-clear_&]:shadow-slate-200/50">

                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--accent-1),transparent_70%)]" />
                </div>

                {/* Footer Credits */}
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <p className="text-[10px] tracking-[0.3em] font-bold text-[color:var(--text-muted)] uppercase">
                        Developed by JSNUGROHO
                    </p>

                    <div className="flex justify-center items-center gap-6 sm:gap-8">
                        <a
                            href="https://jsnportofolio.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center text-[color:var(--text-muted)] hover:text-blue-500 transition-all duration-300"
                            title="Portfolio"
                        >
                            <div className="p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                                <Globe size={20} />
                            </div>
                        </a>

                        <a
                            href="https://instagram.com/j.s_nugroho"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center text-[color:var(--text-muted)] hover:text-[color:var(--accent-1)] transition-all duration-300"
                            title="Instagram"
                        >
                            <div className="p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-[color:var(--accent-1)]/30 group-hover:bg-[color:var(--accent-1)]/5 transition-all">
                                <Instagram size={20} />
                            </div>
                        </a>

                        <a
                            href="https://wa.me/6281316052316"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center text-[color:var(--text-muted)] hover:text-emerald-500 transition-all duration-300"
                            title="WhatsApp"
                        >
                            <div className="p-3 rounded-full bg-white/5 border border-white/5 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/5 transition-all">
                                <MessageCircle size={20} />
                            </div>
                        </a>
                    </div>

                    <div className="mt-2 text-[10px] text-[color:var(--text-muted)]/50 font-medium">
                        © {new Date().getFullYear()} SMK Skill Passport • All Rights Reserved
                    </div>
                </div>
            </div>
        </footer>
    );
}
