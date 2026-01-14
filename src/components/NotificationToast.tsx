import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { notificationStore, Notification } from '../lib/notificationStore';
import { motion, AnimatePresence } from 'framer-motion';

export function NotificationToast() {
    const [activeNotification, setActiveNotification] = useState<Notification | null>(null);

    useEffect(() => {
        const state = notificationStore.getState();
        const latest = state.notifications[0];
        if (latest && !latest.read) {
            setActiveNotification(latest);
        }

        const unsubscribe = notificationStore.subscribe((newState) => {
            const newLatest = newState.notifications[0];
            if (newLatest && (!activeNotification || newLatest.id !== activeNotification.id) && !newLatest.read) {
                setActiveNotification(newLatest);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [activeNotification]);

    useEffect(() => {
        if (activeNotification) {
            const timer = setTimeout(() => {
                setActiveNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [activeNotification]);

    if (!activeNotification) return null;

    const icons = {
        info: <Info className="w-5 h-5 text-blue-400" />,
        success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="fixed top-6 right-6 z-[200] w-full max-w-sm"
            >
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4 ring-1 ring-white/5">
                    <div className="p-2 bg-white/5 rounded-xl">
                        {icons[activeNotification.type]}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{activeNotification.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{activeNotification.message}</p>
                    </div>
                    <button
                        onClick={() => setActiveNotification(null)}
                        className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
