import { useEffect, useState } from 'react';
import { Check, Stamp } from 'lucide-react';

interface PassportStampProps {
    userName: string;
    onComplete: () => void;
}

export function PassportStamp({ userName, onComplete }: PassportStampProps) {
    const [showStamp, setShowStamp] = useState(false);
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Show stamp with delay
        const stampTimer = setTimeout(() => {
            setShowStamp(true);
            // Play stamp sound (optional)
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleXBla2VybmVsWyJhdW...');
            } catch (e) { }
        }, 300);

        // Show welcome text
        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 800);

        // Complete animation and proceed
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => {
            clearTimeout(stampTimer);
            clearTimeout(textTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] [.theme-clear_&]:bg-slate-100 overflow-hidden">
            {/* Abstract Background Blobs (Dark Mode Only) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none [.theme-clear_&]:hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '5s' }} />
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-pink-600/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="relative flex flex-col items-center z-10 scale-110">
                {/* Passport Card Background - Holographic Glass Style */}
                <div className="relative w-80 h-96 rounded-3xl border border-white/10 [.theme-clear_&]:border-white/40 shadow-[0_0_40px_rgba(0,0,0,0.5)] [.theme-clear_&]:shadow-xl backdrop-blur-2xl overflow-hidden bg-white/5 [.theme-clear_&]:bg-white/60">

                    {/* Inner sheen/gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 [.theme-clear_&]:opacity-50 pointer-events-none" />

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center justify-center border-b border-white/5">
                        <div className="text-[10px] tracking-[0.3em] font-medium text-cyan-300 [.theme-clear_&]:text-indigo-600 uppercase mb-1">Official Document</div>
                        <h2 className="text-white [.theme-clear_&]:text-slate-800 font-black text-xl tracking-wider drop-shadow-md">SKILL PASSPORT</h2>
                    </div>

                    {/* Content Area */}
                    <div className="pt-24 px-6 flex flex-col items-center relative z-10">
                        {/* User Avatar Placeholder with Neon Ring */}
                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                            <div className="relative w-24 h-24 rounded-full bg-[#1a1f3a] [.theme-clear_&]:bg-white flex items-center justify-center text-white [.theme-clear_&]:text-indigo-600 text-3xl font-bold shadow-2xl ring-2 ring-white/20">
                                {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                        </div>

                        {/* User Name */}
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200 [.theme-clear_&]:from-indigo-600 [.theme-clear_&]:to-purple-600 mb-1 text-center">
                            {userName}
                        </h3>

                        <p className="text-sm text-cyan-200/60 [.theme-clear_&]:text-slate-500 font-medium tracking-wide uppercase">
                            SMK Mitra Industri
                        </p>

                        {/* Stamp Area */}
                        <div className="absolute bottom-6 w-full flex justify-center">
                            {/* Stamp Animation */}
                            <div
                                className={`relative flex items-center justify-center transition-all duration-500 ${showStamp
                                    ? 'scale-100 opacity-100'
                                    : 'scale-[3] opacity-0'
                                    }`}
                                style={{
                                    filter: showStamp ? 'none' : 'blur(20px)',
                                }}
                            >
                                <div className="relative group cursor-default">
                                    {/* Validated Glow */}
                                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse" />

                                    {/* Stamp Circle */}
                                    <div className="w-32 h-32 rounded-full border-4 border-green-400 [.theme-clear_&]:border-green-600 flex flex-col items-center justify-center bg-green-500/10 [.theme-clear_&]:bg-green-100/50 backdrop-blur-md rotate-[-12deg] shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                                        <Check className="w-12 h-12 text-green-400 [.theme-clear_&]:text-green-600 mb-1 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]" strokeWidth={4} />
                                        <span className="text-green-400 [.theme-clear_&]:text-green-600 font-black text-xs tracking-[0.2em]">VERIFIED</span>
                                        <span className="text-green-300 [.theme-clear_&]:text-green-700 text-[10px] mt-1 font-mono">
                                            {new Date().toLocaleDateString('id-ID')}
                                        </span>
                                    </div>

                                    {/* Ink effect */}
                                    {showStamp && (
                                        <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-green-400" style={{ animationDuration: '0.6s', animationIterationCount: '1' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative lines */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
                </div>

                {/* Welcome Text */}
                <div
                    className={`mt-10 text-center transition-all duration-700 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    <h1 className="text-3xl font-black text-white [.theme-clear_&]:text-slate-800 mb-2 drop-shadow-lg">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 [.theme-clear_&]:from-indigo-600 [.theme-clear_&]:to-purple-600">
                            ACCESS GRANTED
                        </span>
                    </h1>
                    <p className="text-cyan-100/60 [.theme-clear_&]:text-slate-500 font-medium tracking-wide">
                        Redirecting to secure dashboard...
                    </p>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce shadow-[0_0_10px_rgba(192,132,252,0.8)]" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce shadow-[0_0_10px_rgba(244,114,182,0.8)]" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
