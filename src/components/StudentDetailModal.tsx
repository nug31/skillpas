import { useState } from 'react';
import { X, Check, Clock, Pencil, Save } from 'lucide-react';
import type { StudentListItem, LevelSkill } from '../types';
import formatClassLabel from '../lib/formatJurusan';

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
  onUpdate?: (id: string, nama: string, kelas: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.nama);
  const [editKelas, setEditKelas] = useState(student.kelas);
  const [saving, setSaving] = useState(false);

  // Determine the student's achieved level based on score
  const achievedLevels = levels.filter((l) => student.skor >= l.min_skor);
  const notAchieved = levels.filter((l) => student.skor < l.min_skor);

  const handleSave = async () => {
    if (!onUpdate) return;
    try {
      setSaving(true);
      await onUpdate(student.id, editName, editKelas);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl sm:max-w-2xl md:max-w-3xl bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-4 border-b">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-[color:var(--text-muted)] block mb-1">Nama Siswa</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-[color:var(--text-primary)] font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-[color:var(--text-muted)] block mb-1">Kelas (ex: XII TKR 1)</label>
                  <input
                    value={editKelas}
                    onChange={(e) => setEditKelas(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-[color:var(--text-primary)]"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="text-lg font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                  {student.nama}
                  {onUpdate && !isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-1 text-[color:var(--text-muted)] hover:text-[color:var(--accent-1)] transition-colors" title="Edit Data">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-[color:var(--text-muted)]">{formatClassLabel(jurusanName, student.kelas)} • Skor: <span className="font-semibold text-[color:var(--text-primary)]">{student.skor}</span> • Level: <span className="font-semibold text-[color:var(--text-primary)]">{student.level_name}</span></div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
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
              <button onClick={onClose} className="p-2 rounded hover:bg-white/5 text-[color:var(--text-muted)]"><X className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... keeping existing content ... */}

          <div>
            <h4 className="text-sm font-semibold text-[color:var(--text-primary)] mb-2">Pencapaian (Level tercapai)</h4>
            <div className="space-y-3">
              {achievedLevels.length === 0 && (
                <div className="text-sm text-[color:var(--text-muted)] flex items-center gap-2"><Clock className="w-4 h-4 text-[color:var(--text-muted)]" /> Belum mencapai level apapun</div>
              )}
              {achievedLevels.map((lvl) => (
                <div key={lvl.id} className="p-3 rounded-lg border flex items-start gap-3" style={{ background: 'transparent' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: lvl.badge_color }}>{lvl.badge_name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--text-primary)]">{lvl.nama_level} <span className="text-xs text-[color:var(--text-muted)]">({lvl.badge_name})</span></div>
                    <div className="text-sm text-[color:var(--text-muted)] mt-1">{lvl.hasil_belajar}</div>
                    <div className="text-xs text-[color:var(--text-muted)] mt-1">Soft skill: {lvl.soft_skill}</div>
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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-[color:var(--text-primary)]" style={{ background: '#efefef' }}>{lvl.badge_name.charAt(0)}</div>
                  <div>
                    <div className="text-sm font-semibold text-[color:var(--text-primary)]">{lvl.nama_level} <span className="text-xs text-[color:var(--text-muted)]">({lvl.badge_name})</span></div>
                    <div className="text-sm text-[color:var(--text-muted)] mt-1">{lvl.hasil_belajar}</div>
                    <div className="text-xs text-[color:var(--text-muted)] mt-1">Soft skill: {lvl.soft_skill}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-[color:var(--text-primary)]">Tutup</button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailModal;
