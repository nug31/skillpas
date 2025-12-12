export interface User {
    id: string;
    username: string;
    password: string;
    name: string;
    role: 'student' | 'teacher';
    jurusan_id?: string;
}

// Mock users for authentication
export const mockUsers: User[] = [
    // Student accounts (one per jurusan)
    { id: 'u-s1', username: 'siswa_mesin', password: '123', name: 'Siswa Mesin', role: 'student', jurusan_id: 'j1' },
    { id: 'u-s2', username: 'siswa_tkr', password: '123', name: 'Siswa TKR', role: 'student', jurusan_id: 'j2' },
    { id: 'u-s3', username: 'siswa_tsm', password: '123', name: 'Siswa TSM', role: 'student', jurusan_id: 'j3' },
    { id: 'u-s4', username: 'siswa_elind', password: '123', name: 'Siswa Elind', role: 'student', jurusan_id: 'j4' },
    { id: 'u-s5', username: 'siswa_listrik', password: '123', name: 'Siswa Listrik', role: 'student', jurusan_id: 'j5' },
    { id: 'u-s6', username: 'siswa_kimia', password: '123', name: 'Siswa Kimia', role: 'student', jurusan_id: 'j6' },
    { id: 'u-s7', username: 'siswa_akuntansi', password: '123', name: 'Siswa Akuntansi', role: 'student', jurusan_id: 'j7' },
    { id: 'u-s8', username: 'siswa_hotel', password: '123', name: 'Siswa Perhotelan', role: 'student', jurusan_id: 'j8' },

    // Teacher accounts (one per jurusan)
    { id: 'u-g1', username: 'guru_mesin', password: '123', name: 'Guru Mesin', role: 'teacher', jurusan_id: 'j1' },
    { id: 'u-g2', username: 'guru_tkr', password: '123', name: 'Guru TKR', role: 'teacher', jurusan_id: 'j2' },
    { id: 'u-g3', username: 'guru_tsm', password: '123', name: 'Guru TSM', role: 'teacher', jurusan_id: 'j3' },
    { id: 'u-g4', username: 'guru_elind', password: '123', name: 'Guru Elind', role: 'teacher', jurusan_id: 'j4' },
    { id: 'u-g5', username: 'guru_listrik', password: '123', name: 'Guru Listrik', role: 'teacher', jurusan_id: 'j5' },
    { id: 'u-g6', username: 'guru_kimia', password: '123', name: 'Guru Kimia', role: 'teacher', jurusan_id: 'j6' },
    { id: 'u-g7', username: 'guru_akuntansi', password: '123', name: 'Guru Akuntansi', role: 'teacher', jurusan_id: 'j7' },
    { id: 'u-g8', username: 'guru_hotel', password: '123', name: 'Guru Perhotelan', role: 'teacher', jurusan_id: 'j8' },

    // Admin teacher (can see all)
    { id: 'u-guru', username: 'guru', password: '123', name: 'Guru', role: 'teacher' },
];

export function authenticateUser(username: string, password: string, selectedRole?: 'student' | 'teacher'): User | null {
    const user = mockUsers.find(
        (u) => u.username === username && u.password === password
    );

    // If role is specified, validate it matches the user's actual role
    if (user && selectedRole && user.role !== selectedRole) {
        return null; // Role mismatch - login fails
    }

    return user || null;
}
