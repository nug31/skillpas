import { useState, useEffect } from 'react';
import { X, Clock, Pencil, Save, Check, CreditCard, Download } from 'lucide-react';
import type { StudentListItem, LevelSkill, StudentDiscipline } from '../types';
import { generateCertificate } from '../lib/certificateGenerator';
import { supabase, isMockMode } from '../lib/supabase';
import { mockDiscipline } from '../mocks/mockData';
import { useAuth } from '../contexts/AuthContext';
import formatClassLabel from '../lib/formatJurusan';
import { ProfileAvatar } from './ProfileAvatar';
import { SkillCard } from './SkillCard';

export function StudentDetailModal({
  student,
  levels,
  onClose,
  jurusanName,
  onUpdate,
}: {
  student: StudentListItem;
  levels: LevelSkill[];
  onClose: () => void;
  jurusanName?: string;
  onUpdate?: (id: string, nama: string, kelas: string, poin: number) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.nama);
  const [editKelas, setEditKelas] = useState(student.kelas);
  const [editPoin, setEditPoin] = useState(student.poin);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [showSkillCard, setShowSkillCard] = useState(false);
  const { user } = useAuth();
  const [discipline, setDiscipline] = useState<StudentDiscipline | null>(null);

  // Edit states for discipline
  const [editAttendance, setEditAttendance] = useState(0);
  const [editMasuk, setEditMasuk] = useState(0);
  const [editIzin, setEditIzin] = useState(0);
  const [editSakit, setEditSakit] = useState(0);
  const [editAlfa, setEditAlfa] = useState(0);
  const [editAttitude, setEditAttitude] = useState<{ aspect: string, score: number }[]>([]);

  // Check if current user can edit this student
  const canEdit = user?.role === 'admin' ||
    user?.role === 'hod' ||
    (user?.role === 'wali_kelas' && user.kelas === student.kelas) ||
    (user?.role === 'teacher_produktif');

  // HOD Name state
  const [hodName, setHodName] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch HOD name based on student.jurusan_id
    const fetchHOD = async () => {
      if (!student.jurusan_id) return;

      // Mock Mode: check if we have mock HOD data (hardcoded fallback or extends mockData logic)
      // For simplicity in mock, we might just leave undefined or use a mock name if needed.
      // But the user specific asked to "ambil dari database saja" which implies real DB usage.

      if (!isMockMode) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('name')
            .eq('role', 'hod')
            .eq('jurusan_id', student.jurusan_id)
            .single();

          if (data && data.name) {
            setHodName(data.name);
          } else if (error) {
            console.error("Error fetching HOD:", error);
          }
        } catch (err) {
          console.error("Failed to fetch HOD", err);
        }
      }
    };
    fetchHOD();
  }, [student.jurusan_id]);

  useEffect(() => {
    // Load discipline data
    const data = mockDiscipline.find(d => d.siswa_id === student.id);
    if (data) {
      setDiscipline(data);
      setEditAttendance(data.attendance_pcent);
      setEditMasuk(data.masuk || 0);
      setEditIzin(data.izin || 0);
      setEditSakit(data.sakit || 0);
      setEditAlfa(data.alfa || 0);
      setEditAttitude(JSON.parse(JSON.stringify(data.attitude_scores)));
    } else {
      // Default template
      const defaultData = {
        id: `new-${student.id}`,
        siswa_id: student.id,
        attendance_pcent: 80,
        masuk: 0,
        izin: 0,
        sakit: 0,
        alfa: 0,
        attitude_scores: [
          { aspect: 'Disiplin', score: 75 },
          { aspect: 'Tanggung Jawab', score: 75 },
          { aspect: 'Jujur', score: 75 },
          { aspect: 'Kerjasama', score: 75 },
          { aspect: 'Peduli', score: 75 }
        ],
        updated_at: new Date().toISOString()
      };
      setDiscipline(defaultData as any);
      setEditAttendance(80);
      setEditMasuk(0);
      setEditIzin(0);
      setEditSakit(0);
      setEditAlfa(0);
      setEditAttitude(defaultData.attitude_scores);
    }
  }, [student.id]);

  const handleSaveDiscipline = () => {
    if (discipline) {
      const updated = {
        ...discipline,
        attendance_pcent: editAttendance,
        masuk: editMasuk,
        izin: editIzin,
        sakit: editSakit,
        alfa: editAlfa,
        attitude_scores: editAttitude,
        updated_at: new Date().toISOString()
      };
      setDiscipline(updated);
      // In a real app we would update the store/backend here
      const index = mockDiscipline.findIndex(d => d.siswa_id === student.id);
      if (index >= 0) {
        mockDiscipline[index] = updated;
      } else {
        mockDiscipline.push(updated);
      }
      setIsEditing(false); // Reuse editing state or create separate? 
      // Let's use the main isEditing state for simplicity if acceptable, 
      // but the code uses isEditing for name/class currently. 
      // Let's assume isEditing is global for the modal content?
      // Actually, line 61 uses isEditing for Name/Class. 
      // Let's create a separate isEditingDiscipline state if needed or reuse isEditing for all.
      // Current code for Save button (line 100) calls handleSave. 
      // Let's piggyback or add a saving logic.
    }
  };

  // Determine the student's achieved level based on score
  const achievedLevels = levels.filter((l) => student.skor >= l.min_skor);
  const notAchieved = levels.filter((l) => student.skor < l.min_skor);

  const handleSave = async () => {
    // Save discipline data if valid
    handleSaveDiscipline();

    if (!onUpdate) return;
    try {
      setSaving(true);
      await onUpdate(student.id, editName, editKelas, editPoin);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  // Helper for rich text rendering (**bold** and \n)
  const renderRichText = (text: string) => {
    if (!text) return null;

    // Handle JSON array or single string
    let processedText = text;
    try {
      if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
        const parsed = JSON.parse(text);
        processedText = Array.isArray(parsed) ? parsed.join('\n') : text;
      }
    } catch (e) {
      // Not JSON or parse error, use original
    }

    const segments = processedText.split(/(\*\*.*?\*\*)/g);
    return segments.map((segment, index) => {
      if (segment.startsWith('**') && segment.endsWith('**')) {
        return <strong key={index} className="font-black text-[color:var(--text-primary)]">{segment.slice(2, -2)}</strong>;
      }
      return segment.split('\n').map((line, i) => (
        <span key={`${index}-${i}`}>
          {i > 0 && <br />}
          {line}
        </span>
      ));
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-4 sm:py-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl bg-slate-900 [.theme-clear_&]:bg-white border border-white/20 [.theme-clear_&]:border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 flex items-start justify-between px-6 py-4 border-b border-white/10 [.theme-clear_&]:border-slate-200">
          <div className="flex flex-1 items-center gap-4 mr-4">
            <ProfileAvatar
              name={student.nama}
              avatarUrl={(student as any).avatar_url}
              photoUrl={(student as any).photo_url}
              level={student.level_name}
              variant="professional"
              size="md"
              jurusanColor={student.badge_color}
            />
            <div className="flex-1">
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-[color:var(--text-muted)] block mb-1">Nama Siswa</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-[color:var(--text-primary)] font-semibold"
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-xs text-[color:var(--text-muted)] block mb-1">Kelas</label>
                    <input
                      value={editKelas}
                      onChange={(e) => setEditKelas(e.target.value)}
                      className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-[color:var(--text-primary)]"
                    />
                  </div>
                  {['wali_kelas', 'hod', 'admin'].includes(user?.role || '') && (
                    <div className="w-24">
                      <label className="text-xs text-[color:var(--text-muted)] block mb-1">Poin</label>
                      <input
                        type="number"
                        value={editPoin}
                        onChange={(e) => setEditPoin(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-[color:var(--text-primary)] font-bold text-[color:var(--accent-1)]"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                    {student.nama}
                    {onUpdate && !isEditing && canEdit && (
                      <button onClick={() => setIsEditing(true)} className="p-1 text-[color:var(--text-muted)] hover:text-[color:var(--accent-1)] transition-colors" title="Edit Data">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-[color:var(--text-muted)] flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{formatClassLabel(jurusanName, student.kelas)} • {student.nisn ? `NISN: ${student.nisn}` : 'No NISN'}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        Skor: <span className="font-semibold text-[color:var(--text-primary)]">{student.skor}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        Poin: <span className="font-semibold text-[color:var(--accent-1)]">{student.poin}</span>
                      </span>
                    </div>

                    {/* PKL Eligibility Badge */}
                    <div className="flex items-center gap-1 py-0.5 px-2 rounded-full border bg-white/5 [.theme-clear_&]:bg-slate-50 border-white/10 [.theme-clear_&]:border-slate-200">
                      {student.skor >= 25 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-tight">PKL Eligible</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-tight">PKL Prep ({25 - student.skor} to go)</span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Skill Card Button */}
            <button
              onClick={() => setShowSkillCard(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all border border-cyan-500/20 text-sm font-medium"
              title="Lihat Skill Card"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Skill Card</span>
            </button>
            {isEditing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="p-2 rounded bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-colors">
                  <Save className="w-4 h-4" />
                </button>
                <button onClick={() => setIsEditing(false)} disabled={saving} className="p-2 rounded hover:bg-white/5 text-[color:var(--text-muted)]">
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={onClose} className="p-2 rounded hover:bg-white/10 text-white/70 hover:text-red-400 transition-colors [.theme-clear_&]:text-slate-500 [.theme-clear_&]:hover:text-red-500"><X className="w-5 h-5" /></button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-white/10 [.theme-clear_&]:border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'overview'
              ? 'text-[color:var(--accent-1)]'
              : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
              }`}
          >
            Ikhtisar Capaian
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--accent-1)]" />}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'history'
              ? 'text-[color:var(--accent-1)]'
              : 'text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]'
              }`}
          >
            Riwayat Kompetensi
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--accent-1)]" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Centralized Attendance & Discipline Section */}
              <div className="p-4 rounded-xl border border-white/10 [.theme-clear_&]:border-slate-200 bg-white/5 [.theme-clear_&]:bg-slate-50">
                <div className="text-xs uppercase font-bold text-[color:var(--text-muted)] mb-4 flex items-center gap-1 border-b border-white/5 pb-2">
                  <Clock className="w-4 h-4" /> Data Kehadiran & Kedisiplinan
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Detailed Attendance Counts */}
                  <div className="space-y-3">
                    <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)] opacity-50">Statistik Presensi</div>
                    {isEditing && canEdit ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Masuk</label>
                          <input type="number" value={editMasuk} onChange={(e) => setEditMasuk(Number(e.target.value))} className="w-full px-2 py-1.5 bg-black/20 border border-white/10 rounded text-sm text-white text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Izin</label>
                          <input type="number" value={editIzin} onChange={(e) => setEditIzin(Number(e.target.value))} className="w-full px-2 py-1.5 bg-black/20 border border-white/10 rounded text-sm text-white text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Sakit</label>
                          <input type="number" value={editSakit} onChange={(e) => setEditSakit(Number(e.target.value))} className="w-full px-2 py-1.5 bg-black/20 border border-white/10 rounded text-sm text-white text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-1">Alfa</label>
                          <input type="number" value={editAlfa} onChange={(e) => setEditAlfa(Number(e.target.value))} className="w-full px-2 py-1.5 bg-black/20 border border-white/10 rounded text-sm text-white text-center" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-white/5 rounded p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Masuk</div>
                          <div className="text-sm font-black text-emerald-500">{discipline?.masuk || 0}</div>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Izin</div>
                          <div className="text-sm font-black text-blue-500">{discipline?.izin || 0}</div>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Sakit</div>
                          <div className="text-sm font-black text-amber-500">{discipline?.sakit || 0}</div>
                        </div>
                        <div className="bg-white/5 rounded p-2 text-center">
                          <div className="text-[9px] text-slate-500 uppercase font-bold">Alfa</div>
                          <div className="text-sm font-black text-rose-500">{discipline?.alfa || 0}</div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-[color:var(--text-muted)]">Persentase Kehadiran</span>
                        {isEditing && canEdit ? (
                          <div className="flex items-center gap-1">
                            <input type="number" max="100" value={editAttendance} onChange={(e) => setEditAttendance(Number(e.target.value))} className="w-12 px-1 bg-black/20 border border-white/10 rounded text-xs text-right text-[color:var(--accent-1)] font-bold" />
                            <span className="text-xs text-[color:var(--text-muted)]">%</span>
                          </div>
                        ) : (
                          <span className="text-xs font-black text-[color:var(--accent-1)]">{discipline?.attendance_pcent || 0}%</span>
                        )}
                      </div>
                      <div className="overflow-hidden h-2 rounded-full bg-white/5">
                        <div style={{ width: `${discipline?.attendance_pcent || 0}%` }} className="h-full bg-gradient-to-r from-[color:var(--accent-1)] to-indigo-500 shadow-[0_0_10px_rgba(var(--accent-1-rgb),0.3)]" />
                      </div>
                    </div>
                  </div>

                  {/* Attitude Scores Section */}
                  <div className="space-y-3">
                    <div className="text-[10px] uppercase font-bold text-[color:var(--text-muted)] opacity-50">Penilaian Sikap</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      {discipline?.attitude_scores.map((att, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors uppercase tracking-wide font-medium">{att.aspect}</span>
                          {isEditing && canEdit ? (
                            <input
                              type="number"
                              min="0" max="100"
                              value={editAttitude[idx]?.score || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const newAtt = [...editAttitude];
                                newAtt[idx] = { ...newAtt[idx], score: val };
                                setEditAttitude(newAtt);
                              }}
                              className="w-12 px-2 py-0.5 bg-black/20 border border-white/10 rounded text-xs text-center text-white font-bold"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black ${att.score >= 80 ? 'text-emerald-500' : att.score >= 70 ? 'text-amber-500' : 'text-rose-500'}`}>{att.score}</span>
                              <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                                <div style={{ width: `${att.score}%` }} className={`h-full ${att.score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-[color:var(--text-primary)] mb-2">Pencapaian (Level tercapai)</h4>
                  <div className="space-y-3">
                    {achievedLevels.length === 0 && (
                      <div className="text-sm text-[color:var(--text-muted)] flex items-center gap-2"><Clock className="w-4 h-4 text-[color:var(--text-muted)]" /> Belum mencapai level apapun</div>
                    )}
                    {achievedLevels.map((lvl) => (
                      <div key={lvl.id} className="p-3 rounded-lg border flex items-start gap-3" style={{ background: 'transparent' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: lvl.badge_color }}>{lvl.badge_name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-semibold text-[color:var(--text-primary)]">{lvl.nama_level} <span className="text-xs text-[color:var(--text-muted)]">({lvl.badge_name})</span></div>
                          <div className="text-sm text-[color:var(--text-muted)] mt-1">
                            {lvl.criteria && lvl.criteria.length > 0 ? (
                              <ul className="list-disc list-outside ml-4 space-y-0.5">
                                {lvl.criteria.map((c, i) => {
                                  // Helper to render **bold** text and handle \n
                                  const renderBold = (text: string) => {
                                    const parts = text.split(/(\*\*.*?\*\*)/g);
                                    return parts.map((part, index) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={index} className="font-black text-[color:var(--text-primary)]">{part.slice(2, -2)}</strong>;
                                      }
                                      return (
                                        <span key={index}>
                                          {part.split('\n').map((line, i) => (
                                            <span key={i}>
                                              {i > 0 && <br />}
                                              {line}
                                            </span>
                                          ))}
                                        </span>
                                      );
                                    });
                                  };
                                  return <li key={i}>{renderBold(c)}</li>;
                                })}
                              </ul>
                            ) : (
                              <div>{lvl.hasil_belajar}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[color:var(--text-primary)] mb-2">Belum tercapai</h4>
                  <div className="space-y-3">
                    {notAchieved.length === 0 && (
                      <div className="text-sm text-[color:var(--text-muted)] flex items-center gap-2"><Check className="w-4 h-4 text-[color:var(--accent-1)]" /> Semua level telah dicapai</div>
                    )}
                    {notAchieved.map((lvl) => (
                      <div key={lvl.id} className="p-3 rounded-lg border flex items-start gap-3" style={{ background: 'transparent' }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[color:var(--text-primary)] shrink-0" style={{ background: '#efefef' }}>{lvl.badge_name.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-semibold text-[color:var(--text-primary)]">{lvl.nama_level} <span className="text-xs text-[color:var(--text-muted)]">({lvl.badge_name})</span></div>
                          <div className="text-sm text-[color:var(--text-muted)] mt-1">
                            {lvl.criteria && lvl.criteria.length > 0 ? (
                              <ul className="list-disc list-outside ml-4 space-y-0.5">
                                {lvl.criteria.map((c, i) => {
                                  // Helper to render **bold** text and handle \n
                                  const renderBold = (text: string) => {
                                    const parts = text.split(/(\*\*.*?\*\*)/g);
                                    return parts.map((part, index) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <strong key={index} className="font-black text-[color:var(--text-primary)]">{part.slice(2, -2)}</strong>;
                                      }
                                      return (
                                        <span key={index}>
                                          {part.split('\n').map((line, i) => (
                                            <span key={i}>
                                              {i > 0 && <br />}
                                              {line}
                                            </span>
                                          ))}
                                        </span>
                                      );
                                    });
                                  };
                                  return <li key={i}>{renderBold(c)}</li>;
                                })}
                              </ul>
                            ) : (
                              <div>{lvl.hasil_belajar}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[color:var(--text-primary)] flex items-center gap-2 uppercase tracking-wider mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                Tabel 1 — Riwayat Kompetensi Siswa Per Level
              </h4>
              <p className="text-[10px] text-slate-500 mb-2 font-medium italic">* Klik tombol PDF untuk mengunduh Kartu Verifikasi Kompetensi siswa.</p>
              <div className="overflow-x-auto border border-white/10 [.theme-clear_&]:border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-white/5 [.theme-clear_&]:bg-slate-50 text-[10px] sm:text-xs uppercase font-bold text-[color:var(--text-muted)]">
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">No</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Nama Siswa</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Kelas</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Kompetensi Keahlian</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Level</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Unit Kompetensi</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Aktivitas Pembuktian</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Penilai</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Hasil</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Tanggal</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap">Catatan</th>
                      <th className="px-4 py-3 border-b border-white/10 [.theme-clear_&]:border-slate-200 whitespace-nowrap text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm text-[color:var(--text-muted)]">
                    {!student.riwayat_kompetensi || student.riwayat_kompetensi.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="px-4 py-8 text-center text-slate-500 italic">Belum ada riwayat kompetensi terdata.</td>
                      </tr>
                    ) : (
                      student.riwayat_kompetensi.map((entry, idx) => {
                        const lvl = levels.find(l => l.id === entry.level_id);
                        return (
                          <tr key={entry.id} className="hover:bg-white/5 [.theme-clear_&]:hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{idx + 1}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100 font-medium text-[color:var(--text-primary)]">{student.nama}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{student.kelas}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{jurusanName || '-'}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{lvl?.nama_level || '-'}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100 leading-relaxed">
                              {renderRichText(entry.unit_kompetensi)}
                            </td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{entry.aktivitas_pembuktian}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{entry.penilai}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">
                              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 font-bold text-[10px]">{entry.hasil}</span>
                            </td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{entry.tanggal}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100">{entry.catatan || '-'}</td>
                            <td className="px-4 py-3 border-b border-white/5 [.theme-clear_&]:border-slate-100 text-right">
                              {entry.hasil.toLowerCase() === 'lulus' && (
                                <button
                                  onClick={() => generateCertificate({
                                    studentName: student.nama,
                                    nisn: student.nisn || '-',
                                    kelas: student.kelas,
                                    jurusan: jurusanName || 'Teknik',
                                    unitKompetensi: entry.unit_kompetensi,
                                    level: lvl?.nama_level || 'Advanced',
                                    tanggal: entry.tanggal,
                                    penilai: entry.penilai,
                                    hodName: hodName
                                  })}
                                  className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase ring-1 ring-indigo-500/20 hover:ring-0"
                                  title="Unduh Sertifikat PDF"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  PDF
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skill Card Modal */}
      {showSkillCard && (
        <SkillCard
          student={student}
          jurusanName={jurusanName}
          onClose={() => setShowSkillCard(false)}
        />
      )}
    </div>
  );
}

export default StudentDetailModal;
