export type UserRole = 'student' | 'teacher_produktif' | 'wali_kelas' | 'hod' | 'admin' | 'teacher';

export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: UserRole;
    jurusan_id?: string;
    kelas?: string;
    nisn?: string;
    avatar_url?: string;
    photo_url?: string;
}

import { JURUSAN_IDS } from './mockData';

// Mock users for authentication
export const mockUsers: User[] = [
    // Student accounts (one per jurusan)
    { id: 'u-s1', username: 'siswa_mesin', password: '123', name: 'Siswa Mesin', role: 'student', jurusan_id: JURUSAN_IDS.MESIN, avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop' },
    { id: 'u-s2', username: 'siswa_tkr', password: '123', name: 'Siswa TKR', role: 'student', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'u-s3', username: 'siswa_tsm', password: '123', name: 'Siswa TSM', role: 'student', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'u-s4', username: 'siswa_elind', password: '123', name: 'Siswa Elind', role: 'student', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'u-s5', username: 'siswa_listrik', password: '123', name: 'Siswa Listrik', role: 'student', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'u-s6', username: 'siswa_kimia', password: '123', name: 'Siswa Kimia', role: 'student', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'u-s7', username: 'siswa_akuntansi', password: '123', name: 'Siswa Akuntansi', role: 'student', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'u-s8', username: 'siswa_hotel', password: '123', name: 'Siswa Perhotelan', role: 'student', jurusan_id: JURUSAN_IDS.HOTEL },

    // Teacher accounts (one per jurusan)
    { id: 'u-g1', username: 'guru_mesin', password: '123', name: 'Guru Mesin', role: 'teacher', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'u-g2', username: 'guru_tkr', password: '123', name: 'Guru TKR', role: 'teacher', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'u-g3', username: 'guru_tsm', password: '123', name: 'Guru TSM', role: 'teacher', jurusan_id: JURUSAN_IDS.TSM },
    // New roles for approval workflow testing
    { id: 't1', username: 'guru1', password: '123', name: 'Budi Santoso, S.T.', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't2', username: 'guru2', password: '123', name: 'Siti Aminah, M.Pd.', role: 'wali_kelas', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't3', username: 'hod1', password: '123', name: 'Dr. Ir. Heru Prasetyo', role: 'hod', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 't4', username: 'admin', password: '123', name: 'Super Admin', role: 'admin' },
    // Student user for specific testing
    { id: 's-j1-user', username: 'siswa', password: '123', name: 'Raka Aditya', role: 'student', nisn: '0012345678', kelas: 'XII TKR 1', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'u-g4', username: 'guru_elind', password: '123', name: 'Guru Elind', role: 'teacher', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'u-g5', username: 'guru_listrik', password: '123', name: 'Guru Listrik', role: 'teacher', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'u-g6', username: 'guru_kimia', password: '123', name: 'Guru Kimia', role: 'teacher', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'u-g7', username: 'guru_akuntansi', password: '123', name: 'Guru Akuntansi', role: 'teacher', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'u-g8', username: 'guru_hotel', password: '123', name: 'Guru Perhotelan', role: 'teacher', jurusan_id: JURUSAN_IDS.HOTEL },

    // Admin teacher (can see all)
    { id: 'u-guru', username: 'guru', password: '123', name: 'Guru', role: 'teacher', photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' },

    // Admin account (can edit all departments)
    { id: 'u-admin', username: 'admin', password: '123', name: 'Administrator', role: 'admin' },

    // HOD Coordinator (can edit all departments)
    { id: 'u-koord-hod', username: 'koord_hod', password: '123', name: 'Aprilia Rahayu Wilujeng, S.Pd Gr', role: 'admin' },

    // HOD Accounts from user request
    { id: 'hod-tsm', username: 'hod_tsm', password: '123', name: 'Okxy Ixganda, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'hod-tkr', username: 'hod_tkr', password: '123', name: 'Abdillah Putra, A.Md', role: 'hod', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'hod-mesin', username: 'hod_mesin', password: '123', name: 'Dwi Nugroho, S.T', role: 'hod', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'hod-elektro', username: 'hod_elektro', password: '123', name: 'Heru Triatmo,S.Pd. Gr', role: 'hod', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'hod-akuntansi', username: 'hod_akuntansi', password: '123', name: 'Kiki Widia Swara,S.Pd. Gr', role: 'hod', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'hod-hotel', username: 'hod_hotel', password: '123', name: 'Refty Royan Juniarti, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.HOTEL },
    { id: 'hod-tki', username: 'hod_tki', password: '123', name: 'Ryo Maytana, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'hod-elin03', username: 'hod_elin03', password: '123', name: 'Eldha Luvy Zha, A.Md', role: 'hod', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'hod-tsm03', username: 'hod_tsm03', password: '123', name: 'Heri Supriyanto,S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'hod-tkr03', username: 'hod_tkr03', password: '123', name: 'Rahmat Hidayat, S.Pd.Gr', role: 'hod', jurusan_id: JURUSAN_IDS.TKR },
    { id: 't-joko-tkr', username: 'joko_tkr', password: '123', name: 'Joko Setyo Nugroho, S.T', role: 'teacher_produktif', kelas: 'XII TKR 3', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'hod-listrik-astri', username: 'hod_listrik', password: '123', name: 'Astri Afmi Wulandari, S.Pd', role: 'hod', jurusan_id: JURUSAN_IDS.LISTRIK },

    // Default Teacher Produktif accounts for all majors
    { id: 'p-mesin', username: 'prod_mesin', password: '123', name: 'Guru Produktif Mesin', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.MESIN },
    { id: 'p-tkr', username: 'prod_tkr', password: '123', name: 'Guru Produktif TKR', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.TKR },
    { id: 'p-tsm', username: 'prod_tsm', password: '123', name: 'Guru Produktif TSM', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.TSM },
    { id: 'p-elind', username: 'prod_elind', password: '123', name: 'Guru Produktif Elind', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.ELIND },
    { id: 'p-listrik', username: 'prod_listrik', password: '123', name: 'Guru Produktif Listrik', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.LISTRIK },
    { id: 'p-kimia', username: 'prod_kimia', password: '123', name: 'Guru Produktif Kimia', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.KIMIA },
    { id: 'p-akuntansi', username: 'prod_akuntansi', password: '123', name: 'Guru Produktif Akuntansi', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.AKUNTANSI },
    { id: 'p-hotel', username: 'prod_hotel', password: '123', name: 'Guru Produktif Perhotelan', role: 'teacher_produktif', jurusan_id: JURUSAN_IDS.HOTEL },
];

export function authenticateUser(username: string, password: string, selectedRole?: 'student' | 'teacher'): User | null {
    const user = mockUsers.find((u) => {
        const isUsernameMatch = u.username === username || u.name === username || (u.nisn && u.nisn === username);

        if (u.role === 'student') {
            // For students, NISN is the password
            const isPasswordMatch = u.password === password || (u.nisn && u.nisn === password);
            return isUsernameMatch && isPasswordMatch;
        } else {
            // For teachers/others, use their defined password
            return isUsernameMatch && u.password === password;
        }
    });

    if (user && selectedRole) {
        if (selectedRole === 'student' && user.role !== 'student') return null;
        if (selectedRole === 'teacher' && user.role === 'student') return null;
    }

    return user || null;
}
