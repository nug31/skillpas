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
                    return true;
                }
            }

            // For teachers in production, we might need a separate table or Auth,
            // but for now, if it's not a student, we might still fall back to mock or fail.
            // Let's assume teachers are also in a table or wait for instructions.
        }

        const authenticatedUser = authenticateUser(username, password, role);

        if (authenticatedUser) {
            setUser(authenticatedUser);
            try {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
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
        } catch (error) {
            console.error('Failed to remove user from storage:', error);
        }
    };

    const updateUser = (updates: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
            // Trigger storage event for other components if needed
            window.dispatchEvent(new Event('storage'));
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
