import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnggotaWahidiyah } from '../types/biodata';
import { KELURAHAN_CIPAYUNG } from '../types/biodata';

export interface RekapExportOptions {
  filteredTitle?: string;
  kelurahanFilter?: string;
  golonganFilter?: string;
}

export function exportRekapAnggotaToPdf(
  list: AnggotaWahidiyah[],
  options?: RekapExportOptions
): void {
  if (!list || list.length === 0) {
    alert('Tidak ada data anggota untuk diekspor ke PDF.');
    return;
  }

  // Create A4 Landscape document for rich tabular layout
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // ~297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~210mm

  // Format Indonesian date
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate statistics
  const totalAnggota = list.length;
  const totalLaki = list.filter((a) => a.jenisKelamin === 'Laki-laki').length;
  const totalPerempuan = list.filter((a) => a.jenisKelamin === 'Perempuan').length;

  const kelurahanStats: Record<string, number> = {};
  KELURAHAN_CIPAYUNG.forEach((k) => {
    kelurahanStats[k] = list.filter((a) => a.kelurahan === k).length;
  });

  // Header drawing function for pages
  const drawKopSurat = (pdf: jsPDF) => {
    // Header Green bar top
    pdf.setFillColor(6, 78, 59); // emerald-900
    pdf.rect(0, 0, pageWidth, 5, 'F');

    // Arabic Bismillah text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(6, 95, 70);
    pdf.text('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', pageWidth / 2, 11, { align: 'center' });

    // Organization title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(6, 78, 59);
    pdf.text(
      'YAYASAN PERJUANGAN WAHIDIYAH DAN PONDOK PESANTREN KEDUNGLO AL-MUNADHDHAROH',
      pageWidth / 2,
      17,
      { align: 'center' }
    );

    pdf.setFontSize(11);
    pdf.setTextColor(15, 23, 42);
    pdf.text(
      'PENGURUS KECAMATAN CIPAYUNG - KOTA ADMINISTRASI JAKARTA TIMUR',
      pageWidth / 2,
      22,
      { align: 'center' }
    );

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      'Sekretariat: Wilayah Binaan Kecamatan Cipayung, Kota Jakarta Timur, DKI Jakarta',
      pageWidth / 2,
      26.5,
      { align: 'center' }
    );

    // Decorative double line
    pdf.setDrawColor(6, 78, 59);
    pdf.setLineWidth(0.8);
    pdf.line(14, 29, pageWidth - 14, 29);

    pdf.setDrawColor(217, 119, 6); // amber-600
    pdf.setLineWidth(0.3);
    pdf.line(14, 30, pageWidth - 14, 30);
  };

  // Draw Kop Surat on first page
  drawKopSurat(doc);

  // Document Title & Info Box
  let currentY = 36;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(6, 78, 59);
  doc.text('REKAPITULASI DATA ANGGOTA & PENGAMAL WAHIDIYAH', pageWidth / 2, currentY, {
    align: 'center',
  });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  let subtitle = `Total Anggota Terdata: ${totalAnggota} Orang (${totalLaki} Laki-laki, ${totalPerempuan} Perempuan) • Tanggal Rekap: ${dateStr}`;
  if (options?.kelurahanFilter && options.kelurahanFilter !== 'Semua') {
    subtitle += ` • Filter Kelurahan: ${options.kelurahanFilter}`;
  }
  if (options?.golonganFilter && options.golonganFilter !== 'Semua') {
    subtitle += ` • Golongan: ${options.golonganFilter}`;
  }
  doc.text(subtitle, pageWidth / 2, currentY, { align: 'center' });

  // Summary box per kelurahan
  currentY += 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(14, currentY, pageWidth - 28, 8, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const kelSummaryText = KELURAHAN_CIPAYUNG.map((k) => `${k}: ${kelurahanStats[k] || 0}`).join('  |  ');
  doc.text(`Distribusi Kelurahan Cipayung:   ${kelSummaryText}`, pageWidth / 2, currentY + 5, {
    align: 'center',
  });

  currentY += 11;

  // Prepare table data
  const tableHeaders = [
    'No',
    'No. Reg',
    'Nama Lengkap',
    'L/P',
    'Umur',
    'Kelurahan',
    'RT/RW',
    'No. WhatsApp',
    'Amanah Struktur',
    'Golongan',
    'Mulai',
  ];

  const tableBody = list.map((item, index) => [
    (index + 1).toString(),
    item.noRegistrasi || '-',
    item.namaLengkap,
    item.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
    item.umur ? `${item.umur} th` : '-',
    item.kelurahan,
    item.rtRw || '-',
    item.noHpWhatsapp,
    item.amanahStruktur + (item.jabatanSpesifik ? ` (${item.jabatanSpesifik})` : ''),
    item.golonganPengamal,
    item.tahunMulaiWahidiyah ? item.tahunMulaiWahidiyah.toString() : '-',
  ]);

  // Generate Table using autoTable
  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableBody,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.15,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [6, 78, 59], // emerald-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7.8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 }, // No
      1: { halign: 'center', cellWidth: 26 }, // No. Reg
      2: { cellWidth: 46, fontStyle: 'bold' }, // Nama
      3: { halign: 'center', cellWidth: 11 }, // L/P
      4: { halign: 'center', cellWidth: 14 }, // Umur
      5: { cellWidth: 26 }, // Kelurahan
      6: { halign: 'center', cellWidth: 16 }, // RT/RW
      7: { cellWidth: 28 }, // No WA
      8: { cellWidth: 42 }, // Amanah
      9: { cellWidth: 28 }, // Golongan
      10: { halign: 'center', cellWidth: 16 }, // Mulai
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: (data) => {
      // Header for subsequent pages
      if (data.pageNumber > 1) {
        drawKopSurat(doc);
      }

      // Footer with page numbering
      const totalPagesExp = '{total_pages_count_string}';
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);

      // Left footer
      doc.text(
        `Buku Rekap Anggota Wahidiyah Kec. Cipayung • Dicetak pada ${dateStr}`,
        14,
        pageHeight - 8
      );

      // Right footer
      const pageStr = `Halaman ${data.pageNumber} dari ${totalPagesExp}`;
      doc.text(pageStr, pageWidth - 14, pageHeight - 8, { align: 'right' });
    },
  });

  // Calculate position for signatures at the end
  // Retrieve last table Y position
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 50;

  // Check if signature fits on current page or add new page
  let signY = finalY + 8;
  if (signY + 45 > pageHeight - 15) {
    doc.addPage();
    drawKopSurat(doc);
    signY = 40;
  }

  // Signatures Section
  const leftColX = 50;
  const rightColX = pageWidth - 50;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  // Date and place
  doc.text(`Jakarta Timur, ${dateStr}`, rightColX, signY, { align: 'center' });

  signY += 5;
  doc.text('Mengetahui / Mengesahkan,', leftColX, signY, { align: 'center' });
  doc.text('Pengurus Yayasan Perjuangan Wahidiyah', rightColX, signY, { align: 'center' });

  signY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Ketua YPW Kecamatan Cipayung', leftColX, signY, { align: 'center' });
  doc.text('Sekretaris YPW Kecamatan Cipayung', rightColX, signY, { align: 'center' });

  // Signature dots / space
  signY += 20;
  doc.setFont('helvetica', 'bold');
  doc.text('( .................................................. )', leftColX, signY, {
    align: 'center',
  });
  doc.text('( .................................................. )', rightColX, signY, {
    align: 'center',
  });

  signY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Tanda Tangan & Stempel Resmi', leftColX, signY, { align: 'center' });
  doc.text('Tanda Tangan & Stempel Resmi', rightColX, signY, { align: 'center' });

  // Replace total page numbers placeholder if supported
  if (typeof (doc as any).putTotalPages === 'function') {
    (doc as any).putTotalPages('{total_pages_count_string}');
  }

  // Save the PDF file
  const dateFormatted = now.toISOString().split('T')[0];
  const filename = `Rekap_Anggota_Wahidiyah_Cipayung_${dateFormatted}.pdf`;
  doc.save(filename);
}
