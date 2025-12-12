import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, User, GraduationCap, Sun, Moon } from 'lucide-react';
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
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClear
            ? 'bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100'
            : 'bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a]'
            }`}>
            {/* Theme Toggle Button */}
            <button
                onClick={() => setThemeClear(!themeClear)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all shadow-lg ${themeClear
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                title={themeClear ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
                {themeClear ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <img
                            src={smkLogo}
                            alt="SMK Logo"
                            className="w-20 h-20 rounded-full object-cover bg-white p-2 shadow-2xl"
                        />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                        Skill Passport
                    </h1>
                    <p className={`text-sm ${themeClear ? 'text-slate-600' : 'text-white'}`}>Competency & achievement tracker</p>
                </div>

                {/* Login Card */}
                <div className={`backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-colors ${themeClear
                    ? 'bg-white border border-slate-200'
                    : 'bg-white/5 border border-white/10'
                    }`}>
                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`p-4 rounded-xl border transition-all ${selectedRole === 'student'
                                ? themeClear
                                    ? 'border-purple-500 bg-purple-100 text-purple-700'
                                    : 'border-purple-400 bg-purple-400/20 text-white'
                                : themeClear
                                    ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <User className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Siswa</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('teacher')}
                            className={`p-4 rounded-xl border transition-all ${selectedRole === 'teacher'
                                ? themeClear
                                    ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                                    : 'border-indigo-400 bg-indigo-400/20 text-white'
                                : themeClear
                                    ? 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                                    : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">Guru</div>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className={`block text-sm font-medium mb-2 ${themeClear ? 'text-slate-700' : 'text-white'}`}>
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 ${themeClear
                                    ? 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400'
                                    : 'bg-white/5 border border-white/10 text-white placeholder-white/40'
                                    }`}
                                placeholder={selectedRole === 'student' ? 'siswa_mesin' : 'guru'}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${themeClear ? 'text-slate-700' : 'text-white'}`}>
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 ${themeClear
                                        ? 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400'
                                        : 'bg-white/5 border border-white/10 text-white placeholder-white/40'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
