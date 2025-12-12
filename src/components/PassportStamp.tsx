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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0a0e1a] [.theme-clear_&]:from-slate-100 [.theme-clear_&]:via-blue-50 [.theme-clear_&]:to-slate-100">
            <div className="relative flex flex-col items-center">
                {/* Passport Card Background */}
                <div className="relative w-80 h-96 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 [.theme-clear_&]:from-indigo-100 [.theme-clear_&]:to-purple-100 rounded-2xl border-2 border-indigo-500/30 [.theme-clear_&]:border-indigo-300 shadow-2xl backdrop-blur-xl overflow-hidden">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                        <h2 className="text-white font-bold text-lg tracking-widest">SKILL PASSPORT</h2>
                    </div>

                    {/* Content Area */}
                    <div className="pt-20 px-6 flex flex-col items-center">
                        {/* User Avatar Placeholder */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
                            {userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>

                        {/* User Name */}
                        <h3 className="text-xl font-bold text-white [.theme-clear_&]:text-slate-800 mb-2">
                            {userName}
                        </h3>

                        <p className="text-sm text-white/60 [.theme-clear_&]:text-slate-500 mb-8">
                            SMK Mitra Industri
                        </p>

                        {/* Stamp Area */}
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            {/* Stamp Animation */}
                            <div
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${showStamp
                                        ? 'scale-100 opacity-100'
                                        : 'scale-[3] opacity-0'
                                    }`}
                                style={{
                                    filter: showStamp ? 'none' : 'blur(10px)',
                                }}
                            >
                                <div className="relative">
                                    {/* Stamp Circle */}
                                    <div className="w-28 h-28 rounded-full border-4 border-green-500 flex flex-col items-center justify-center bg-green-500/10 [.theme-clear_&]:bg-green-100 rotate-[-12deg]">
                                        <Check className="w-10 h-10 text-green-500 mb-1" strokeWidth={3} />
                                        <span className="text-green-500 font-bold text-xs tracking-widest">VERIFIED</span>
                                        <span className="text-green-400 text-[10px] mt-1">
                                            {new Date().toLocaleDateString('id-ID')}
                                        </span>
                                    </div>

                                    {/* Ink effect */}
                                    {showStamp && (
                                        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-500" style={{ animationDuration: '0.5s', animationIterationCount: '1' }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom decoration */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-indigo-600/50 to-purple-600/50" />
                </div>

                {/* Welcome Text */}
                <div
                    className={`mt-8 text-center transition-all duration-500 ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <h1 className="text-2xl font-bold text-white [.theme-clear_&]:text-slate-800 mb-2">
                        Selamat Datang! 🎉
                    </h1>
                    <p className="text-white/60 [.theme-clear_&]:text-slate-500">
                        Mengalihkan ke dashboard...
                    </p>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-1 mt-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
