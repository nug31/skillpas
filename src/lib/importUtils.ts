import * as XLSX from 'xlsx';
import { SiswaWithSkill } from '../types';

export interface AttendanceImportRow {
    NISN: string;
    Nama: string;
    Masuk: number;
    Izin: number;
    Sakit: number;
    Alfa: number;
}

export function generateAttendanceTemplate(students: SiswaWithSkill[], kelas: string) {
    // Generate records based on existing values (to be overwritten if changed by user)
    const data = students.map(s => ({
        'NISN': s.nisn || '',
        'Nama': s.nama || '',
        'Masuk': s.discipline_data?.masuk || 0,
        'Izin': s.discipline_data?.izin || 0,
        'Sakit': s.discipline_data?.sakit || 0,
        'Alfa': s.discipline_data?.alfa || 0,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    ws['!cols'] = [
        { wch: 15 }, // NISN
        { wch: 30 }, // Nama
        { wch: 10 }, // Masuk
        { wch: 10 }, // Izin
        { wch: 10 }, // Sakit
        { wch: 10 }, // Alfa
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Template Kehadiran');
    
    const date = new Date().toISOString().split('T')[0];
    const kelasClean = kelas.replace(/\s+/g, '_');
    const filename = `Template_Kehadiran_Kelas_${kelasClean}_${date}.xlsx`;
    
    XLSX.writeFile(wb, filename);
}

export function parseAttendanceExcel(file: File): Promise<AttendanceImportRow[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
                
                const validData: AttendanceImportRow[] = jsonData.map(row => ({
                    NISN: String(row.NISN || '').trim(),
                    Nama: String(row.Nama || '').trim(),
                    Masuk: Number(row.Masuk) || 0,
                    Izin: Number(row.Izin) || 0,
                    Sakit: Number(row.Sakit) || 0,
                    Alfa: Number(row.Alfa) || 0,
                }));
                
                resolve(validData);
            } catch (error) {
                reject(new Error('Gagal membaca file Excel. Pastikan format file sesuai dengan template.'));
            }
        };
        reader.onerror = () => reject(new Error('Gagal memuat file.'));
        reader.readAsArrayBuffer(file);
    });
}
