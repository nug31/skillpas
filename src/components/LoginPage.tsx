import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, GraduationCap, Sun, Moon, Instagram, Phone } from 'lucide-react';
import smkLogo from '../assets/smk-logo.png';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [themeClear, setThemeClear] = useState<boolean>(() => {
        try {
            return localStorage.getItem('theme') === 'clear';
        } catch (e) {
            return false;
        }
    });

    // Sync theme with document root
    useEffect(() => {
        const root = document.documentElement;
        if (themeClear) {
            root.classList.add('theme-clear');
        } else {
            root.classList.remove('theme-clear');
        }
        try {
            localStorage.setItem('theme', themeClear ? 'clear' : 'dark');
        } catch (e) { }
    }, [themeClear]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await login(username, password, selectedRole);

        if (success) {
            // Login successful - AuthContext will handle state update
        } else {
            setError(`Login gagal. Pastikan username/password benar dan pilih role yang sesuai (${selectedRole === 'student' ? 'Siswa' : 'Guru'}).`);
        }

        setLoading(false);
    };



    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden ${themeClear
            ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100'
            : 'bg-[#050505]'
            }`}>

            {/* Abstract Background Blobs (Dark Mode Only) */}
            {!themeClear && (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-[100px]" />
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                </>
            )}

            {/* Theme Toggle Button */}
            <button
                onClick={() => setThemeClear(!themeClear)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-lg z-20 ${themeClear
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/20 backdrop-blur-md'
                    }`}
                title={themeClear ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
                {themeClear ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4 group">
                        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${!themeClear ? 'bg-cyan-500/30 group-hover:bg-cyan-400/50' : 'bg-transparent'}`} />
                        <img
                            src={smkLogo}
                            alt="SMK Logo"
                            className="relative w-24 h-24 rounded-full object-cover bg-white p-2 shadow-2xl ring-2 ring-white/10"
                        />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        SKILL PASSPORT
                    </h1>
                    <p className={`text-sm font-medium tracking-wide uppercase ${themeClear ? 'text-slate-600' : 'text-cyan-200/70'}`}>Menuju Vokasi Berstandar Industri & Terverifikasi</p>
                </div>

                {/* Login Card */}
                <div className={`backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border transition-all duration-300 ${themeClear
                    ? 'bg-white border-slate-200 shadow-xl'
                    : 'bg-black/30 border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'
                    }`}>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedRole === 'student'
                                ? themeClear
                                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                                    : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                : themeClear
                                    ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <User className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${!themeClear && selectedRole === 'student' ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}`} />
                                <span className="font-bold tracking-wider text-sm">SISWA</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('teacher')}
                            className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedRole === 'teacher'
                                ? themeClear
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                                    : 'border-purple-500/50 bg-purple-950/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                                : themeClear
                                    ? 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                                    : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <div className="relative z-10 flex flex-col items-center">
                                <GraduationCap className={`w-6 h-6 mb-2 transition-transform group-hover:scale-110 ${!themeClear && selectedRole === 'teacher' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
                                <span className="font-bold tracking-wider text-sm">GURU</span>
                            </div>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Input */}
                        <div className="group">
                            <label htmlFor="username" className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeClear ? 'text-slate-500' : 'text-slate-400 group-focus-within:text-cyan-400 transition-colors'}`}>
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-5 py-4 rounded-xl transition-all outline-none border focus:ring-0 ${themeClear
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500'
                                        : 'bg-black/20 border-white/10 text-white placeholder-white/20 focus:border-cyan-500/50 focus:bg-cyan-950/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                        }`}
                                    placeholder={selectedRole === 'student' ? 'siswa_mesin' : 'guru'}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label htmlFor="password" className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeClear ? 'text-slate-500' : 'text-slate-400 group-focus-within:text-purple-400 transition-colors'}`}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-5 py-4 rounded-xl transition-all outline-none border focus:ring-0 ${themeClear
                                    ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-purple-500'
                                    : 'bg-black/20 border-white/10 text-white placeholder-white/20 focus:border-purple-500/50 focus:bg-purple-950/10 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-center animate-shake">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 text-white font-bold tracking-widest uppercase rounded-xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${themeClear
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg'
                                : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] border border-white/10'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Masuk Sistem</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer decorations */}
                <div className={`mt-8 text-center text-xs ${themeClear ? 'text-slate-400' : 'text-white/40'}`}>
                    <div className="flex flex-col items-center gap-1">
                        <p className="font-semibold tracking-wide">DEVELOPED BY JSNUGROHO</p>
                        <div className="flex gap-4 opacity-80 mt-1">
                            <a
                                href="https://instagram.com/j.s_nugroho"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 hover:text-pink-400 transition-colors group"
                            >
                                <Instagram className="w-4 h-4" />
                                <span className="text-[10px] group-hover:underline">@j.s_nugroho</span>
                            </a>
                            <span className="opacity-50">•</span>
                            <a
                                href="https://wa.me/6281316052316"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 hover:text-green-400 transition-colors group"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="text-[10px] group-hover:underline">0813-1605-2316</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
