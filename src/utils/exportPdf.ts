import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPdf(elementId: string, fileName: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemen dokumen tidak ditemukan untuk diekspor ke PDF.');
  }

  // Temporary styling for capture
  const originalWidth = element.style.width;
  element.style.width = '794px'; // Standard A4 at 96 DPI

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for crisp text & photos
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const calculatedHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (calculatedHeight <= pdfHeight) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, calculatedHeight);
    } else {
      // If content overflows A4 slightly, scale to fit one page neatly or split
      let heightLeft = calculatedHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - calculatedHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;
      }
    }

    const cleanFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(cleanFileName);
  } finally {
    element.style.width = originalWidth;
  }
}
