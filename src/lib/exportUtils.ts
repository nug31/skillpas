import * as XLSX from 'xlsx';
import { SiswaWithSkill } from '../types';

/**
 * Format student data for export
 */
export function formatStudentData(students: SiswaWithSkill[]) {
    return students.map((siswa: any) => ({
        'Nama': siswa.nama,
        'NISN': siswa.nisn || '-',
        'Kelas': siswa.kelas,
        'Level': siswa.current_level?.nama_level || 'Level 1',
        'Urutan Level': siswa.current_level?.urutan || 1,
        'Skor (XP)': siswa.current_skor || 0,
        'Poin': siswa.current_poin || 0,
        'Kehadiran (%)': siswa.discipline_data?.attendance_pcent || 0,
        'Masuk': siswa.discipline_data?.masuk || 0,
        'Izin': siswa.discipline_data?.izin || 0,
        'Sakit': siswa.discipline_data?.sakit || 0,
        'Alfa': siswa.discipline_data?.alfa || 0,
        'Nilai Sikap (Rata-rata)': siswa.discipline_data?.attitude_scores
            ? (siswa.discipline_data.attitude_scores.reduce((sum: number, item: any) => sum + item.score, 0) / siswa.discipline_data.attitude_scores.length).toFixed(1)
            : '-',
        'Status KRS': siswa.latest_krs?.status === 'completed' ? 'Selesai' :
            siswa.latest_krs?.status === 'rejected' ? 'Ditolak' :
                siswa.latest_krs?.status === 'scheduled' ? 'Terjadwal' :
                    siswa.latest_krs?.status === 'pending_produktif' ? 'Review Guru' :
                        siswa.latest_krs?.status === 'pending_hod' ? 'Review HOD' :
                            'Tidak Ada'
    }));
}

/**
 * Calculate class statistics
 */
export function calculateClassStatistics(students: SiswaWithSkill[]) {
    const total = students.length;
    const avgScore = total > 0
        ? (students.reduce((acc: number, s: any) => acc + (s.current_skor || 0), 0) / total).toFixed(1)
        : 0;

    const avgAttendance = total > 0
        ? (students.reduce((acc: number, s: any) => acc + (s.discipline_data?.attendance_pcent || 0), 0) / total).toFixed(1)
        : 0;

    const avgAttitude = total > 0
        ? (students.reduce((acc: number, s: any) => {
            if (s.discipline_data?.attitude_scores) {
                const avg = s.discipline_data.attitude_scores.reduce((sum: number, item: any) => sum + item.score, 0) / s.discipline_data.attitude_scores.length;
                return acc + avg;
            }
            return acc;
        }, 0) / total).toFixed(1)
        : 0;

    const levelDistribution = students.reduce((acc: any, s: any) => {
        const levelName = s.current_level?.nama_level || 'Level 1';
        acc[levelName] = (acc[levelName] || 0) + 1;
        return acc;
    }, {});

    const krsStatusDistribution = students.reduce((acc: any, s: any) => {
        const status = s.latest_krs?.status || 'none';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return {
        total,
        avgScore,
        avgAttendance,
        avgAttitude,
        levelDistribution,
        krsStatusDistribution
    };
}

/**
 * Export data to Excel format
 */
export function exportToExcel(students: SiswaWithSkill[], filename: string) {
    const formattedData = formatStudentData(students);
    const stats = calculateClassStatistics(students);

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create main data sheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Set column widths
    ws['!cols'] = [
        { wch: 25 }, // Nama
        { wch: 15 }, // NISN
        { wch: 12 }, // Kelas
        { wch: 15 }, // Level
        { wch: 12 }, // Urutan
        { wch: 10 }, // Skor
        { wch: 8 },  // Poin
        { wch: 12 }, // Kehadiran
        { wch: 8 },  // Masuk
        { wch: 8 },  // Izin
        { wch: 8 },  // Sakit
        { wch: 8 },  // Alfa
        { wch: 18 }, // Sikap
        { wch: 15 }  // KRS
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');

    // Create summary sheet
    const summaryData = [
        { 'Statistik': 'Total Siswa', 'Nilai': stats.total },
        { 'Statistik': 'Rata-rata Skor', 'Nilai': stats.avgScore },
        { 'Statistik': 'Rata-rata Kehadiran (%)', 'Nilai': stats.avgAttendance },
        { 'Statistik': 'Rata-rata Nilai Sikap', 'Nilai': stats.avgAttitude },
        {},
        { 'Statistik': 'Distribusi Level', 'Nilai': '' },
        ...Object.entries(stats.levelDistribution).map(([level, count]) => ({
            'Statistik': `  ${level}`,
            'Nilai': count
        }))
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

    // Generate and download file
    XLSX.writeFile(wb, filename);
}

/**
 * Export data to CSV format
 */
export function exportToCSV(students: SiswaWithSkill[], filename: string) {
    const formattedData = formatStudentData(students);

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Write as CSV
    XLSX.writeFile(wb, filename, { bookType: 'csv' });
}

/**
 * Generate filename with timestamp
 */
export function generateReportFilename(kelas: string, format: 'xlsx' | 'csv' = 'xlsx') {
    const date = new Date().toISOString().split('T')[0];
    const kelasClean = kelas.replace(/\s+/g, '_');
    return `Laporan_Kelas_${kelasClean}_${date}.${format}`;
}
