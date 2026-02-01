import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LevelSkill } from '../types';
import { Badge } from './Badge';
import { groupCriteria, cleanSubItemText } from '../lib/criteriaHelper';

function LevelCriteriaCell({
  level,
  allowEdit,
  onUpdate,
}: {
  level: LevelSkill;
  allowEdit: boolean;
  onUpdate?: (levelId: string, newCriteria: string[]) => Promise<void> | void;
}) {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState(false);
  // Ensure criteria is always an array
  const [items, setItems] = useState<string[]>(
    Array.isArray(level.criteria) && level.criteria.length > 0
      ? level.criteria
      : (level.hasil_belajar ? [level.hasil_belajar] : [])
  );

  // Sync local items state when level prop changes (e.g. after update from parent)
  useEffect(() => {
    setItems(
      Array.isArray(level.criteria) && level.criteria.length > 0
        ? level.criteria
        : (level.hasil_belajar ? [level.hasil_belajar] : [])
    );
  }, [level.criteria, level.hasil_belajar]);

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

  const toggleGroup = (groupIdx: number) => {
    const next = new Set(expandedGroups);
    if (next.has(groupIdx)) next.delete(groupIdx);
    else next.add(groupIdx);
    setExpandedGroups(next);
  };

  // Helper to render formatting
  const renderText = (text: string, isSub = false) => {
    const cleanText = isSub ? cleanSubItemText(text) : text;
    const parts = cleanText.split(/(\*\*.*?\*\*)/g);
    return (
      <span className={isSub ? 'opacity-90' : ''}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-[color:var(--text-primary)]">{part.slice(2, -2)}</strong>;
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
        })}
      </span>
    );
  };

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
                placeholder="Kriteria (gunakan 1. untuk sub-item)..."
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
              setItems(items); // Just close
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

  const groups = groupCriteria(items);

  return (
    <div className="max-w-md group">
      <div className="flex flex-col gap-2">
        <div className="space-y-1.5">
          {groups.length === 0 ? (
            <div className="text-sm text-[color:var(--text-muted)] italic">Belum ada kriteria</div>
          ) : (
            groups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div
                  className={`flex items-start gap-2 text-sm text-[color:var(--text-primary)] ${group.subs.length > 0 ? 'cursor-pointer hover:text-[color:var(--accent-1)]' : ''}`}
                  onClick={() => group.subs.length > 0 && toggleGroup(gIdx)}
                >
                  <span className="mt-1 shrink-0">
                    {group.subs.length > 0 ? (
                      expandedGroups.has(gIdx) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <div className="w-1 h-1 bg-white/40 rounded-full ml-1.5 mt-1.5" />
                    )}
                  </span>
                  <div className="flex-1 font-medium">{renderText(group.main)}</div>
                </div>

                <AnimatePresence>
                  {group.subs.length > 0 && expandedGroups.has(gIdx) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="ml-6 space-y-1 py-1 border-l border-white/5 pl-3">
                        {group.subs.map((sub, sIdx) => (
                          <li key={sIdx} className="text-[13px] text-[color:var(--text-muted)] list-none flex gap-2">
                            {renderText(sub, true)}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {allowEdit && (
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 self-start px-2 py-1 text-xs text-[color:var(--accent-1)] border border-[color:var(--accent-1)]/30 rounded hover:bg-[color:var(--accent-1)]/10"
            onClick={() => {
              setEditing(true);
            }}
          >
            Edit Kriteria
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
  isTeacher?: boolean; // role-based access control (general visibility)
  allowEdit?: boolean; // explicit permission to edit criteria
}

export function LevelTable({ levels, jurusanId, onUpdateCriteria, isTeacher = false, allowEdit = false }: LevelTableProps) {
  return (
    <div className="card-glass rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-[color:var(--accent-1)] to-[color:var(--accent-2)]">
        <h2 className="text-xl font-semibold text-white">Level Skill & Badge System</h2>
      </div>

      {/* Mobile: stacked cards */}
      <div className="md:hidden p-4 space-y-4">
        {levels.map((level) => (
          <div key={level.id} className="card-glass rounded-2xl p-5 shadow-xl border border-white/5 relative overflow-hidden group">
            <div
              className="absolute -top-10 -right-10 w-32 h-32 blur-[50px] opacity-20 transition-opacity group-hover:opacity-30"
              style={{ background: level.badge_color }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transform rotate-3"
                  style={{ background: `linear-gradient(135deg, ${level.badge_color}, #00000044)` }}
                >
                  <div className="text-lg font-black text-black drop-shadow-sm">{level.badge_name.charAt(0)}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-[color:var(--text-primary)] leading-tight">{level.nama_level}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge name={level.badge_name} color={level.badge_color} size="sm" />
                    {isTeacher && (
                      <span className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-[color:var(--text-muted)] border border-white/5">
                        Score: {level.min_skor}-{level.max_skor}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[color:var(--accent-1)] mb-2">Kompetensi Utama</div>
                  <LevelCriteriaCell
                    level={level}
                    allowEdit={allowEdit && !!jurusanId && !!onUpdateCriteria}
                    onUpdate={onUpdateCriteria}
                  />
                </div>

                {level.soft_skill && (
                  <div className="bg-indigo-500/5 rounded-xl p-3 border border-indigo-500/10">
                    <div className="text-[10px] font-black uppercase tracking-wider text-indigo-400 mb-1">Soft Skills</div>
                    <p className="text-xs text-[color:var(--text-muted)] leading-relaxed italic">
                      "{level.soft_skill}"
                    </p>
                  </div>
                )}
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
                    allowEdit={allowEdit && !!jurusanId && !!onUpdateCriteria}
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
