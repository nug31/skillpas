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
        format: 'a4' // Switch to A4 for a more standard certificate size
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Helper for wave patterns
    const drawWaves = (doc: jsPDF, top: boolean) => {
        const height = 25;

        doc.setFillColor(30, 58, 138); // Dark Blue

        if (top) {
            // Simplified wave with a polygon
            doc.triangle(0, 0, pageWidth, 0, 0, height, 'F');
            doc.rect(0, 0, pageWidth, height / 2, 'F');

            doc.setFillColor(100, 116, 139); // Slate/Grey
            doc.triangle(0, 0, pageWidth * 0.4, 0, 0, height - 5, 'F');
        } else {
            doc.triangle(0, pageHeight, pageWidth, pageHeight, pageWidth, pageHeight - height, 'F');
            doc.rect(0, pageHeight - height / 2, pageWidth, height / 2, 'F');

            doc.setFillColor(100, 116, 139); // Slate/Grey
            doc.triangle(pageWidth, pageHeight, pageWidth * 0.6, pageHeight, pageWidth, pageHeight - height + 5, 'F');
        }
    };

    // --- PAGE 1: MAIN CERTIFICATE ---
    drawWaves(doc, true);
    drawWaves(doc, false);

    // Logos
    try {
        const logoImg = await loadImage(smkLogo);
        doc.addImage(logoImg, 'PNG', 15, 12, 18, 18);
    } catch (e) { console.error("Logo error", e); }

    // Main Titles
    let y = 50;
    doc.setTextColor(20, 30, 70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('SERTIFIKAT KOMPETENSI', pageWidth / 2, y, { align: 'center' });

    y += 7;
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(16);
    doc.text('CERTIFICATE OF COMPETENCY', pageWidth / 2, y, { align: 'center' });

    y += 10;
    const certNumber = `2025${data.nisn}${new Date().getTime().toString().slice(-6)}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nomor / No: ${certNumber}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.text('Dengan ini menyatakan bahwa,', pageWidth / 2, y, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.text('This is to certify that', pageWidth / 2, y + 4, { align: 'center' });

    y += 18;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(data.studentName.toUpperCase(), pageWidth / 2, y, { align: 'center' });

    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`NISN: ${data.nisn}`, pageWidth / 2, y, { align: 'center' });

    y += 12;
    doc.setFontSize(10);
    doc.text('Telah kompeten pada bidang:', pageWidth / 2, y, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.text('Is competent in the area of:', pageWidth / 2, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    y += 15;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(data.jurusan, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(10);
    doc.setTextColor(20, 30, 70);

    y += 7;
    doc.text('Dengan Kualifikasi / Kompetensi:', pageWidth / 2, y, { align: 'center' });
    doc.setFont('helvetica', 'italic');
    doc.text('With Qualification / Competency', pageWidth / 2, y + 4, { align: 'center' });
    doc.setFont('helvetica', 'normal');

    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text(data.level, pageWidth / 2, y, { align: 'center' });

    // Date
    const dateStr = new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Page 1 Signatures
    const sigY = pageHeight - 45;
    doc.setFontSize(9);
    doc.text('SMK MITRA INDUSTRI MM2100', 40, sigY, { align: 'center' });
    doc.text('Kepala Sekolah,', 40, sigY + 4, { align: 'center' });

    doc.text('Penguji,', pageWidth - 40, sigY + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.text('Lispiyatmini, M.Pd', 40, sigY + 25, { align: 'center' });
    doc.text('( ........................... )', pageWidth - 40, sigY + 25, { align: 'center' });

    // --- PAGE 2: COMPETENCY LIST ---
    doc.addPage();
    drawWaves(doc, true);
    drawWaves(doc, false);

    y = 40;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('DAFTAR UNIT KOMPETENSI', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.text('List of Unit of Competency', pageWidth / 2, y, { align: 'center' });

    // Table
    y += 15;
    const tableX = 25;
    const colWidths = [20, pageWidth - tableX * 2 - 20];
    const rowHeight = 8;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setFillColor(240, 240, 240);
    doc.rect(tableX, y, pageWidth - tableX * 2, rowHeight, 'F');
    doc.rect(tableX, y, pageWidth - tableX * 2, rowHeight);

    doc.text('NO', tableX + 10, y + 5, { align: 'center' });
    doc.text('Elemen Kompetensi / Element of Competency', tableX + 20 + colWidths[1] / 2, y + 5, { align: 'center' });

    y += rowHeight;

    // Parse Items
    let competencies: string[] = [];
    try {
        if (data.unitKompetensi.startsWith('[') && data.unitKompetensi.endsWith(']')) {
            competencies = JSON.parse(data.unitKompetensi);
        } else {
            competencies = [data.unitKompetensi];
        }
    } catch (e) { competencies = [data.unitKompetensi]; }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    competencies.forEach((item, index) => {
        const itemY = y + index * rowHeight;
        if (itemY > pageHeight - 60) return; // Prevent overflow on page 2

        doc.rect(tableX, itemY, colWidths[0], rowHeight);
        doc.rect(tableX + colWidths[0], itemY, colWidths[1], rowHeight);

        doc.text((index + 1).toString(), tableX + 10, itemY + 5, { align: 'center' });
        doc.text(item, tableX + 20 + 5, itemY + 5, { maxWidth: colWidths[1] - 10 });
    });

    // Score & Sign
    const bottomY = pageHeight - 60;
    doc.setFont('helvetica', 'bold');
    doc.text(`Bekasi, ${dateStr}`, pageWidth - 60, bottomY + 10, { align: 'center' });
    doc.text(data.jurusan, pageWidth - 60, bottomY + 20, { align: 'center' });

    doc.text(data.hodName || '( ........................... )', pageWidth - 60, bottomY + 40, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('Head of Department', pageWidth - 60, bottomY + 44, { align: 'center' });

    // Save PDF
    doc.save(`Sertifikat_${data.studentName.replace(/\s+/g, '_')}.pdf`);
};
