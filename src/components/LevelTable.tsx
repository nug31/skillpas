import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { LevelSkill } from '../types';
import { Badge } from './Badge';

function LevelCriteriaCell({
  level,
  allowEdit,
  onUpdate,
}: {
  level: LevelSkill;
  allowEdit: boolean;
  onUpdate?: (levelId: string, newCriteria: string[]) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(false);
  // Ensure criteria is always an array
  const [items, setItems] = useState<string[]>(
    Array.isArray(level.criteria) && level.criteria.length > 0
      ? level.criteria
      : (level.hasil_belajar ? [level.hasil_belajar] : [])
  );

  async function save() {
    if (!onUpdate) return;
    try {
      await onUpdate(level.id, items.filter((i: string) => i.trim() !== '')); // Filter empty strings
      setEditing(false);
    } catch (err) {
      console.error('Failed to update criteria', err);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    }
  }

  function handleAddItem() {
    setItems([...items, '']);
  }

  function handleItemChange(index: number, val: string) {
    const newItems = [...items];
    newItems[index] = val;
    setItems(newItems);
  }

  function handleDeleteItem(index: number) {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  }

  // Display mode: render list
  const displayItems = Array.isArray(level.criteria) && level.criteria.length > 0
    ? level.criteria
    : (level.hasil_belajar ? [level.hasil_belajar] : []);

  if (allowEdit && editing) {
    return (
      <div className="max-w-md w-full">
        <div className="flex flex-col gap-2 mb-3">
          {items.map((item: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2">
              <textarea
                value={item}
                onChange={(e) => handleItemChange(idx, e.target.value)}
                rows={2}
                className="flex-1 p-2 bg-black/20 border border-white/10 rounded text-sm text-[color:var(--text-primary)] focus:ring-1 focus:ring-[color:var(--accent-1)]"
                placeholder="Kriteria..."
              />
              <button
                onClick={() => handleDeleteItem(idx)}
                className="p-1.5 text-red-400 hover:bg-red-400/10 rounded"
                title="Hapus kriteria"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddItem}
            className="self-start flex items-center gap-1 px-2 py-1 text-xs text-[color:var(--accent-1)] hover:underline"
          >
            <Plus className="w-3 h-3" /> Tambah Kriteria
          </button>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 border border-white/20 rounded text-xs text-[color:var(--text-muted)] hover:bg-white/5"
            onClick={() => {
              setEditing(false);
              setItems(displayItems);
            }}
          >
            Batal
          </button>
          <button
            className="px-3 py-1 bg-[color:var(--accent-1)] text-white rounded text-xs hover:bg-[color:var(--accent-1)]/80"
            onClick={save}
          >
            Simpan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md group">
      <div className="flex items-start justify-between gap-3">
        <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-[color:var(--text-primary)]">
          {displayItems.length === 0 ? (
            <li className="text-[color:var(--text-muted)] italic">Belum ada kriteria</li>
          ) : (
            displayItems.map((c, i) => (
              <li key={i}>{c}</li>
            ))
          )}
        </ul>
        {allowEdit && (
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs text-[color:var(--accent-1)] border border-[color:var(--accent-1)]/30 rounded hover:bg-[color:var(--accent-1)]/10"
            onClick={() => {
              setItems(displayItems);
              setEditing(true);
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

interface LevelTableProps {
  levels: LevelSkill[];
  jurusanId?: string; // optional - used when editing per-jurusan descriptions
  onUpdateCriteria?: (levelId: string, criteria: string[]) => Promise<void> | void; // Changed from onUpdateHasil to onUpdateCriteria
  isTeacher?: boolean; // role-based access control
}

export function LevelTable({ levels, jurusanId, onUpdateCriteria, isTeacher = false }: LevelTableProps) {
  return (
    <div className="card-glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-xl font-semibold text-white">Level Skill & Badge System</h2>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden p-4 space-y-3">
        {levels.map((level) => (
          <div key={level.id} className="card-glass rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: level.badge_color }}>
                <div className="text-xs font-bold text-black">{level.badge_name.charAt(0)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm text-[color:var(--text-primary)] truncate">{level.nama_level}</div>
                  {isTeacher && (
                    <div className="text-xs text-[color:var(--text-muted)]">{level.min_skor} - {level.max_skor}</div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-[color:var(--text-muted)] mb-1">Kriteria:</div>
                  <LevelCriteriaCell
                    level={level}
                    allowEdit={isTeacher && !!jurusanId && !!onUpdateCriteria}
                    onUpdate={onUpdateCriteria}
                  />
                </div>

                <div className="text-xs text-[color:var(--text-muted)] mt-2">Soft skills: {level.soft_skill}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-muted)] uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Badge
              </th>
              {isTeacher && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                  Skor Range
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Kriteria Kompetensi
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[color:var(--text-primary)] uppercase tracking-wider">
                Soft Skills
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {levels.map((level) => (
              <tr key={level.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[color:var(--text-primary)]">{level.nama_level}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge name={level.badge_name} color={level.badge_color} size="sm" />
                </td>
                {isTeacher && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[color:var(--text-primary)] font-medium">
                      {level.min_skor} - {level.max_skor}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4">
                  <LevelCriteriaCell
                    level={level}
                    allowEdit={isTeacher && !!jurusanId && !!onUpdateCriteria}
                    onUpdate={onUpdateCriteria}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[color:var(--text-muted)] max-w-md">{level.soft_skill}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
