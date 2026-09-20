export interface AnggotaWahidiyah {
  id: string;
  noRegistrasi: string;
  tanggalDaftar: string;
  
  // Data Pribadi (Tanpa NIK sesuai permintaan)
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  umur: string;
  statusPernikahan: 'Belum Menikah' | 'Menikah' | 'Duda' | 'Janda';
  jumlahAnak: string;
  golonganDarah: string;
  pendidikanTerakhir: string;
  pekerjaan: string;
  fotoUrl: string;

  // Kontak & Domisili (Kecamatan Cipayung)
  noHpWhatsapp: string;
  email: string;
  alamatJalan: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  provinsi: string;
  kodePos: string;

  // Data Ke-Wahidiyah-an
  tahunMulaiWahidiyah: string;
  jalurPengenalan: string;
  golonganPengamal: string;
  amanahStruktur: string;
  jabatanSpesifik: string;
  aktivitasRutin: string[];
  potensiKeahlian: string[];
  catatanKhusus: string;
}

export const KELURAHAN_CIPAYUNG = [
  'Bambu Apus',
  'Ceger',
  'Cilangkap',
  'Cipayung',
  'Lubang Buaya',
  'Munjul',
  'Pondok Ranggon',
  'Setu',
  'Lainnya (Sekitar Cipayung)',
] as const;

export const GOLONGAN_PENGAMAL_LIST = [
  'Bapak - Bapak',
  'Remaja',
  'Ibu - Ibu',
  'Anak - Anak',
] as const;

export const AMANAH_STRUKTUR_LIST = [
  'Anggota / Pengamal Biasa',
  'Penasehat / Pembina Kecamatan',
  'Ketua Pengurus Kecamatan',
  'Wakil Ketua Kecamatan',
  'Sekretaris Kecamatan',
  'Bendahara Kecamatan',
  'Seksi Siaran & Pembinaan',
  'Seksi Dana & Keuangan',
  'Seksi Remaja & Pemuda Wahidiyah',
  'Seksi Wanita Wahidiyah',
  'Imamah Kelurahan / Koordinator Lingkungan',
  'Koordinator Halqoh Mujahadah',
] as const;

export const AKTIVITAS_RUTIN_LIST = [
  'Mujahadah Yaumiyah (Harian di Rumah)',
  'Mujahadah Usbuiyyah (Pekanan Lingkungan/Kelurahan)',
  'Mujahadah Syahriyah (Bulanan Kecamatan Cipayung)',
  'Mujahadah Nishfus Sanah (Tingkat Kota / Wilayah)',
  'Mujahadah Kubro (Pondok Pesantren Kedunglo, Kediri)',
  'Pengajian / Khotmil Qur\'an Rutin',
  'Dzikir & Doa Bersama Pengamal',
] as const;

export const KEAHLIAN_POTENSI_LIST = [
  'Imam Sholat & Wirid/Doa',
  'Muballigh / Penceramah Wahidiyah',
  'Qari / Qari\'ah Tilawah Al-Qur\'an',
  'Sholawat / Qasidah / Rebana',
  'Administrasi / Kesekretariatan',
  'Teknologi Informasi / Desain & Medsos',
  'Dapur Umum / Konsumsi / Logistik Acara',
  'Kesehatan & Pertolongan Pertama',
  'Wirausaha / Koperasi / Pendanaan Usaha',
  'Keamanan & Parkir Kegiatan Mujahadah',
] as const;

export const DEFAULT_FORM_DATA: Omit<AnggotaWahidiyah, 'id'> = {
  noRegistrasi: '',
  tanggalDaftar: new Date().toISOString().split('T')[0],
  namaLengkap: '',
  namaPanggilan: '',
  jenisKelamin: 'Laki-laki',
  tempatLahir: 'Jakarta',
  tanggalLahir: '',
  umur: '',
  statusPernikahan: 'Menikah',
  jumlahAnak: '0',
  golonganDarah: '-',
  pendidikanTerakhir: 'SMA/SMK/MA',
  pekerjaan: 'Wiraswasta',
  fotoUrl: '',
  noHpWhatsapp: '',
  email: '',
  alamatJalan: '',
  rtRw: '',
  kelurahan: 'Cipayung',
  kecamatan: 'Cipayung',
  kota: 'Jakarta Timur',
  provinsi: 'DKI Jakarta',
  kodePos: '13840',
  tahunMulaiWahidiyah: new Date().getFullYear().toString(),
  jalurPengenalan: 'Keluarga',
  golonganPengamal: 'Bapak - Bapak',
  amanahStruktur: 'Anggota / Pengamal Biasa',
  jabatanSpesifik: '',
  aktivitasRutin: ['Mujahadah Yaumiyah (Harian di Rumah)', 'Mujahadah Usbuiyyah (Pekanan Lingkungan/Kelurahan)'],
  potensiKeahlian: ['Imam Sholat & Wirid/Doa'],
  catatanKhusus: '',
};
