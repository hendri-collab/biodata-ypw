import React, { useState, useMemo } from 'react';
import { AnggotaWahidiyah, KELURAHAN_CIPAYUNG, GOLONGAN_PENGAMAL_LIST } from '../types/biodata';
import { exportAllAnggotaToExcel, exportSingleAnggotaToExcel } from '../utils/exportExcel';
import { exportRekapAnggotaToPdf } from '../utils/exportRekapPdf';
import {
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  Calendar,
  Phone,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface AnggotaListViewProps {
  anggotaList: AnggotaWahidiyah[];
  onAddNew: () => void;
  onView: (anggota: AnggotaWahidiyah) => void;
  onEdit: (anggota: AnggotaWahidiyah) => void;
  onDelete: (id: string) => void;
  onOpenRekap?: () => void;
}

export const AnggotaListView: React.FC<AnggotaListViewProps> = ({
  anggotaList,
  onAddNew,
  onView,
  onEdit,
  onDelete,
  onOpenRekap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('Semua');
  const [selectedGolongan, setSelectedGolongan] = useState('Semua');

  // Filtered list
  const filteredList = useMemo(() => {
    return anggotaList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.namaLengkap.toLowerCase().includes(q) ||
        (item.namaPanggilan && item.namaPanggilan.toLowerCase().includes(q)) ||
        item.noHpWhatsapp.toLowerCase().includes(q) ||
        item.noRegistrasi.toLowerCase().includes(q) ||
        item.pekerjaan.toLowerCase().includes(q);

      const matchKelurahan =
        selectedKelurahan === 'Semua' || item.kelurahan === selectedKelurahan;

      const matchGolongan =
        selectedGolongan === 'Semua' || item.golonganPengamal === selectedGolongan;

      return matchSearch && matchKelurahan && matchGolongan;
    });
  }, [anggotaList, searchQuery, selectedKelurahan, selectedGolongan]);

  // Statistics
  const stats = useMemo(() => {
    const total = anggotaList.length;
    const laki = anggotaList.filter((a) => a.jenisKelamin === 'Laki-laki').length;
    const perempuan = anggotaList.filter((a) => a.jenisKelamin === 'Perempuan').length;
    const pengurus = anggotaList.filter((a) => a.amanahStruktur !== 'Anggota / Pengamal Biasa').length;

    return { total, laki, perempuan, pengurus };
  }, [anggotaList]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Anggota</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold">L</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Ikhwan (Laki-laki)</p>
            <p className="text-xl font-bold text-gray-900">{stats.laki}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold">P</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Akhwat (Perempuan)</p>
            <p className="text-xl font-bold text-gray-900">{stats.perempuan}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-900/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pengurus & Koordinator</p>
            <p className="text-xl font-bold text-gray-900">{stats.pengurus}</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-emerald-950/10 overflow-hidden">
        {/* Table Controls */}
        <div className="p-3 sm:p-4 md:p-5 border-b border-gray-200 bg-gray-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, no WA, no registrasi..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none shadow-2xs"
            />
          </div>

          {/* Filters & Actions */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Filter Kelurahan */}
            <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-2 sm:px-2.5 py-1.5 rounded-lg shadow-2xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={selectedKelurahan}
                onChange={(e) => setSelectedKelurahan(e.target.value)}
                className="bg-transparent outline-none font-medium text-gray-700 w-full text-xs"
              >
                <option value="Semua">Semua Kelurahan</option>
                {KELURAHAN_CIPAYUNG.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Golongan */}
            <div className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-2 sm:px-2.5 py-1.5 rounded-lg shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <select
                value={selectedGolongan}
                onChange={(e) => setSelectedGolongan(e.target.value)}
                className="bg-transparent outline-none font-medium text-gray-700 w-full text-xs"
              >
                <option value="Semua">Semua Golongan</option>
                {GOLONGAN_PENGAMAL_LIST.map((gol) => (
                  <option key={gol} value={gol}>
                    {gol}
                  </option>
                ))}
              </select>
            </div>

            {/* Bulk Export to PDF */}
            <button
              onClick={() => {
                if (onOpenRekap) {
                  onOpenRekap();
                } else {
                  exportRekapAnggotaToPdf(filteredList, {
                    kelurahanFilter: selectedKelurahan,
                    golonganFilter: selectedGolongan,
                  });
                }
              }}
              className="text-xs bg-red-700 hover:bg-red-800 text-white font-bold px-2.5 sm:px-3 py-2 rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
              title="Unduh rekapitulasi seluruh anggota ke dokumen PDF resmi (A4 Landscape)"
            >
              <FileText className="w-3.5 h-3.5 text-red-100 shrink-0" />
              <span className="truncate">Rekap PDF</span>
            </button>

            {/* Bulk Export to Excel */}
            <button
              onClick={() => exportAllAnggotaToExcel(anggotaList)}
              className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-2.5 sm:px-3 py-2 rounded-lg border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              title="Unduh rekapitulasi seluruh anggota ke file Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">Ekspor Excel</span>
            </button>

            {/* Add New Member Button */}
            <button
              onClick={onAddNew}
              className="text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 sm:px-3.5 py-2 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Tambah</span>
            </button>
          </div>
        </div>

        {/* Members List (Mobile Cards + Desktop Table) */}
        <div>
          {filteredList.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Tidak ada data anggota yang cocok</p>
              <p className="text-xs text-gray-400 mt-1">
                Silakan ubah filter pencarian atau klik tombol "Tambah Anggota" untuk mendaftarkan anggota baru.
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE & TABLET CARD VIEW (Screens < md) */}
              <div className="block md:hidden divide-y divide-gray-100">
                {filteredList.map((item) => (
                  <div key={item.id} className="p-3.5 sm:p-4 hover:bg-emerald-50/30 transition-colors">
                    <div className="flex items-start gap-3">
                      {item.fotoUrl ? (
                        <img
                          src={item.fotoUrl}
                          alt={item.namaLengkap}
                          className="w-12 h-16 aspect-[3/4] object-cover rounded-md border border-gray-300 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 aspect-[3/4] rounded-md bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200 shadow-2xs">
                          {item.namaLengkap.charAt(0)}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono font-bold text-[11px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                            {item.noRegistrasi || '-'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {item.tanggalDaftar}
                          </span>
                        </div>

                        <h4 className="font-bold text-gray-900 text-sm leading-tight truncate">
                          {item.namaLengkap}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium mt-1">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{item.noHpWhatsapp}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="inline-block bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                            Kel. {item.kelurahan}
                          </span>
                          <span className="inline-block bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded text-[10px]">
                            {item.amanahStruktur}
                          </span>
                          <span className="inline-block bg-amber-100 text-amber-900 font-medium px-2 py-0.5 rounded text-[10px]">
                            {item.golonganPengamal}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Card Action Buttons */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-gray-100">
                      <div className="flex items-center gap-2 flex-1">
                        <button
                          onClick={() => onView(item)}
                          className="flex-1 bg-red-700 hover:bg-red-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                          title="Unduh Lembar Biodata Resmi (PDF)"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => exportSingleAnggotaToExcel(item)}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
                          title="Unduh Data Anggota Ini ke Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Excel</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg text-xs transition-colors"
                          title="Ubah data anggota"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus data ${item.namaLengkap}?`)) {
                              onDelete(item.id);
                            }
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg text-xs transition-colors"
                          title="Hapus data anggota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE VIEW (Screens >= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-emerald-950/5 border-b border-gray-200 text-gray-700 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-3 px-4">No. Registrasi</th>
                      <th className="py-3 px-4">Nama Lengkap & Kontak</th>
                      <th className="py-3 px-4">Domisili Cipayung</th>
                      <th className="py-3 px-4">Amanah / Golongan</th>
                      <th className="py-3 px-4">Mulai Beramal</th>
                      <th className="py-3 px-4 text-center">Aksi / Unduh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredList.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-emerald-50/40 transition-colors group"
                      >
                        {/* Registrasi */}
                        <td className="py-3 px-4 align-top">
                          <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-900 px-2 py-1 rounded border border-emerald-200 inline-block">
                            {item.noRegistrasi || '-'}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{item.tanggalDaftar}</span>
                          </p>
                        </td>

                        {/* Nama & Kontak */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-start gap-3">
                            {item.fotoUrl ? (
                              <img
                                src={item.fotoUrl}
                                alt={item.namaLengkap}
                                className="w-9 h-12 aspect-[3/4] object-cover rounded border border-gray-300 shadow-2xs shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-12 aspect-[3/4] rounded bg-emerald-100/70 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 shadow-2xs">
                                {item.namaLengkap.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{item.namaLengkap}</p>
                              {item.namaPanggilan && (
                                <p className="text-xs text-gray-500">Panggilan: {item.namaPanggilan}</p>
                              )}
                              <p className="text-xs text-emerald-800 font-medium flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3" />
                                <span>{item.noHpWhatsapp}</span>
                              </p>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {item.jenisKelamin}
                                {item.umur ? ` • ${item.umur} thn` : ''}
                                {` • ${item.statusPernikahan}`}
                                {item.jumlahAnak !== undefined && item.jumlahAnak !== '' ? ` (${item.jumlahAnak} anak)` : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Domisili */}
                        <td className="py-3 px-4 align-top">
                          <span className="inline-block bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded text-xs mb-0.5">
                            Kel. {item.kelurahan}
                          </span>
                          <p className="text-xs text-gray-600 line-clamp-1">{item.alamatJalan}</p>
                          {item.rtRw && (
                            <p className="text-[11px] text-gray-400">RT/RW: {item.rtRw}</p>
                          )}
                        </td>

                        {/* Amanah / Golongan */}
                        <td className="py-3 px-4 align-top">
                          <p className="font-semibold text-gray-900 text-xs">{item.amanahStruktur}</p>
                          <p className="text-[11px] text-emerald-700">{item.golonganPengamal}</p>
                          {item.jabatanSpesifik && (
                            <p className="text-[10px] text-gray-500 italic mt-0.5">{item.jabatanSpesifik}</p>
                          )}
                        </td>

                        {/* Tahun Mulai */}
                        <td className="py-3 px-4 align-top text-xs text-gray-700 font-medium">
                          {item.tahunMulaiWahidiyah ? `Th. ${item.tahunMulaiWahidiyah}` : '-'}
                        </td>

                        {/* Aksi & Unduh */}
                        <td className="py-3 px-4 align-top text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Unduh PDF (Buka Lembar Resmi & Download PDF) */}
                            <button
                              onClick={() => onView(item)}
                              className="bg-red-700 hover:bg-red-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                              title="Unduh Lembar Biodata Resmi (PDF)"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Unduh PDF</span>
                            </button>

                            {/* Unduh Excel (.xlsx) perorangan */}
                            <button
                              onClick={() => exportSingleAnggotaToExcel(item)}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                              title="Unduh Data Anggota Ini ke Excel (.xlsx)"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5" />
                              <span>Excel</span>
                            </button>

                            {/* Ubah */}
                            <button
                              onClick={() => onEdit(item)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-lg text-xs transition-colors"
                              title="Ubah data anggota"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Hapus */}
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus data ${item.namaLengkap}?`)) {
                                  onDelete(item.id);
                                }
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg text-xs transition-colors"
                              title="Hapus data anggota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-gray-50 p-3.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>
            Menampilkan <strong>{filteredList.length}</strong> dari <strong>{anggotaList.length}</strong> anggota terdata
          </span>
          <span className="text-emerald-900 font-medium">
            Yayasan Perjuangan Wahidiyah • Kecamatan Cipayung (Jakarta Timur)
          </span>
        </div>
      </div>
    </div>
  );
};
