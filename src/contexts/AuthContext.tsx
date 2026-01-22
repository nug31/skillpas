import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../mocks/mockUsers';
import { authenticateUser } from '../mocks/mockUsers';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string, role?: 'student' | 'teacher') => Promise<boolean>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    isAuthenticated: boolean;
    isTeacher: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { supabase, isMockMode } from '../lib/supabase';

const AUTH_STORAGE_KEY = 'skill_passport_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load user from storage:', error);
        }
    }, []);

    const login = async (username: string, password: string, role?: 'student' | 'teacher'): Promise<boolean> => {
        if (!isMockMode) {
            if (role === 'student' || !role) {
                // Try production student login
                const { data: student, error } = await supabase
                    .from('siswa')
                    .select('*')
                    .or(`nama.eq."${username}",nisn.eq."${username}"`)
                    .eq('nisn', password)
                    .maybeSingle();

                if (student && !error) {
                    const authenticatedUser: User = {
                        id: student.id,
                        username: student.nisn || student.nama,
                        password: student.nisn || '',
                        name: student.nama,
                        role: 'student',
                        jurusan_id: student.jurusan_id,
                        kelas: student.kelas,
                        nisn: student.nisn,
                        avatar_url: student.avatar_url,
                        photo_url: student.photo_url
                    };
                    setUser(authenticatedUser);
                    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
                    // Dispatch auth change event so other components can reload data
                    window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'login', user: authenticatedUser } }));
                    return true;
                }
            }

            // For teachers/HODs/Admins in production, use the 'users' table
            const { data: staff, error: staffError } = await supabase
                .from('users')
                .select('*')
                .eq('username', username)
                .eq('password', password)
                .maybeSingle();

            if (staff && !staffError) {
                const authenticatedUser: User = {
                    id: staff.id,
                    username: staff.username,
                    password: staff.password,
                    name: staff.name,
                    role: staff.role as any,
                    jurusan_id: staff.jurusan_id,
                    kelas: staff.kelas,
                    avatar_url: staff.avatar_url,
                    photo_url: staff.photo_url
                };
                setUser(authenticatedUser);
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
                // Dispatch auth change event so other components can reload data
                window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'login', user: authenticatedUser } }));
                return true;
            }
        }

        const authenticatedUser = authenticateUser(username, password, role);

        if (authenticatedUser) {
            setUser(authenticatedUser);
            try {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
                // Dispatch auth change event so other components can reload data
                window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'login', user: authenticatedUser } }));
            } catch (error) {
                console.error('Failed to save user to storage:', error);
            }
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            // Clear all related app caches to ensure fresh state on next login
            localStorage.removeItem('skillpas_krs_submissions');
            // Dispatch auth change event so other components can reset
            window.dispatchEvent(new CustomEvent('auth-changed', { detail: { action: 'logout' } }));
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage'));

            // Persist to Supabase if not in mock mode
            if (!isMockMode) {
                // Determine if user is student or staff based on role
                const table = user.role === 'student' ? 'siswa' : 'users';

                // Only update fields that exist in DB columns roughly
                // For now, specifically targeting photo/avatar updates
                const dbUpdates: any = {};
                if (updates.photo_url !== undefined) dbUpdates.photo_url = updates.photo_url;
                if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;

                if (Object.keys(dbUpdates).length > 0) {
                    console.log(`[AuthContext] Attempting DB update for user ${user.id} in table ${table}`, dbUpdates);
                    console.log(`[AuthContext] isMockMode: ${isMockMode}`);

                    const { error, count, data } = await supabase
                        .from(table)
                        .update(dbUpdates)
                        .eq('id', user.id)
                        .select('id');

                    if (error) {
                        console.error(`[AuthContext] FAILED to persist user update to ${table}:`, error);
                    } else {
                        console.log(`[AuthContext] SUCCESS: Updated user in ${table}. Count: ${count ? count : 'N/A'}. Data:`, data);
                        if (!data || data.length === 0) {
                            console.warn(`[AuthContext] WARNING: Update succeeded but NO rows matched user ID ${user.id}. Is this a Mock User ID?`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Failed to update user in storage:', error);
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        updateUser,
        isAuthenticated: user !== null,
        isTeacher: user ? user.role !== 'student' : false,
        isStudent: user?.role === 'student' || false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
