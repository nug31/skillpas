import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, GraduationCap, Sun, Moon, Instagram, Eye, EyeOff, MessageCircle } from 'lucide-react';
import loginBg from '../assets/login-bg.png';
import loginLightBg from '../assets/login-light-bg.png';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden ${themeClear
            ? 'bg-slate-50'
            : 'bg-[#020617]'
            }`}>

            {/* Background Image / Pattern */}
            <div
                className={`absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ${themeClear ? 'opacity-[0.15] scale-105 saturate-[0.8]' : 'opacity-40 mix-blend-screen scale-110 animate-pulse-slow'}`}
                style={{
                    backgroundImage: `url(${themeClear ? loginLightBg : loginBg})`,
                    animationDuration: themeClear ? '0s' : '10s'
                }}
            />

            {/* Abstract Background Blobs */}
            {themeClear ? (
                <>
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }} />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-100/40 blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-[1]" />
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-yellow-600/10 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '5s' }} />
                    {/* Noise & Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black opacity-80 z-[1]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-[2]" />
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
                        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${!themeClear ? 'bg-yellow-500/30 group-hover:bg-yellow-400/50' : 'bg-emerald-500/10 group-hover:bg-emerald-500/20'}`} />
                        <img
                            src="/logo.png"
                            alt="SMK Logo"
                            className={`relative w-24 h-24 object-cover transition-all duration-500 ${themeClear
                                ? 'ring-4 ring-emerald-50'
                                : 'ring-2 ring-white/10 logo-gold'}`}
                        />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] [.theme-clear_&]:from-emerald-600 [.theme-clear_&]:via-teal-600 [.theme-clear_&]:to-cyan-600">
                        SKILL PASSPORT
                    </h1>
                    <p className={`text-sm font-medium tracking-wide uppercase ${themeClear ? 'text-emerald-800' : 'text-amber-200/70'}`}>Menuju Vokasi Berstandar Industri & Terverifikasi</p>
                </div>

                {/* Login Card */}
                <div className={`backdrop-blur-3xl rounded-[2.5rem] p-8 lg:p-10 shadow-2xl border transition-all duration-500 ${themeClear
                    ? 'bg-white/90 border-slate-200/60 shadow-[0_20px_50px_rgba(15,118,110,0.15)]'
                    : 'bg-black/40 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] ring-1 ring-white/5'
                    }`}>

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedRole === 'student'
                                ? themeClear
                                    ? 'border-emerald-500 bg-emerald-100/50 text-emerald-700 shadow-sm'
                                    : 'border-yellow-500/50 bg-yellow-950/30 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.2)]'
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
                                    ? 'border-teal-500 bg-teal-100/50 text-teal-700 shadow-sm'
                                    : 'border-amber-500/50 bg-amber-950/30 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
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
                            <label htmlFor="username" className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeClear ? 'text-emerald-700' : 'text-slate-400 group-focus-within:text-yellow-400 transition-colors'}`}>
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-5 py-4 rounded-xl transition-all outline-none border focus:ring-0 ${themeClear
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
                                        : 'bg-black/20 border-white/10 text-white placeholder-white/20 focus:border-yellow-500/50 focus:bg-yellow-950/10 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                        }`}
                                    placeholder={selectedRole === 'student' ? 'siswa_mesin' : 'guru'}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label htmlFor="password" className={`block text-xs font-bold uppercase tracking-wider mb-2 ${themeClear ? 'text-emerald-700' : 'text-slate-400 group-focus-within:text-amber-400 transition-colors'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-5 py-4 rounded-xl transition-all outline-none border focus:ring-0 ${themeClear
                                        ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
                                        : 'bg-black/20 border-white/10 text-white placeholder-white/20 focus:border-amber-500/50 focus:bg-amber-950/10 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${themeClear ? 'text-slate-400 hover:text-slate-600' : 'text-white/70 hover:text-white'}`}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
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
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg'
                                : 'bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] border border-white/10'
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
                        <div className="flex gap-6 opacity-80 mt-2">
                            <a
                                href="https://instagram.com/j.s_nugroho"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-pink-400 transition-all group"
                                title="@j.s_nugroho"
                            >
                                <Instagram className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://wa.me/6281316052316"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-green-400 transition-all group"
                                title="0813-1605-2316"
                            >
                                <MessageCircle className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
