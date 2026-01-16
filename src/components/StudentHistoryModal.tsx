import React from 'react';
import type { CompetencyHistory, LevelSkill, SiswaWithSkill } from '../types';
import { PassportBook } from './Passport/PassportBook';

interface StudentHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentName: string;
    studentNisn?: string;
    studentKelas: string;
    avatarUrl?: string; // New prop
    photoUrl?: string; // New prop
    jurusanName: string;
    history: CompetencyHistory[];
    levels: LevelSkill[];
    hodName?: string;
    walasName?: string; // New prop
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
    isOpen,
    onClose,
    studentName,
    studentNisn,
    studentKelas,
    avatarUrl,
    photoUrl,
    jurusanName,
    history,
    levels,
    hodName,
    walasName
}) => {
    if (!isOpen) return null;

    // Construct a SiswaWithSkill object for the PassportBook
    const studentData: SiswaWithSkill = {
        id: 'current-user', // wrapper id, not critical for display
        nama: studentName,
        nisn: studentNisn,
        kelas: studentKelas,
        jurusan_id: '', // Not critical for display as we pass jurusanName
        created_at: '',
        riwayat_kompetensi: history,
        avatar_url: avatarUrl,
        photo_url: photoUrl,
        skill_siswa: [] // Not needed for passport display currently
    };

    return (
        <PassportBook
            siswa={studentData}
            jurusanName={jurusanName}
            levels={levels}
            onClose={onClose}
            hodName={hodName}
            walasName={walasName}
        />
    );
};
