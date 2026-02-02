import React, { useEffect, useState } from 'react';
import { supabase, isMockMode } from '../../lib/supabase';
import mockData from '../../mocks/mockData';
import { PassportBook } from './PassportBook';
import type { SiswaWithSkill, LevelSkill } from '../../types';
import { Loader2, AlertCircle, Home } from 'lucide-react';

interface PassportPublicViewProps {
    siswaId: string;
}

export const PassportPublicView: React.FC<PassportPublicViewProps> = ({ siswaId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studentData, setStudentData] = useState<SiswaWithSkill | null>(null);
    const [levels, setLevels] = useState<LevelSkill[]>([]);
    const [jurusanName, setJurusanName] = useState('');
    const [hodName, setHodName] = useState<string | undefined>(undefined);
    const [walasName, setWalasName] = useState<string>('');

    const useMock = isMockMode;

    useEffect(() => {
        fetchData();
    }, [siswaId]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (useMock) {
                // Mock Implementation
                const student = mockData.mockSiswa.find(s => s.id === siswaId);
                if (!student) throw new Error('Siswa tidak ditemukan');

                const jurusan = mockData.mockJurusan.find(j => j.id === student.jurusan_id);
                setJurusanName(jurusan?.nama_jurusan || 'Teknik');

                const skill = mockData.mockSkillSiswa.find(ss => ss.siswa_id === student.id);
                const score = skill?.skor || 0;

                const levelsForJurusan = mockData.getLevelsForJurusan(student.jurusan_id);
                setLevels(levelsForJurusan);

                const currentLevel = levelsForJurusan.find(l => score >= l.min_skor && score <= l.max_skor);

                const history = (mockData as any).mockCompetencyHistory?.filter((r: any) => r.siswa_id === student.id) || [];

                setStudentData({
                    ...student,
                    skill_siswa: skill ? [skill] : [],
                    riwayat_kompetensi: history,
                    current_level: currentLevel,
                    current_skor: score
                });

                setWalasName('Sri Wahyuni, S.Pd'); // Mock fallback
            } else {
                // Supabase Implementation
                const { data: student, error: sErr } = await supabase
                    .from('siswa')
                    .select('*, skill_siswa(skor, poin), jurusan(nama_jurusan)')
                    .eq('id', siswaId)
                    .single();

                if (sErr || !student) throw new Error('Siswa tidak ditemukan');

                setJurusanName((student as any).jurusan?.nama_jurusan || 'Teknik');

                const levelsRes = await supabase
                    .from('level_skill')
                    .select('*')
                    .order('urutan');

                // Note: ideally we'd use getLevelsForJurusan equivalent logic here
                const rawLevels = (levelsRes.data || []) as any[];
                setLevels(rawLevels.map(l => ({
                    ...l,
                    criteria: l.hasil_belajar ? (l.hasil_belajar.startsWith('[') ? JSON.parse(l.hasil_belajar) : [l.hasil_belajar]) : []
                })));

                const { data: historyData } = await supabase
                    .from('competency_history')
                    .select('*')
                    .eq('siswa_id', siswaId)
                    .order('tanggal', { ascending: false });

                setStudentData({
                    ...student,
                    riwayat_kompetensi: historyData || []
                } as any);

                // Fetch HOD
                const { data: hodData } = await supabase
                    .from('users')
                    .select('name')
                    .eq('role', 'hod')
                    .eq('jurusan_id', student.jurusan_id)
                    .maybeSingle();

                if (hodData) setHodName(hodData.name);

                // Fetch Walas
                const { data: walasData } = await supabase
                    .from('users')
                    .select('name')
                    .in('role', ['wali_kelas', 'teacher_produktif', 'teacher'])
                    .eq('kelas', student.kelas)
                    .maybeSingle();

                if (walasData) setWalasName(walasData.name);
            }
        } catch (err: any) {
            console.error('Passport Visit Error:', err);
            setError(err.message || 'Gagal memuat data paspor');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Memverifikasi Paspor...</h2>
                <p className="text-slate-400 text-sm">Mohon tunggu sebentar.</p>
            </div>
        );
    }

    if (error || !studentData) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verifikasi Gagal</h2>
                <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                    {error || 'Data paspor tidak ditemukan atau link sudah tidak berlaku.'}
                </p>
                <a
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                    <Home className="w-4 h-4" /> Kembali ke Beranda
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Technical Passport
                </div>
                <h1 className="text-white text-3xl font-black tracking-tight mb-2">VALIDASI KOMPETENSI</h1>
                <p className="text-slate-400 text-sm">Dokumen ini merupakan catatan resmi kompetensi industri siswa SMK Mitra Industri MM2100.</p>
            </div>

            <div className="flex justify-center">
                <PassportBook
                    siswa={studentData}
                    jurusanName={jurusanName}
                    levels={levels}
                    onClose={() => window.location.href = '/'}
                    hodName={hodName}
                    walasName={walasName}
                />
            </div>

            <div className="mt-12 text-center">
                <p className="text-slate-500 text-[10px] font-medium tracking-[0.2em] uppercase">© 2026 Skill Passport System • SMK Mitra Industri MM2100</p>
            </div>
        </div>
    );
};
