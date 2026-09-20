import React, { useState } from 'react';
import { AnggotaWahidiyah } from '../types/biodata';
import { BiodataPrintSheet } from './BiodataPrintSheet';
import { exportElementToPdf } from '../utils/exportPdf';
import { exportSingleAnggotaToExcel } from '../utils/exportExcel';
import { WahidiyahLogo } from './WahidiyahLogo';
import {
  Download,
  FileSpreadsheet,
  Printer,
  Edit,
  X,
  CheckCircle,
  Loader2,
} from 'lucide-react';

interface BiodataPreviewModalProps {
  anggota: AnggotaWahidiyah;
  onClose: () => void;
  onEdit: (anggota: AnggotaWahidiyah) => void;
}

export const BiodataPreviewModal: React.FC<BiodataPreviewModalProps> = ({
  anggota,
  onClose,
  onEdit,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setDownloadSuccess(null);
      const cleanName = (anggota.namaLengkap || 'Anggota').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Biodata_Wahidiyah_Cipayung_${cleanName}.pdf`;
      await exportElementToPdf('biodata-print-sheet', filename);
      setDownloadSuccess('PDF berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('Terjadi kendala saat membuat file PDF. Silakan coba fitur Cetak Langsung.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      exportSingleAnggotaToExcel(anggota);
      setDownloadSuccess('Excel (.xlsx) berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export Excel', err);
      alert('Gagal mengunduh Excel.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-auto flex flex-col max-h-[96vh] h-full sm:h-auto overflow-hidden border border-emerald-900/20">
        {/* Modal Top Bar */}
        <div className="bg-emerald-900 text-white px-3 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="shrink-0">
              <WahidiyahLogo size={26} className="sm:w-[28px] sm:h-[28px]" />
            </div>
            <span className="bg-emerald-700/80 text-emerald-200 text-[11px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded shrink-0">
              {anggota.noRegistrasi || 'YPW-CPY'}
            </span>
            <h3 className="font-bold text-xs sm:text-base tracking-wide truncate max-w-[150px] sm:max-w-md">
              {anggota.namaLengkap}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors shrink-0 ml-2"
            title="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {downloadSuccess ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            ) : (
              <span className="text-xs text-emerald-950 font-medium">
                Pilih format unduhan:
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Tombol Unduh PDF */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex-1 sm:flex-none justify-center bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
              title="Unduh Formulir Biodata Resmi PDF"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>Unduh PDF</span>
                </>
              )}
            </button>

            {/* Tombol Unduh Excel */}
            <button
              onClick={handleDownloadExcel}
              className="flex-1 sm:flex-none justify-center bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
              title="Unduh Data Biodata ke Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span>Unduh Excel</span>
            </button>

            {/* Tombol Cetak Langsung */}
            <button
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-2.5 sm:px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              title="Cetak langsung menggunakan printer atau print PDF browser"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Cetak</span>
            </button>

            {/* Tombol Edit */}
            <button
              onClick={() => onEdit(anggota)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium px-2.5 sm:px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              title="Ubah data anggota ini"
            >
              <Edit className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Ubah</span>
            </button>
          </div>
        </div>

        {/* Document Scrollable Container */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-2 sm:p-6 bg-gray-100/80">
          <div className="flex justify-center min-w-full">
            <BiodataPrintSheet anggota={anggota} id="biodata-print-sheet" />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-2.5 flex items-center justify-between text-[11px] sm:text-xs text-gray-500 shrink-0">
          <span className="truncate mr-2">Biodata Resmi Yayasan Perjuangan Wahidiyah Kec. Cipayung</span>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-medium px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
