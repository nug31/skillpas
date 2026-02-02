import { useState, useEffect } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';

export function ConnectionStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showToast, setShowToast] = useState(false);
    const [type, setType] = useState<'online' | 'offline'>('online');

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setType('online');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setType('offline');
            setShowToast(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showToast && isOnline) return null;

    return (
        <div className={`fixed bottom-24 right-6 z-[100] transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md ${type === 'online'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                <div className={`p-1.5 rounded-lg ${type === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {type === 'online' ? <Wifi className="w-4 h-4 text-white" /> : <WifiOff className="w-4 h-4 text-white" />}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-wider">
                        {type === 'online' ? 'Terhubung' : 'Terputus'}
                    </span>
                    <span className="text-[10px] opacity-80 font-medium">
                        {type === 'online' ? 'Anda kembali online' : 'Bekerja secara offline'}
                    </span>
                </div>
                <button
                    onClick={() => setShowToast(false)}
                    className="ml-2 p-1 hover:bg-white/5 rounded-md transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
