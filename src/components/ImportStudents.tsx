import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
// no runtime types needed here
import mockData from '../mocks/mockData';
import { supabase, isMockMode } from '../lib/supabase';

interface ParsedRow { nama: string; kelas?: string; skor?: number }

interface ImportStudentsProps {
  jurusanId: string;
  onClose: () => void;
  onImported: () => void; // parent should refresh
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  // detect header
  const first = lines[0];
  const hasHeader = /nama|kelas|skor/i.test(first);
  const rows = (hasHeader ? lines.slice(1) : lines).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    // flexible parsing: 1 column -> nama, 2 columns -> nama,kelas, 3 -> nama,kelas,skor
    const nama = cols[0] ?? '';
    const kelas = cols[1] ?? undefined;
    const skor = cols[2] ? Number(cols[2]) : undefined;
    return { nama, kelas, skor } as ParsedRow;
  }).filter(r => r.nama);

  return rows;
}

export function ImportStudents({ jurusanId, onClose, onImported }: ImportStudentsProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setPreview([]);
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const parsed = parseCSV(text);
    setPreview(parsed);
  }

  async function handlePaste(text: string) {
    setError(null);
    setPreview(parseCSV(text));
  }

  async function doImport() {
    if (preview.length === 0) {
      setError('Tidak ada data untuk di-import');
      return;
    }

    setError(null);
    setLoading(true);
    const useMock = isMockMode;

    try {
      if (useMock) {
        // push into mockData.mockSiswa
        const now = new Date().toISOString();
        for (const row of preview) {
          const id = `s-${jurusanId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
          mockData.mockSiswa.push({ id, nama: row.nama, kelas: row.kelas ?? 'X', jurusan_id: jurusanId, created_at: now });
          // optional: create a skill record if skor provided
          if (typeof row.skor === 'number') {
            // narrow skor to a number and compute a level id safely
            const skor = row.skor;
            const levelId = mockData.mockLevels.find((l) => skor >= l.min_skor && skor <= l.max_skor)?.id ?? mockData.mockLevels[0].id;
            mockData.mockSkillSiswa.push({ id: `ss-${id}`, siswa_id: id, level_id: levelId, skor, tanggal_pencapaian: now, created_at: now, updated_at: now });
          }
        }
      } else {
        // Insert siswa rows into supabase
        const rows = preview.map((r) => ({ nama: r.nama, kelas: r.kelas ?? 'X', jurusan_id: jurusanId }));
        const { error: insertErr } = await supabase.from('siswa').insert(rows);
        if (insertErr) throw insertErr;

        // If rows included skor, attempt to insert skill_siswa records for those names
        // only keep rows that actually include a numeric skor
        const withSkor = preview.filter((p) => typeof p.skor === 'number');
        if (withSkor.length) {
          // fetch the inserted siswa IDs by name+jurusan (best-effort)
          for (const p of withSkor) {
            const { data: sdata, error: sErr } = await supabase.from('siswa').select('id').eq('nama', p.nama).eq('jurusan_id', jurusanId).limit(1);
            if (sErr || !sdata || sdata.length === 0) continue;
            // figure out level id
            const { data: levels } = await supabase.from('level_skill').select('*');
            // p.skor is guaranteed present here but let's make a local const to convince the typechecker
            const skor = p.skor as number;
            const level = levels?.find((l: any) => skor >= l.min_skor && skor <= l.max_skor);
            const levelId = level?.id;
            await supabase.from('skill_siswa').insert({ siswa_id: sdata[0].id, level_id: levelId, skor: p.skor });
          }
        }
      }

      onImported();
      onClose();
    } catch (err: any) {
      console.error('Import error', err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pb-32">
      <div className="card-glass w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] border border-white/20">
        <div className="p-6 flex-shrink-0 flex items-center justify-between border-b border-white/10">
          <h3 className="text-lg font-bold text-[color:var(--text-primary)]">Import Siswa — CSV</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-[color:var(--text-muted)] transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-[color:var(--text-muted)] group-hover:text-[color:var(--accent-1)] transition-colors" />
                  <p className="mb-2 text-sm text-[color:var(--text-muted)]"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                  <p className="text-xs text-[color:var(--text-muted)]">File CSV (nama,kelas,skor)</p>
                </div>
                <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--text-muted)] mb-2">Atau tempel CSV di sini</label>
              <textarea
                rows={4}
                onChange={(e) => handlePaste(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 text-[color:var(--text-primary)] placeholder-white/20 focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-transparent transition-all"
                placeholder={`Contoh format:\nNama Siswa, Kelas, Skor\nBudi Santoso, X TKR 1, 78`}
              />
            </div>

            {preview.length > 0 && (
              <div className="border border-white/10 rounded-xl overflow-hidden bg-black/10">
                <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs font-bold text-[color:var(--text-muted)] uppercase tracking-wider">
                  Preview ({preview.length} data)
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-[color:var(--text-muted)]">Nama</th>
                        <th className="px-4 py-2 text-left font-medium text-[color:var(--text-muted)]">Kelas</th>
                        <th className="px-4 py-2 text-left font-medium text-[color:var(--text-muted)]">Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {preview.map((r, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-2 text-[color:var(--text-primary)]">{r.nama}</td>
                          <td className="px-4 py-2 text-[color:var(--text-muted)]">{r.kelas ?? '-'}</td>
                          <td className="px-4 py-2 text-[color:var(--text-muted)]">{r.skor ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-500">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 pt-4 flex-shrink-0 flex items-center justify-end gap-3 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-white/10 text-[color:var(--text-muted)] transition-colors font-medium">Batal</button>
          <button
            disabled={loading || preview.length === 0}
            onClick={doImport}
            className="px-6 py-2 bg-[color:var(--accent-1)] hover:bg-[color:var(--accent-1)]/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg shadow-[color:var(--accent-1)]/20 transition-all"
          >
            {loading ? 'Memproses...' : 'Lakukan Import'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportStudents;
