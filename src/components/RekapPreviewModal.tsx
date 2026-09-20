import React, { useState } from 'react';
import { AnggotaWahidiyah, KELURAHAN_CIPAYUNG } from '../types/biodata';
import { exportRekapAnggotaToPdf } from '../utils/exportRekapPdf';
import { exportAllAnggotaToExcel } from '../utils/exportExcel';
import { WahidiyahLogo } from './WahidiyahLogo';
import {
  Download,
  FileSpreadsheet,
  Printer,
  X,
  CheckCircle,
  Loader2,
  Users,
  MapPin,
  Calendar,
} from 'lucide-react';

interface RekapPreviewModalProps {
  list: AnggotaWahidiyah[];
  onClose: () => void;
  currentFilterKelurahan?: string;
  currentFilterGolongan?: string;
}

export const RekapPreviewModal: React.FC<RekapPreviewModalProps> = ({
  list,
  onClose,
  currentFilterKelurahan = 'Semua',
  currentFilterGolongan = 'Semua',
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [scope, setScope] = useState<'all' | 'filtered'>('all');

  // Filter if user chose 'filtered'
  const displayList =
    scope === 'filtered'
      ? list.filter((item) => {
          const matchKel =
            currentFilterKelurahan === 'Semua' || item.kelurahan === currentFilterKelurahan;
          const matchGol =
            currentFilterGolongan === 'Semua' || item.golonganPengamal === currentFilterGolongan;
          return matchKel && matchGol;
        })
      : list;

  const totalLaki = displayList.filter((a) => a.jenisKelamin === 'Laki-laki').length;
  const totalPerempuan = displayList.filter((a) => a.jenisKelamin === 'Perempuan').length;

  const dateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      setDownloadSuccess(null);
      exportRekapAnggotaToPdf(displayList, {
        kelurahanFilter: scope === 'filtered' ? currentFilterKelurahan : 'Semua',
        golonganFilter: scope === 'filtered' ? currentFilterGolongan : 'Semua',
      });
      setDownloadSuccess('File Rekap PDF berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export Rekap PDF', err);
      alert('Terjadi kendala saat membuat file Rekap PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadExcel = () => {
    try {
      exportAllAnggotaToExcel(displayList);
      setDownloadSuccess('File Rekap Excel (.xlsx) berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Failed to export Excel', err);
      alert('Gagal mengunduh file Excel.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-1 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-auto flex flex-col max-h-[96vh] h-full sm:h-auto overflow-hidden border border-emerald-900/20">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white px-3 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 p-0.5 bg-white/10 rounded-full border border-amber-400/30">
              <WahidiyahLogo size={28} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-base tracking-wide truncate">
                Rekapitulasi Buku Induk Anggota Wahidiyah
              </h3>
              <p className="text-[10px] sm:text-xs text-emerald-200 truncate">
                Pengurus Kecamatan Cipayung - Jakarta Timur ({displayList.length} Anggota)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors shrink-0 ml-2"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-emerald-50/80 border-b border-emerald-200/60 px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shrink-0">
          {/* Scope selection if filters exist */}
          <div className="flex items-center gap-2">
            {(currentFilterKelurahan !== 'Semua' || currentFilterGolongan !== 'Semua') && (
              <div className="flex items-center bg-white border border-emerald-300 rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setScope('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    scope === 'all'
                      ? 'bg-emerald-800 text-white'
                      : 'text-gray-600 hover:text-emerald-900'
                  }`}
                >
                  Semua ({list.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('filtered')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    scope === 'filtered'
                      ? 'bg-emerald-800 text-white'
                      : 'text-gray-600 hover:text-emerald-900'
                  }`}
                >
                  Hasil Filter ({displayList.length})
                </button>
              </div>
            )}

            {downloadSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-900 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{downloadSuccess}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf || displayList.length === 0}
              className="flex-1 sm:flex-none justify-center bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
              title="Unduh Rekapitulasi Lengkap Semua Anggota ke PDF (Format A4 Resmi)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>Unduh Rekap PDF</span>
                </>
              )}
            </button>

            {/* Download Excel Button */}
            <button
              onClick={handleDownloadExcel}
              disabled={displayList.length === 0}
              className="flex-1 sm:flex-none justify-center bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
              title="Unduh Rekapitulasi Lengkap ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span>Unduh Rekap Excel</span>
            </button>

            {/* Print Direct */}
            <button
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              title="Cetak Dokumen atau Cetak PDF Menggunakan Browser"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Report Preview */}
        <div className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-6 bg-gray-100">
          <div className="bg-white text-gray-900 mx-auto p-4 sm:p-8 max-w-[1000px] border border-gray-300 shadow-sm rounded-lg print:shadow-none print:border-none print:p-2 text-xs sm:text-sm font-sans">
            {/* KOP SURAT */}
            <div className="flex items-center gap-3 sm:gap-4 pb-3 border-b-2 border-emerald-900">
              <div className="shrink-0">
                <WahidiyahLogo size={60} />
              </div>
              <div className="flex-1 text-center">
                <p className="text-[10px] sm:text-xs tracking-widest text-emerald-800 font-semibold mb-0.5">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <h2 className="text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide text-emerald-950 leading-snug">
                  Yayasan Perjuangan Wahidiyah
                </h2>
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-emerald-900 tracking-wide uppercase">
                  Dan Pondok Pesantren Kedunglo Al-Munadhdharoh
                </p>
                <h3 className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-gray-900 mt-0.5">
                  Pengurus Kecamatan Cipayung - Jakarta Timur
                </h3>
                <p className="text-[9px] sm:text-[11px] text-gray-600 mt-0.5">
                  Sekretariat: Wilayah Kecamatan Cipayung, Kota Administrasi Jakarta Timur, DKI Jakarta
                </p>
              </div>
              <div className="shrink-0 w-12 sm:w-16 hidden sm:flex flex-col items-center justify-center text-[9px] sm:text-[10px] text-emerald-800 font-semibold text-center border border-emerald-800/30 rounded p-1 bg-emerald-50/50">
                <span>YPW</span>
                <span>CIPAYUNG</span>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center my-4">
              <h3 className="font-bold text-base sm:text-lg text-emerald-950 uppercase tracking-wide">
                Rekapitulasi Data Anggota &amp; Pengamal Wahidiyah
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Kecamatan Cipayung, Kota Administrasi Jakarta Timur • Per Tanggal {dateStr}
              </p>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center">
                <span className="text-[10px] text-emerald-800 uppercase font-semibold block">
                  Total Terdata
                </span>
                <span className="text-base font-bold text-emerald-950">{displayList.length} Orang</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-center">
                <span className="text-[10px] text-blue-800 uppercase font-semibold block">
                  Laki-laki
                </span>
                <span className="text-base font-bold text-blue-950">{totalLaki} Orang</span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2.5 text-center">
                <span className="text-[10px] text-purple-800 uppercase font-semibold block">
                  Perempuan
                </span>
                <span className="text-base font-bold text-purple-950">{totalPerempuan} Orang</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                <span className="text-[10px] text-amber-800 uppercase font-semibold block">
                  Wilayah Binaan
                </span>
                <span className="text-base font-bold text-amber-950">8 Kelurahan</span>
              </div>
            </div>

            {/* Kelurahan Breakdown Badges */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-4 text-[11px] text-slate-700">
              <span className="font-bold text-emerald-900 block mb-1">
                Distribusi Anggota Per Kelurahan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {KELURAHAN_CIPAYUNG.map((kel) => {
                  const count = displayList.filter((a) => a.kelurahan === kel).length;
                  return (
                    <span
                      key={kel}
                      className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 rounded text-[11px]"
                    >
                      <MapPin className="w-2.5 h-2.5 text-emerald-700" />
                      <span>{kel}:</span>
                      <strong className="text-emerald-900">{count}</strong>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                <thead>
                  <tr className="bg-emerald-900 text-white font-bold">
                    <th className="py-2 px-2 text-center border-b border-emerald-950 w-8">No</th>
                    <th className="py-2 px-2 border-b border-emerald-950">No. Reg</th>
                    <th className="py-2 px-2 border-b border-emerald-950">Nama Lengkap</th>
                    <th className="py-2 px-1 text-center border-b border-emerald-950">L/P</th>
                    <th className="py-2 px-1 text-center border-b border-emerald-950">Umur</th>
                    <th className="py-2 px-2 border-b border-emerald-950">Kelurahan &amp; RT/RW</th>
                    <th className="py-2 px-2 border-b border-emerald-950">No. WhatsApp</th>
                    <th className="py-2 px-2 border-b border-emerald-950">Amanah / Golongan</th>
                    <th className="py-2 px-1 text-center border-b border-emerald-950">Mulai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayList.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
                    >
                      <td className="py-2 px-2 text-center font-medium text-gray-500">{idx + 1}</td>
                      <td className="py-2 px-2 font-mono font-semibold text-emerald-900">
                        {item.noRegistrasi || '-'}
                      </td>
                      <td className="py-2 px-2 font-bold text-gray-900">
                        {item.namaLengkap}
                        {item.namaPanggilan && (
                          <span className="text-[10px] font-normal text-gray-500 block">
                            ({item.namaPanggilan})
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-1 text-center font-medium">
                        {item.jenisKelamin === 'Laki-laki' ? 'L' : 'P'}
                      </td>
                      <td className="py-2 px-1 text-center text-gray-600">
                        {item.umur ? `${item.umur} th` : '-'}
                      </td>
                      <td className="py-2 px-2">
                        <span className="font-semibold text-emerald-950">{item.kelurahan}</span>
                        {item.rtRw && (
                          <span className="text-[10px] text-gray-500 block">RT/RW: {item.rtRw}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-emerald-800 font-medium">
                        {item.noHpWhatsapp}
                      </td>
                      <td className="py-2 px-2">
                        <span className="font-semibold text-gray-900 block">
                          {item.amanahStruktur}
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          {item.golonganPengamal}
                          {item.jabatanSpesifik ? ` • ${item.jabatanSpesifik}` : ''}
                        </span>
                      </td>
                      <td className="py-2 px-1 text-center font-medium text-gray-600">
                        {item.tahunMulaiWahidiyah || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Official Signatures */}
            <div className="mt-8 pt-6 border-t border-gray-300 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-gray-600">Mengetahui / Mengesahkan,</p>
                <p className="font-bold text-emerald-950 mt-1">
                  Ketua Yayasan Perjuangan Wahidiyah
                  <br />
                  Kecamatan Cipayung
                </p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-gray-300 italic text-[11px]">( Tanda Tangan &amp; Stempel )</span>
                </div>
                <p className="font-bold underline text-gray-900">( ............................................ )</p>
              </div>

              <div>
                <p className="text-gray-600">Jakarta Timur, {dateStr}</p>
                <p className="font-bold text-emerald-950 mt-1">
                  Sekretaris Yayasan Perjuangan Wahidiyah
                  <br />
                  Kecamatan Cipayung
                </p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-gray-300 italic text-[11px]">( Tanda Tangan &amp; Stempel )</span>
                </div>
                <p className="font-bold underline text-gray-900">( ............................................ )</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-gray-200 px-3 sm:px-6 py-2.5 flex items-center justify-between text-[11px] sm:text-xs text-gray-500 shrink-0">
          <span className="truncate mr-2">
            Dokumen Rekapitulasi Resmi YPW Kecamatan Cipayung Jakarta Timur
          </span>
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
