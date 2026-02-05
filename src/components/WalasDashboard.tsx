import { useState, useEffect } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import mockData from '../mocks/mockData';
import { SiswaWithSkill, User, Siswa, LevelSkill } from '../types';
import { krsStore, KRS_UPDATED_EVENT } from '../lib/krsStore';
import {
    Search,
    ChevronRight,
    TrendingUp,
    Clock,
    LayoutDashboard,
    Users,
    Download,
    FileSpreadsheet,
    Printer
} from 'lucide-react';
import { ProfileAvatar } from './ProfileAvatar';
import { StudentHistoryModal } from './StudentHistoryModal';
import { StudentDetailModal } from './StudentDetailModal';
import { AnalyticsPanel } from './AnalyticsPanel';
import { ReportView } from './ReportView';
import { exportToExcel, exportToCSV, generateReportFilename } from '../lib/exportUtils';

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [jurusanList, setJurusanList] = useState<any[]>([]);
    const [levels, setLevels] = useState<LevelSkill[]>([]);
    const [showReportView, setShowReportView] = useState(false);

    const normalizeClassName = (name: string) => {
        if (!name) return '';
        return name.toUpperCase()
            .replace(/ELIND/g, 'ELIN')
            .replace(/TBSM/g, 'TSM')
            .replace(/AKUNTANSI/g, 'AK')
            .replace(/PERHOTELAN/g, 'HOTEL')
            .replace(/TKI/g, 'KIMIA')
            .replace(/BIKE/g, 'TSM')
            .replace(/MESIN/g, 'MES')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const walasClasses = (user.kelas || '').split(',').map(c => c.trim()).filter(Boolean);
    const normalizedWalasClasses = walasClasses.map(normalizeClassName);

    useEffect(() => {
        loadClassData();
        loadSupportData();
        window.addEventListener(KRS_UPDATED_EVENT, loadClassData);
        return () => window.removeEventListener(KRS_UPDATED_EVENT, loadClassData);
    }, [user.id]);

    async function loadSupportData() {
        if (isMockMode) {
            setJurusanList(mockData.mockJurusan);
            setLevels(mockData.mockLevels);
        } else {
            const { data: jData } = await supabase.from('jurusan').select('*');
            if (jData) setJurusanList(jData);

            // Fetch levels and overrides for this jurusan
            const { data: lData } = await supabase.from('level_skill').select('*').order('urutan');
            const { data: lsjData } = await supabase.from('level_skill_jurusan').select('*').eq('jurusan_id', user.jurusan_id);

            if (lData) {
                const enriched = (lData as any[]).map((l: any) => {
                    const ov = lsjData?.find((o: any) => o.level_id === l.id);
                    let criteria = l.criteria;
                    const hasilBelajar = ov?.hasil_belajar || l.hasil_belajar;

                    if (hasilBelajar) {
                        try {
                            if (typeof hasilBelajar === 'string' && hasilBelajar.trim().startsWith('[')) {
                                criteria = JSON.parse(hasilBelajar);
                            } else if (Array.isArray(hasilBelajar)) {
                                criteria = hasilBelajar;
                            } else if (typeof hasilBelajar === 'string') {
                                criteria = [hasilBelajar];
                            }
                        } catch (e) {
                            criteria = [hasilBelajar];
                        }
                    }

                    return {
                        ...l,
                        hasil_belajar: hasilBelajar,
                        criteria: criteria,
                        soft_skill: ov?.soft_skill || l.soft_skill
                    } as LevelSkill;
                });
                setLevels(enriched);
            }
        }
    }

    async function loadClassData() {
        setLoading(true);
        try {
            if (isMockMode) {
                // Mock logic: Filter mockSiswa by normalized class
                const classStudents = mockData.mockSiswa.filter(s =>
                    normalizedWalasClasses.some(wc => normalizeClassName(s.kelas) === wc)
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
                // Supabase logic: Fetch students by jurusan_id to be inclusive, then filter in frontend
                const { data: siswaData, error: siswaError } = await supabase
                    .from('siswa')
                    .select('*, skill_siswa(*), competency_history(*)')
                    .eq('jurusan_id', user.jurusan_id);

                if (siswaError) throw siswaError;

                // Fetch discipline data separately to avoid relationship cache issues
                const studentIds = (siswaData || []).map((s: Siswa) => s.id);
                const { data: disciplineData } = studentIds.length > 0
                    ? await supabase
                        .from('student_discipline')
                        .select('*')
                        .in('siswa_id', studentIds)
                    : { data: [] };

                const submissions = await krsStore.getSubmissions();

                const availableClasses = Array.from(new Set((siswaData || []).map((s: any) => s.kelas))).sort();

                console.log('Class Data Loading Debug:', {
                    userJurusanId: user.jurusan_id,
                    userKelas: user.kelas,
                    normalizedWalasClasses,
                    totalSiswaAtJurusan: siswaData?.length || 0,
                    availableClasses,
                    matchAttempt: {
                        target: normalizedWalasClasses[0],
                        foundRaw: (siswaData || []).some((s: any) => s.kelas === user.kelas),
                        foundNormalized: (siswaData || []).some((s: any) => normalizeClassName(s.kelas) === normalizedWalasClasses[0])
                    }
                });

                // Advanced filtering: match based on normalized class names
                const filteredSiswa = (siswaData || []).filter((s: any) => {
                    const normalizedSiswaKelas = normalizeClassName(s.kelas);
                    const isMatch = normalizedWalasClasses.some(wc => normalizedSiswaKelas === wc);
                    return isMatch;
                });

                console.log('Filter Result:', {
                    filteredCount: filteredSiswa.length,
                    filteredNames: filteredSiswa.map(s => s.nama)
                });

                const enriched = filteredSiswa.map((s: any) => {
                    const mainSkill = s.skill_siswa?.[0];
                    const score = mainSkill?.skor || 0;
                    const krs = submissions.find(k => k.siswa_id === s.id);
                    const disc = (disciplineData || []).find((d: any) => d.siswa_id === s.id);
                    const history = s.competency_history || [];
                    const currentLevel = levels.find(l => score >= l.min_skor && score <= l.max_skor);

                    return {
                        ...s,
                        current_skor: score,
                        current_poin: mainSkill?.poin || 0,
                        current_level: currentLevel,
                        discipline_data: disc,
                        latest_krs: krs,
                        riwayat_kompetensi: history
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

    async function handleUpdateStudent(id: string, nama: string, kelas: string, poin: number) {
        try {
            if (isMockMode) {
                const index = mockData.mockSiswa.findIndex(s => s.id === id);
                if (index >= 0) {
                    mockData.mockSiswa[index] = { ...mockData.mockSiswa[index], nama, kelas };
                }
                const sIndex = mockData.mockSkillSiswa.findIndex(s => s.siswa_id === id);
                if (sIndex >= 0) {
                    mockData.mockSkillSiswa[sIndex] = { ...mockData.mockSkillSiswa[sIndex], poin };
                }
            } else {
                const { error: sError } = await supabase
                    .from('siswa')
                    .update({ nama, kelas })
                    .eq('id', id);
                if (sError) throw sError;

                // Update points in skill_siswa
                const { error: skError } = await supabase
                    .from('skill_siswa')
                    .update({ poin })
                    .eq('siswa_id', id);
                if (skError) throw skError;
            }

            // Update local state for the modal immediately
            if (selectedStudent && selectedStudent.id === id) {
                setSelectedStudent(prev => prev ? {
                    ...prev,
                    nama,
                    kelas,
                    current_poin: poin
                } : null);
            }

            await loadClassData();
        } catch (e: any) {
            console.error('Error updating student:', e);
            alert('Gagal memperbarui data: ' + (e.message || 'Unknown error'));
        }
    }

    const filteredStudents = students.filter(s =>
        s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.kelas.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.nama.localeCompare(b.nama));

    const stats = {
        total: students.length,
        avgScore: students.length > 0
            ? (students.reduce((acc: number, s: any) => acc + (s.current_skor || 0), 0) / students.length).toFixed(1)
            : 0,
        activeKrs: students.filter((s: any) => s.latest_krs && s.latest_krs.status !== 'completed' && s.latest_krs.status !== 'rejected').length
    };

    const handleExportExcel = () => {
        const filename = generateReportFilename(user.kelas || 'Kelas', 'xlsx');
        exportToExcel(students, filename);
    };

    const handleExportCSV = () => {
        const filename = generateReportFilename(user.kelas || 'Kelas', 'csv');
        exportToCSV(students, filename);
    };

    const handlePrintReport = () => {
        setShowReportView(true);
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

                    <div className="flex flex-wrap gap-2">
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors sm:block hidden" />
                            <input
                                type="text"
                                placeholder="Cari siswa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-all text-sm [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200 [.theme-clear_&]:text-slate-900"
                            />
                        </div>
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-bold transition-all border border-emerald-500/20 hover:border-emerald-500/40 [.theme-clear_&]:bg-emerald-50 [.theme-clear_&]:text-emerald-700 [.theme-clear_&]:border-emerald-200"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            <span className="hidden sm:inline">Excel</span>
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl text-sm font-bold transition-all border border-blue-500/20 hover:border-blue-500/40 [.theme-clear_&]:bg-blue-50 [.theme-clear_&]:text-blue-700 [.theme-clear_&]:border-blue-200"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">CSV</span>
                        </button>
                        <button
                            onClick={handlePrintReport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl text-sm font-bold transition-all border border-amber-500/20 hover:border-amber-500/40 [.theme-clear_&]:bg-amber-50 [.theme-clear_&]:text-amber-700 [.theme-clear_&]:border-amber-200"
                        >
                            <Printer className="w-4 h-4" />
                            <span className="hidden sm:inline">Cetak</span>
                        </button>
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
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider [.theme-clear_&]:text-slate-500">Rata-rata Skor Kelas</div>
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

                {/* Students Table - Desktop */}
                <div className="hidden md:block card-glass border border-white/10 rounded-3xl overflow-hidden shadow-2xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
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
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(siswa);
                                                            setShowHistoryModal(true);
                                                        }}
                                                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 group-hover:border-indigo-500/50 [.theme-clear_&]:bg-slate-100 [.theme-clear_&]:text-slate-700 [.theme-clear_&]:border-slate-200"
                                                    >
                                                        Lihat Passport
                                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStudent(siswa);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 hover:border-indigo-500/40 [.theme-clear_&]:bg-indigo-50 [.theme-clear_&]:text-indigo-700"
                                                    >
                                                        Kelola & Hadir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Students Cards - Mobile */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="card-glass p-8 rounded-2xl text-center text-slate-500 animate-pulse [.theme-clear_&]:bg-white">
                            Loading class data...
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="card-glass p-8 rounded-2xl text-center text-slate-500 [.theme-clear_&]:bg-white">
                            Tidak ada siswa ditemukan
                        </div>
                    ) : (
                        filteredStudents.map((siswa: any) => (
                            <div key={siswa.id} className="card-glass border border-white/10 rounded-2xl p-4 space-y-4 shadow-xl [.theme-clear_&]:bg-white [.theme-clear_&]:border-slate-200">
                                {/* Student Info */}
                                <div className="flex items-center gap-3">
                                    <ProfileAvatar
                                        name={siswa.nama}
                                        avatarUrl={siswa.avatar_url}
                                        photoUrl={siswa.photo_url}
                                        size="md"
                                        className="shadow-md"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white [.theme-clear_&]:text-slate-900">{siswa.nama}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase">{siswa.nisn || 'No NISN'}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{siswa.kelas}</div>
                                    </div>
                                </div>

                                {/* Level & Progress */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-indigo-400 [.theme-clear_&]:text-indigo-700">Level {siswa.current_level?.urutan || 1}</span>
                                        <span className="text-xs font-black text-white/60 [.theme-clear_&]:text-slate-500">{siswa.current_skor} <span className="text-[10px]">XP</span></span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden [.theme-clear_&]:bg-slate-100">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 shadow-sm transition-all duration-1000"
                                            style={{ width: `${siswa.current_skor}%` }}
                                        />
                                    </div>
                                </div>

                                {/* KRS Status */}
                                {siswa.latest_krs && (
                                    <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg [.theme-clear_&]:bg-slate-50">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status KRS</span>
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${siswa.latest_krs.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
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
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedStudent(siswa);
                                            setShowHistoryModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 [.theme-clear_&]:bg-slate-100 [.theme-clear_&]:text-slate-700 [.theme-clear_&]:border-slate-200"
                                    >
                                        Passport
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedStudent(siswa);
                                            setShowEditModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-indigo-500/20 hover:border-indigo-500/40 [.theme-clear_&]:bg-indigo-50 [.theme-clear_&]:text-indigo-700"
                                    >
                                        Kelola
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Analytics Panel */}
                <AnalyticsPanel students={filteredStudents} />
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
                    levels={levels.length > 0 ? levels : mockData.getLevelsForJurusan(selectedStudent.jurusan_id)}
                    hodName={undefined}
                    walasName={user.name}
                />
            )}

            {selectedStudent && showEditModal && (
                <StudentDetailModal
                    student={{
                        ...selectedStudent,
                        skor: selectedStudent.current_skor || 0,
                        poin: selectedStudent.current_poin || 0,
                        level_name: selectedStudent.current_level?.nama_level || 'Level 1',
                        badge_color: selectedStudent.current_level?.badge_color || '#94a3b8',
                        badge_name: selectedStudent.current_level?.badge_name || 'Basic'
                    } as any}
                    levels={levels}
                    jurusanName={jurusanList.find(j => j.id === selectedStudent.jurusan_id)?.nama_jurusan}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdateStudent}
                />
            )}

            {showReportView && (
                <ReportView
                    students={filteredStudents}
                    kelas={user.kelas || ''}
                    walasName={user.name}
                    onClose={() => setShowReportView(false)}
                />
            )}
        </div>
    );
}
