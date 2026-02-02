import { useState, useEffect } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import { SiswaWithSkill, User } from '../types';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import {
    Search,
    ChevronRight,
    TrendingUp,
    Clock,
    LayoutDashboard,
    Users
} from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { StudentHistoryModal } from './StudentHistoryModal';

interface WalasDashboardProps {
    user: User;
    onBack: () => void;
}

export function WalasDashboard({ user, onBack }: WalasDashboardProps) {
    const [students, setStudents] = useState<SiswaWithSkill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<SiswaWithSkill | null>(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [jurusanList, setJurusanList] = useState<any[]>([]);

    const walasClasses = (user.kelas || '').split(',').map(c => c.trim()).filter(Boolean);

    useEffect(() => {
        loadClassData();
        loadSupportData();
        window.addEventListener(KRS_UPDATED_EVENT, loadClassData);
        return () => window.removeEventListener(KRS_UPDATED_EVENT, loadClassData);
    }, [user.id]);

    async function loadSupportData() {
        if (isMockMode) {
            setJurusanList(mockData.mockJurusan);
        } else {
            const { data: jData } = await supabase.from('jurusan').select('*');
            if (jData) setJurusanList(jData);
        }
    }

    async function loadClassData() {
        setLoading(true);
        try {
            if (isMockMode) {
                // Mock logic: Filter mockSiswa by class
                const classStudents = mockData.mockSiswa.filter(s =>
                    walasClasses.some(c => s.kelas.includes(c))
                );

                const enriched = classStudents.map((s: any) => {
                    const skill = mockData.mockSkillSiswa.find(ss => ss.siswa_id === s.id);
                    const score = skill?.skor || 0;
                    const level = mockData.mockLevels.find(l => score >= l.min_skor && score <= l.max_skor);
                    const history = (mockData as any).mockCompetencyHistory?.filter((h: any) => h.siswa_id === s.id) || [];
                    const discipline = mockData.mockDiscipline.find(d => d.siswa_id === s.id);

                    return {
                        ...s,
                        current_skor: score,
                        current_poin: skill?.poin || 0,
                        current_level: level,
                        riwayat_kompetensi: history,
                        discipline_data: discipline
                    } as SiswaWithSkill;
                });

                // Add KRS status
                const submissions = await krsStore.getSubmissions();
                const withKrs = enriched.map(s => {
                    const krs = submissions.find(k => k.siswa_id === s.id);
                    return { ...s, latest_krs: krs };
                });

                setStudents(withKrs as any);
            } else {
                // Supabase logic
                const { data: siswaData, error: siswaError } = await supabase
                    .from('siswa')
                    .select('*, skill_siswa(*), student_discipline(*)')
                    .in('kelas', walasClasses);

                if (siswaError) throw siswaError;

                const submissions = await krsStore.getSubmissions();

                const enriched = (siswaData || []).map(s => {
                    const mainSkill = s.skill_siswa?.[0];
                    const score = mainSkill?.skor || 0;
                    const krs = submissions.find(k => k.siswa_id === s.id);

                    return {
                        ...s,
                        current_skor: score,
                        current_poin: mainSkill?.poin || 0,
                        discipline_data: s.student_discipline?.[0],
                        latest_krs: krs
                    };
                });

                setStudents(enriched as any);
            }
        } catch (e) {
            console.error('Error loading Walas Dashboard data:', e);
        } finally {
            setLoading(false);
        }
    }

    const filteredStudents = students.filter(s =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: students.length,
        avgScore: students.length > 0
            ? (students.reduce((acc: number, s: any) => acc + (s.current_skor || 0), 0) / students.length).toFixed(1)
            : 0,
        activeKrs: students.filter((s: any) => s.latest_krs && s.latest_krs.status !== 'completed' && s.latest_krs.status !== 'rejected').length
    };

    return (
        <div className="min-h-screen bg-[color:var(--bg-from)] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200"
                        >
                            <LayoutDashboard className="w-5 h-5 [.theme-clear_&]:text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase [.theme-clear_&]:text-indigo-950">Walas Insight</h1>
                            <p className="text-slate-400 text-sm [.theme-clear_&]:text-slate-500">Monitoring perkembangan kompetensi siswa kelas {user.kelas}</p>
                        </div>
                    </div>

                    <div className="relative group w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200 [.theme-clear_&]:text-slate-900"
                        />
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="card-glass p-6 rounded-2xl border border-white/6 flex items-center gap-4 shadow-xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                        <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider [.theme-clear_&]:text-slate-500">Total Siswa</div>
                            <div className="text-2xl font-black text-white [.theme-clear_&]:text-slate-900">{stats.total}</div>
                        </div>
                    </div>

                    <div className="card-glass p-6 rounded-2xl border border-white/6 flex items-center gap-4 shadow-xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                        <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider [.theme-clear_&]:text-slate-500">Rerata Skor Kelas</div>
                            <div className="text-2xl font-black text-white [.theme-clear_&]:text-slate-900">{stats.avgScore} <span className="text-xs font-normal opacity-50">XP</span></div>
                        </div>
                    </div>

                    <div className="card-glass p-6 rounded-2xl border border-white/6 flex items-center gap-4 shadow-xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                        <div className="p-3 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider [.theme-clear_&]:text-slate-500">Sertifikasi Aktif</div>
                            <div className="text-2xl font-black text-white [.theme-clear_&]:text-slate-900">{stats.activeKrs} <span className="text-xs font-normal opacity-50">Antrean</span></div>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="card-glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 [.theme-clear_&]:bg-slate-50 [.theme-clear_&]:border-slate-200">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest [.theme-clear_&]:text-slate-500">Siswa</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest [.theme-clear_&]:text-slate-500">Level & Progres</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest [.theme-clear_&]:text-slate-500">KRS Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest [.theme-clear_&]:text-slate-500">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 [.theme-clear_&]:divide-slate-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading class data...</td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Tidak ada siswa ditemukan</td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((siswa: any) => (
                                        <tr key={siswa.id} className="hover:bg-white/2 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <ProfileAvatar
                                                        name={siswa.nama}
                                                        avatarUrl={siswa.avatar_url}
                                                        photoUrl={siswa.photo_url}
                                                        size="sm"
                                                        className="shadow-md"
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-white [.theme-clear_&]:text-slate-900">{siswa.nama}</div>
                                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{siswa.nisn || 'No NISN'} • {siswa.kelas}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-xs font-bold text-indigo-400 [.theme-clear_&]:text-indigo-700">Level {siswa.current_level?.urutan || 1}</span>
                                                        <span className="text-[10px] font-black text-white/40 [.theme-clear_&]:text-slate-400 uppercase">{siswa.current_skor} XP</span>
                                                    </div>
                                                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden [.theme-clear_&]:bg-slate-100">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm transition-all duration-1000"
                                                            style={{ width: `${siswa.current_skor}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {siswa.latest_krs ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider self-start ${siswa.latest_krs.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                siswa.latest_krs.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                                    siswa.latest_krs.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
                                                                        'bg-amber-500/20 text-amber-400'
                                                            }`}>
                                                            {siswa.latest_krs.status === 'pending_produktif' ? 'Review Guru' :
                                                                siswa.latest_krs.status === 'pending_hod' ? 'Review HOD' :
                                                                    siswa.latest_krs.status === 'scheduled' ? 'Tunggu Ujian' :
                                                                        siswa.latest_krs.status === 'completed' ? 'Selesai' :
                                                                            'Ditolak'}
                                                        </div>
                                                        <div className="text-[9px] text-slate-500 font-medium lowercase italic">Update: {new Date(siswa.latest_krs.updated_at).toLocaleDateString()}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-500/40 font-bold uppercase italic">Bila ada pengajuan...</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(siswa);
                                                        setShowHistoryModal(true);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 group-hover:border-indigo-500/50 [.theme-clear_&]:bg-slate-100 [.theme-clear_&]:text-slate-700 [.theme-clear_&]:border-slate-200"
                                                >
                                                    Lihat Passport
                                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedStudent && (
                <StudentHistoryModal
                    isOpen={showHistoryModal}
                    onClose={() => setShowHistoryModal(false)}
                    studentName={selectedStudent.nama}
                    studentNisn={selectedStudent.nisn}
                    studentKelas={selectedStudent.kelas}
                    avatarUrl={selectedStudent.avatar_url}
                    photoUrl={selectedStudent.photo_url}
                    jurusanName={jurusanList.find(j => j.id === selectedStudent.jurusan_id)?.nama_jurusan || 'Jurusan'}
                    history={selectedStudent.riwayat_kompetensi || []}
                    levels={mockData.getLevelsForJurusan(selectedStudent.jurusan_id)}
                    hodName={undefined}
                    walasName={user.name}
                />
            )}
        </div>
    );
}
