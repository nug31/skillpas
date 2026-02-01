import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needUpdate: [needUpdate, setNeedUpdate],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedUpdate(false);
    };

    if (!offlineReady && !needUpdate) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] p-4 bg-slate-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl max-w-[320px] animate-in slide-in-from-bottom-5 duration-300">
            <div className="mb-3">
                {offlineReady ? (
                    <span className="text-white text-sm font-medium">Aplikasi siap bekerja secara offline</span>
                ) : (
                    <span className="text-white text-sm font-medium">Versi baru tersedia! Klik Update untuk memperbarui.</span>
                )}
            </div>
            <div className="flex gap-2">
                {needUpdate && (
                    <button
                        className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
                        onClick={() => updateServiceWorker(true)}
                    >
                        Update
                    </button>
                )}
                <button
                    className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-xs font-semibold transition-colors"
                    onClick={() => close()}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default ReloadPrompt;
