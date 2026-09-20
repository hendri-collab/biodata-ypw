import React from 'react';
import { AnggotaWahidiyah } from '../types/biodata';
import { WahidiyahLogo } from './WahidiyahLogo';

interface BiodataPrintSheetProps {
  anggota: AnggotaWahidiyah;
  id?: string;
}

export const BiodataPrintSheet: React.FC<BiodataPrintSheetProps> = ({
  anggota,
  id = 'biodata-print-sheet',
}) => {
  // Format Indonesian date
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate age if birthdate exists
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const birth = new Date(dateStr);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? ` (${age} tahun)` : '';
    } catch {
      return '';
    }
  };

  return (
    <div
      id={id}
      className="bg-white text-gray-900 mx-auto p-4 sm:p-6 md:p-8 w-full max-w-[800px] border border-gray-300 shadow-sm print:shadow-none print:border-none print:p-4 print:max-w-none text-xs sm:text-sm font-sans"
      style={{ minHeight: '1050px', backgroundColor: '#ffffff' }}
    >
      {/* KOP SURAT RESMI YAYASAN PERJUANGAN WAHIDIYAH */}
      <div className="flex items-center gap-2.5 sm:gap-4 pb-3 border-b-2 border-emerald-900">
        <div className="shrink-0">
          <WahidiyahLogo size={56} className="sm:w-[74px] sm:h-[74px]" />
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
            Kecamatan Cipayung - Jakarta Timur
          </h3>
          <p className="text-[9px] sm:text-[11px] text-gray-600 mt-0.5">
            Sekretariat: Wilayah Kecamatan Cipayung, Kota Administrasi Jakarta Timur, DKI Jakarta
          </p>
        </div>
        <div className="shrink-0 w-12 sm:w-[74px] hidden xs:flex sm:flex flex-col items-center justify-center text-[9px] sm:text-[10px] text-emerald-800 font-semibold text-center border border-emerald-800/30 rounded p-1 bg-emerald-50/50">
          <span>YPW</span>
          <span>CIPAYUNG</span>
        </div>
      </div>

      {/* DOUBLE DIVIDER LINE */}
      <div className="border-b border-gray-800 mt-0.5 mb-4"></div>

      {/* DOCUMENT TITLE & REGISTRATION */}
      <div className="text-center mb-5 relative">
        <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider text-gray-900 inline-block border-b border-gray-900 pb-0.5">
          Formulir Biodata Pendataan Anggota
        </h1>
        <p className="text-xs font-semibold text-emerald-800 uppercase tracking-widest mt-1">
          Kecamatan Cipayung — Jakarta Timur
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded">
          <div>
            <span className="font-semibold text-gray-700">No. Registrasi: </span>
            <span className="font-mono font-bold text-emerald-900">{anggota.noRegistrasi || '-'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Tanggal Terdata: </span>
            <span>{formatDateIndo(anggota.tanggalDaftar)}</span>
          </div>
        </div>
      </div>

      {/* TOP SECTION: PHOTO & BASIC INFO */}
      <div className="flex flex-col sm:flex-row gap-5 mb-5">
        {/* PAS FOTO 3X4 BOX */}
        <div className="sm:w-36 shrink-0 flex flex-col items-center order-last sm:order-first">
          <div className="w-30 h-40 aspect-[3/4] border-2 border-gray-400 rounded-sm flex flex-col items-center justify-center p-0.5 bg-gray-50 overflow-hidden text-center shadow-2xs">
            {anggota.fotoUrl ? (
              <img
                src={anggota.fotoUrl}
                alt={`Foto ${anggota.namaLengkap}`}
                className="w-full h-full object-cover rounded-xs"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-2">
                <svg
                  className="w-10 h-10 mb-1 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-[11px] font-medium text-gray-500">Pas Foto</span>
                <span className="text-[10px] text-gray-400">3 × 4 cm</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 font-medium text-center">
            Pas Foto Resmi Anggota
          </span>
        </div>

        {/* SECTION 1: DATA PRIBADI (TANPA NIK) */}
        <div className="flex-1">
          <div className="bg-emerald-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-t">
            I. Data Pribadi Anggota (Tanpa NIK)
          </div>
          <table className="w-full text-xs border border-gray-300 border-t-0">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="w-36 p-1.5 font-semibold bg-gray-50 text-gray-700">Nama Lengkap</td>
                <td className="p-1.5 font-bold text-gray-900">{anggota.namaLengkap || '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Nama Panggilan</td>
                <td className="p-1.5">{anggota.namaPanggilan || '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Jenis Kelamin</td>
                <td className="p-1.5">{anggota.jenisKelamin}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Tempat, Tgl Lahir</td>
                <td className="p-1.5">
                  {anggota.tempatLahir ? `${anggota.tempatLahir}, ` : ''}
                  {formatDateIndo(anggota.tanggalLahir)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Umur</td>
                <td className="p-1.5 font-medium">
                  {anggota.umur ? `${anggota.umur} Tahun` : (calculateAge(anggota.tanggalLahir) ? calculateAge(anggota.tanggalLahir).replace(/[()]/g, '') : '-')}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Status Pernikahan</td>
                <td className="p-1.5">{anggota.statusPernikahan}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Jumlah Anak</td>
                <td className="p-1.5 font-medium">
                  {anggota.jumlahAnak !== undefined && anggota.jumlahAnak !== '' ? `${anggota.jumlahAnak} Orang` : '0 Orang'}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Golongan Darah</td>
                <td className="p-1.5 font-medium">{anggota.golonganDarah || '-'}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Pendidikan Terakhir</td>
                <td className="p-1.5">{anggota.pendidikanTerakhir}</td>
              </tr>
              <tr>
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Pekerjaan / Profesi</td>
                <td className="p-1.5">{anggota.pekerjaan || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: KONTAK & DOMISILI */}
      <div className="mb-5">
        <div className="bg-emerald-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-t">
          II. Data Kontak & Domisili (Wilayah Cipayung)
        </div>
        <table className="w-full text-xs border border-gray-300 border-t-0">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="w-36 p-1.5 font-semibold bg-gray-50 text-gray-700">No. WhatsApp / HP</td>
              <td className="p-1.5 font-mono font-bold text-gray-900">{anggota.noHpWhatsapp || '-'}</td>
              <td className="w-28 p-1.5 font-semibold bg-gray-50 text-gray-700">Alamat Email</td>
              <td className="p-1.5">{anggota.email || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Alamat Lengkap</td>
              <td colSpan={3} className="p-1.5 font-medium">{anggota.alamatJalan || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">RT / RW</td>
              <td className="p-1.5">{anggota.rtRw || '-'}</td>
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Kelurahan</td>
              <td className="p-1.5 font-semibold text-emerald-900">{anggota.kelurahan || '-'}</td>
            </tr>
            <tr>
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Kecamatan</td>
              <td className="p-1.5">{anggota.kecamatan}</td>
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Kota / Kode Pos</td>
              <td className="p-1.5">{anggota.kota} {anggota.kodePos ? `(${anggota.kodePos})` : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 3: DATA KE-WAHIDIYAH-AN */}
      <div className="mb-6">
        <div className="bg-emerald-900 text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-t">
          III. Data Ke-Wahidiyah-an & Keaktifan
        </div>
        <table className="w-full text-xs border border-gray-300 border-t-0">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="w-44 p-1.5 font-semibold bg-gray-50 text-gray-700">Tahun Mulai Mengamalkan</td>
              <td className="p-1.5 font-semibold text-emerald-900">
                Tahun {anggota.tahunMulaiWahidiyah || '-'}
              </td>
              <td className="w-32 p-1.5 font-semibold bg-gray-50 text-gray-700">Jalur Pengenalan</td>
              <td className="p-1.5">{anggota.jalurPengenalan || '-'}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Golongan Pengamal</td>
              <td className="p-1.5 font-medium">{anggota.golonganPengamal}</td>
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Amanah Organisasi</td>
              <td className="p-1.5 font-bold text-gray-900">{anggota.amanahStruktur}</td>
            </tr>
            {anggota.jabatanSpesifik && (
              <tr className="border-b border-gray-200">
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700">Jabatan / Peran Spesifik</td>
                <td colSpan={3} className="p-1.5">{anggota.jabatanSpesifik}</td>
              </tr>
            )}
            <tr className="border-b border-gray-200">
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700 align-top">
                Keikutsertaan Mujahadah
              </td>
              <td colSpan={3} className="p-1.5">
                {anggota.aktivitasRutin && anggota.aktivitasRutin.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {anggota.aktivitasRutin.map((act, i) => (
                      <span
                        key={i}
                        className="inline-block bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded text-[11px]"
                      >
                        ✓ {act}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Belum terdata</span>
                )}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="p-1.5 font-semibold bg-gray-50 text-gray-700 align-top">
                Potensi / Minat Keahlian
              </td>
              <td colSpan={3} className="p-1.5">
                {anggota.potensiKeahlian && anggota.potensiKeahlian.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {anggota.potensiKeahlian.map((pot, i) => (
                      <span
                        key={i}
                        className="inline-block bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px]"
                      >
                        ★ {pot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 italic">Belum terdata</span>
                )}
              </td>
            </tr>
            {anggota.catatanKhusus && (
              <tr>
                <td className="p-1.5 font-semibold bg-gray-50 text-gray-700 align-top">
                  Catatan / Keterangan
                </td>
                <td colSpan={3} className="p-1.5 text-gray-700 italic">
                  {anggota.catatanKhusus}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PENGESAHAN / TANDA TANGAN */}
      <div className="pt-2 text-xs">
        <div className="grid grid-cols-2 gap-8 text-center">
          {/* KOLOM KIRI: PENGURUS KECAMATAN */}
          <div className="flex flex-col items-center justify-between h-36">
            <div>
              <p className="font-semibold text-gray-800">Mengetahui,</p>
              <p className="font-bold text-emerald-950 uppercase text-[11px]">
                Yayasan Perjuangan Wahidiyah
              </p>
              <p className="font-bold text-gray-800 text-[11px]">Kecamatan Cipayung</p>
            </div>
            <div className="w-full">
              <p className="text-gray-400 text-[10px] mb-1">(Tanda tangan & Stempel)</p>
              <p className="font-bold border-b border-gray-700 inline-block px-10 pb-0.5">
                ( ..................................................... )
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">Ketua / Sekretaris</p>
            </div>
          </div>

          {/* KOLOM KANAN: ANGGOTA BERSANGKUTAN */}
          <div className="flex flex-col items-center justify-between h-36">
            <div>
              <p className="text-gray-700">
                Cipayung, {formatDateIndo(anggota.tanggalDaftar || new Date().toISOString())}
              </p>
              <p className="font-semibold text-gray-800">Anggota / Pengamal yang Bersangkutan,</p>
            </div>
            <div className="w-full">
              <p className="text-gray-400 text-[10px] mb-1">(Tanda tangan asli)</p>
              <p className="font-bold border-b border-gray-700 inline-block px-8 pb-0.5 text-gray-900">
                ( {anggota.namaLengkap || '.....................................................'} )
              </p>
              <p className="text-[10px] text-gray-600 mt-0.5">Nama Terang</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
          <span>Formulir Pendataan Resmi — Yayasan Perjuangan Wahidiyah Kec. Cipayung</span>
          <span>Dicetak tanpa Nomor Induk Kependudukan (NIK)</span>
        </div>
      </div>
    </div>
  );
};
