export function letterToIndex(letter?: string): number | null {
  if (!letter) return null;
  const t = letter.trim().toUpperCase();
  if (!/^[A-Z]$/.test(t)) return null;
  return t.charCodeAt(0) - 64; // A -> 1
}

export function extractYear(kelas?: string): string | null {
  if (!kelas) return null;
  const s = kelas.toUpperCase();
  // common school year tokens: X, XI, XII, I - V (just in case)
  const m = s.match(/\b(XII|XI|X|IV|V|I{1,3})\b/);
  return m ? m[0] : null;
}


/**
 * formatClassLabel: given a jurusan name and a kelas string, return the compact display label
 * Rules (per spec):
 * - Listrik -> "{year} Listrik {index}" (try to extract year + index)
 * - Teknik Kimia -> "TKI {index}" (no year)
 * - Akuntansi -> "AK {index}"
 * - Perhotelan -> "{year} Hotel" (no index)
 * - Fallback: return the original kelas unchanged
 */
export function formatClassLabel(jurusanName?: string, kelas?: string): string {
  if (!jurusanName || !kelas) return kelas ?? '';

  const j = jurusanName.toLowerCase();
  const year = extractYear(kelas);

  // Clean the string: remove year and redundant jurusan name to get the "content" (e.g. "1 03")
  let content = kelas;
  if (year) {
    content = content.replace(new RegExp(`\\b${year}\\b`, 'i'), '');
  }

  // helper to remove formal jurusan tokens
  const removeTokens = (tokens: string[]) => {
    tokens.forEach(t => {
      content = content.replace(new RegExp(`\\b${t}\\b`, 'i'), '');
    });
  };

  content = content.trim();

  // Mesin
  if (j.includes('mesin')) {
    removeTokens(['MESIN', 'TEKNIK']);
    return year ? `${year} MESIN ${content}`.trim() : `MESIN ${content}`.trim();
  }

  // Kendaraan Ringan (TKR)
  if (j.includes('kendaraan') || j.includes('tkr')) {
    removeTokens(['KENDARAAN', 'RINGAN', 'TKR', 'TEKNIK']);
    return year ? `${year} TKR ${content}`.trim() : `TKR ${content}`.trim();
  }

  // Sepeda Motor (TSM)
  if (j.includes('sepeda') || j.includes('tsm')) {
    removeTokens(['SEPEDA', 'MOTOR', 'TSM', 'TEKNIK', 'TBSM']);
    return year ? `${year} TSM ${content}`.trim() : `TSM ${content}`.trim();
  }

  // Elektronika Industri (ELIND)
  if (j.includes('elektronika') || j.includes('elind') || j.includes('elektronika industri')) {
    removeTokens(['ELEKTRONIKA', 'INDUSTRI', 'ELIND', 'ELIN', 'TEKNIK']);
    return year ? `${year} ELIND ${content}`.trim() : `ELIND ${content}`.trim();
  }

  // Instalasi Tenaga Listrik (LISTRIK)
  if (j.includes('listrik') || j.includes('titl')) {
    removeTokens(['INSTALASI', 'TENAGA', 'LISTRIK', 'TITL', 'TEKNIK']);
    return year ? `${year} LISTRIK ${content}`.trim() : `LISTRIK ${content}`.trim();
  }

  // Kimia -> TKI
  if (j.includes('kimia') || j.includes('tki')) {
    removeTokens(['KIMIA', 'INDUSTRI', 'TKI', 'TEKNIK']);
    return `TKI ${content}`.trim();
  }

  // Akuntansi -> AK
  if (j.includes('akuntan') || j.includes('akuntansi') || j.includes('ak')) {
    removeTokens(['AKUNTANSI', 'AK']);
    return `AK ${content}`.trim();
  }

  // Perhotelan -> HOTEL
  if (j.includes('hotel') || j.includes('perhotelan')) {
    removeTokens(['PERHOTELAN', 'HOTEL']);
    return year ? `${year} HOTEL ${content}`.trim() : `HOTEL ${content}`.trim();
  }

  return kelas;
}

export default formatClassLabel;
