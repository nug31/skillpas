// Simple vanilla implementation
export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

interface NotificationStore {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    clearAll: () => void;
}

// Check if we need to install zustand. package.json didn't show it.
// I'll use a simple vanilla implementation if zustand is missing, 
// but wait, I can just create a simple custom store.

const listeners = new Set<(state: NotificationStore) => void>();
let state: NotificationStore = {
    notifications: [],
    unreadCount: 0,
    addNotification: (n) => {
        const newNotif: Notification = {
            ...n,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            read: false,
        };
        state.notifications = [newNotif, ...state.notifications];
        state.unreadCount += 1;
        notify();
    },
    markAsRead: (id) => {
        state.notifications = state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        notify();
    },
    clearAll: () => {
        state.notifications = [];
        state.unreadCount = 0;
        notify();
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
        clearAll: state.clearAll
    }
};
