// Simple vanilla implementation with Supabase backup and local Notification support
import { supabase, isMockMode } from './supabase';

export interface Notification {
    id: string;
    user_id?: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    fetchNotifications: (userId: string) => Promise<void>;
    clearAll: () => void;
    requestPermission: () => Promise<boolean>;
}

const listeners = new Set<(state: NotificationStore) => void>();
let state: NotificationStore = {
    notifications: [],
    unreadCount: 0,
    addNotification: async (n) => {
        const id = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        // Add to local state immediately for UI responsiveness
        const newNotif: Notification = { ...n, id, timestamp, read: false };
        state.notifications = [newNotif, ...state.notifications];
        state.unreadCount += 1;
        notify();

        // Persist to Supabase if not in mock mode and user_id is provided
        if (!isMockMode && n.user_id) {
            await supabase.from('notifications').insert({
                user_id: n.user_id,
                title: n.title,
                message: n.message,
                type: n.type
            });
        }

        // Browser push notification
        if ("Notification" in window && Notification.permission === "granted") {
            try {
                new window.Notification(n.title, {
                    body: n.message,
                    icon: '/icon-192.png'
                });
            } catch (e) {
                console.warn("Could not show browser notification", e);
            }
        }
    },
    markAsRead: async (id) => {
        state.notifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        notify();

        if (!isMockMode) {
            await supabase.from('notifications').update({ read: true }).eq('id', id);
        }
    },
    fetchNotifications: async (userId) => {
        if (isMockMode) return;

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            state.notifications = data.map((d: any) => ({
                id: d.id,
                user_id: d.user_id,
                title: d.title,
                message: d.message,
                type: d.type as any,
                timestamp: d.created_at,
                read: d.read
            }));
            state.unreadCount = state.notifications.filter(n => !n.read).length;
            notify();
        }
    },
    clearAll: () => {
        state.notifications = [];
        state.unreadCount = 0;
        notify();
    },
    requestPermission: async () => {
        if (!("Notification" in window)) return false;
        try {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        } catch (e) {
            console.error("Error requesting notification permission", e);
            return false;
        }
    }
};

function notify() {
    listeners.forEach(l => l({ ...state }));
}

export const notificationStore = {
    subscribe: (listener: (state: NotificationStore) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getState: () => ({ ...state }),
    actions: {
        addNotification: state.addNotification,
        markAsRead: state.markAsRead,
        fetchNotifications: state.fetchNotifications,
        clearAll: state.clearAll,
        requestPermission: state.requestPermission
    }
};
