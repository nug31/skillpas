import { jsPDF } from 'jspdf';

export interface CertificateData {
    studentName: string;
    nisn: string;
    kelas: string;
    jurusan: string;
    unitKompetensi: string;
    level: string;
    tanggal: string;
    penilai: string;
}

export const generateCertificate = (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
    });

    // --- Background / Border ---
    doc.setDrawColor(20, 30, 70); // Dark Blue
    doc.setLineWidth(1);
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

    doc.setDrawColor(200, 160, 50); // Gold-ish
    doc.setLineWidth(0.5);
    doc.rect(7, 7, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 14);

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(20, 30, 70);
    doc.text('KARTU VERIFIKASI KOMPETENSI', doc.internal.pageSize.width / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SKILL PASSPORT METRA INDUSTRI VOCATIONAL HS', doc.internal.pageSize.width / 2, 32, { align: 'center' });

    doc.setDrawColor(20, 30, 70);
    doc.setLineWidth(0.8);
    doc.line(40, 35, doc.internal.pageSize.width - 40, 35);

    // --- Body Content ---
    doc.setFontSize(11);
    doc.text('Diberikan kepada siswa:', doc.internal.pageSize.width / 2, 45, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.studentName.toUpperCase(), doc.internal.pageSize.width / 2, 55, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`NISN: ${data.nisn} | Kelas: ${data.kelas}`, doc.internal.pageSize.width / 2, 62, { align: 'center' });
    doc.text(`Jurusan: ${data.jurusan}`, doc.internal.pageSize.width / 2, 67, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(30, 75, doc.internal.pageSize.width - 30, 75);

    doc.setFontSize(11);
    doc.text('Telah dinyatakan LULUS verifikasi pada kompetensi:', doc.internal.pageSize.width / 2, 85, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 100, 30); // Dark Green
    doc.text(data.unitKompetensi, doc.internal.pageSize.width / 2, 95, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Level Pencapaian: ${data.level}`, doc.internal.pageSize.width / 2, 103, { align: 'center' });

    // --- Footer / Signatures ---
    const dateStr = new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal: ${dateStr}`, 30, 120);
    doc.text(`Penilai: ${data.penilai}`, 30, 125);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Dokumen ini diterbitkan secara digital melalui Sistem Skill Passport.', doc.internal.pageSize.width - 30, 135, { align: 'right' });

    // Save PDF
    doc.save(`Sertifikat_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`);
};
