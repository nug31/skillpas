import { jsPDF } from 'jspdf';
import smkLogo from '../assets/smk-logo.png';

export interface CertificateData {
    studentName: string;
    nisn: string;
    kelas: string;
    jurusan: string;
    unitKompetensi: string;
    level: string;
    tanggal: string;
    penilai: string;
    hodName?: string;
}

const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export const generateCertificate = async (data: CertificateData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a5'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Background / Border ---
    // Outer Border
    doc.setDrawColor(20, 30, 70); // Dark Blue
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Inner Gold Border
    doc.setDrawColor(200, 160, 50); // Gold-ish
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    // --- Header ---
    // Logo (Centered Top)
    try {
        const logoImg = await loadImage(smkLogo);
        const logoWidth = 20;
        const logoHeight = 20; // Aspect ratio might vary, assuming square-ish
        const xPos = (pageWidth - logoWidth) / 2;
        doc.addImage(logoImg, 'PNG', xPos, 10, logoWidth, logoHeight);
    } catch (e) {
        console.error("Failed to load logo", e);
    }

    const textStartY = 35;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 30, 70);
    doc.text('KARTU VERIFIKASI KOMPETENSI', pageWidth / 2, textStartY, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('SKILL PASSPORT SMK Mitra Industri', pageWidth / 2, textStartY + 5, { align: 'center' });

    doc.setDrawColor(20, 30, 70);
    doc.setLineWidth(0.5);
    doc.line(30, textStartY + 8, pageWidth - 30, textStartY + 8);

    // --- Body Content ---
    let yPos = textStartY + 18;

    doc.setFontSize(10);
    doc.text('Diberikan kepada siswa:', pageWidth / 2, yPos, { align: 'center' });

    yPos += 8;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(data.studentName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });

    yPos += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`NISN: ${data.nisn} | Kelas: ${data.kelas}`, pageWidth / 2, yPos, { align: 'center' });
    doc.text(`Jurusan: ${data.jurusan}`, pageWidth / 2, yPos + 4, { align: 'center' });

    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.1);
    doc.line(40, yPos, pageWidth - 40, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.text('Telah dinyatakan LULUS verifikasi pada kompetensi:', pageWidth / 2, yPos, { align: 'center' });

    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 100, 30); // Dark Green
    doc.text(data.unitKompetensi, pageWidth / 2, yPos, { align: 'center' });

    // --- Footer / Signatures ---
    // Date
    const dateStr = new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Signatures Position
    const sigY = pageHeight - 35;
    const sigLeftX = 40;
    const sigRightX = pageWidth - 40;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Level Pencapaian (Bottom Left)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Level Pencapaian: ${data.level}`, 10, pageHeight - 6, { align: 'left' });
    doc.setFont('helvetica', 'normal');

    // Right: Date & Principal
    // Date usually above the signature place city? "Cikarang Barat, [Date]"
    // Using standard format
    doc.text(`Bekasi, ${dateStr}`, sigRightX, sigY - 5, { align: 'center' });

    // Titles
    doc.text('Kepala Sekolah,', sigRightX, sigY, { align: 'center' });
    doc.text(`HOD ${data.jurusan},`, sigLeftX, sigY, { align: 'center' });

    // Names (Bottom, underlined or in parens)
    const nameY = sigY + 20;

    doc.setFont('helvetica', 'bold');
    doc.text('Lispiyatmini, M.Pd', sigRightX, nameY, { align: 'center' });
    // Dynamic HOD Name or Placeholder
    const hodNameDisplay = data.hodName ? data.hodName : '( ................................. )';
    doc.text(hodNameDisplay, sigLeftX, nameY, { align: 'center' });

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Dokumen ini diterbitkan secara digital melalui Sistem Skill Passport.', pageWidth - 10, pageHeight - 6, { align: 'right' });

    // Save PDF
    doc.save(`Sertifikat_${data.studentName.replace(/\s+/g, '_')}_${data.level}.pdf`);
};
