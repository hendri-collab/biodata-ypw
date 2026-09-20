import { AnggotaWahidiyah } from '../types/biodata';

const STORAGE_KEY = 'ypw_cipayung_anggota_data_v1';

export const INITIAL_DATA: AnggotaWahidiyah[] = [
  {
    id: 'ypw-demo-1',
    noRegistrasi: 'YPW-CPY/2026/001',
    tanggalDaftar: '2026-01-15',
    namaLengkap: 'H. Achmad Fauzi, S.Pd.I',
    namaPanggilan: 'Pak Fauzi',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1978-06-12',
    umur: '48',
    statusPernikahan: 'Menikah',
    jumlahAnak: '3',
    golonganDarah: 'O',
    pendidikanTerakhir: 'Sarjana (S1)',
    pekerjaan: 'Guru / Tenaga Pendidik',
    fotoUrl: '',
    noHpWhatsapp: '0812-8901-2345',
    email: 'fauzi.cipayung@example.com',
    alamatJalan: 'Jl. Bambu Wulung No. 24 RT 04 RW 05',
    rtRw: '04 / 05',
    kelurahan: 'Bambu Apus',
    kecamatan: 'Cipayung',
    kota: 'Jakarta Timur',
    provinsi: 'DKI Jakarta',
    kodePos: '13890',
    tahunMulaiWahidiyah: '2012',
    jalurPengenalan: 'Majelis Ta\'lim & Silaturahmi',
    golonganPengamal: 'Bapak - Bapak',
    amanahStruktur: 'Ketua Pengurus Kecamatan',
    jabatanSpesifik: 'Koordinator Pembinaan & Mujahadah Wilayah Cipayung',
    aktivitasRutin: [
      'Mujahadah Yaumiyah (Harian di Rumah)',
      'Mujahadah Usbuiyyah (Pekanan Lingkungan/Kelurahan)',
      'Mujahadah Syahriyah (Bulanan Kecamatan Cipayung)',
      'Mujahadah Kubro (Pondok Pesantren Kedunglo, Kediri)',
    ],
    potensiKeahlian: [
      'Imam Sholat & Wirid/Doa',
      'Muballigh / Penceramah Wahidiyah',
      'Administrasi / Kesekretariatan',
    ],
    catatanKhusus: 'Aktif mengkoordinasikan kegiatan Mujahadah Syahriyah rutin putaran kelurahan se-Kecamatan Cipayung.',
  },
  {
    id: 'ypw-demo-2',
    noRegistrasi: 'YPW-CPY/2026/002',
    tanggalDaftar: '2026-02-10',
    namaLengkap: 'Hj. Siti Rohmah, M.E',
    namaPanggilan: 'Ibu Rohmah',
    jenisKelamin: 'Perempuan',
    tempatLahir: 'Kudus',
    tanggalLahir: '1983-09-24',
    umur: '43',
    statusPernikahan: 'Menikah',
    jumlahAnak: '2',
    golonganDarah: 'A',
    pendidikanTerakhir: 'Magister (S2)',
    pekerjaan: 'Dosen & Pengusaha',
    fotoUrl: '',
    noHpWhatsapp: '0857-1122-3344',
    email: 'siti.rohmah@example.com',
    alamatJalan: 'Jl. Monumen Pancasila Sakti No. 18',
    rtRw: '02 / 01',
    kelurahan: 'Lubang Buaya',
    kecamatan: 'Cipayung',
    kota: 'Jakarta Timur',
    provinsi: 'DKI Jakarta',
    kodePos: '13810',
    tahunMulaiWahidiyah: '2015',
    jalurPengenalan: 'Keluarga',
    golonganPengamal: 'Ibu - Ibu',
    amanahStruktur: 'Seksi Wanita Wahidiyah',
    jabatanSpesifik: 'Koordinator Pemberdayaan Wanita Wahidiyah Cipayung',
    aktivitasRutin: [
      'Mujahadah Yaumiyah (Harian di Rumah)',
      'Mujahadah Usbuiyyah (Pekanan Lingkungan/Kelurahan)',
      'Mujahadah Syahriyah (Bulanan Kecamatan Cipayung)',
    ],
    potensiKeahlian: [
      'Wirausaha / Koperasi / Pendanaan Usaha',
      'Dapur Umum / Konsumsi / Logistik Acara',
      'Administrasi / Kesekretariatan',
    ],
    catatanKhusus: 'Penggerak pengajian wanita wahidiyah dan kas sosial untuk santunan anak yatim dhuafa.',
  },
  {
    id: 'ypw-demo-3',
    noRegistrasi: 'YPW-CPY/2026/003',
    tanggalDaftar: '2026-03-01',
    namaLengkap: 'Muhammad Rizky Ramadhan',
    namaPanggilan: 'Rizky',
    jenisKelamin: 'Laki-laki',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2001-11-05',
    umur: '24',
    statusPernikahan: 'Belum Menikah',
    jumlahAnak: '0',
    golonganDarah: 'B',
    pendidikanTerakhir: 'Sarjana (S1)',
    pekerjaan: 'Desainer Grafis / IT Specialist',
    fotoUrl: '',
    noHpWhatsapp: '0878-9988-7766',
    email: 'rizky.wahidiyah@example.com',
    alamatJalan: 'Jl. Raya Cipayung Gg. Bina Asih No. 42',
    rtRw: '06 / 02',
    kelurahan: 'Cipayung',
    kecamatan: 'Cipayung',
    kota: 'Jakarta Timur',
    provinsi: 'DKI Jakarta',
    kodePos: '13840',
    tahunMulaiWahidiyah: '2019',
    jalurPengenalan: 'Teman Pengamal Muda',
    golonganPengamal: 'Remaja',
    amanahStruktur: 'Seksi Remaja & Pemuda Wahidiyah',
    jabatanSpesifik: 'Ketua Tim Publikasi & Dokumentasi Remaja Wahidiyah',
    aktivitasRutin: [
      'Mujahadah Yaumiyah (Harian di Rumah)',
      'Mujahadah Usbuiyyah (Pekanan Lingkungan/Kelurahan)',
      'Mujahadah Kubro (Pondok Pesantren Kedunglo, Kediri)',
    ],
    potensiKeahlian: [
      'Teknologi Informasi / Desain & Medsos',
      'Sholawat / Qasidah / Rebana',
      'Keamanan & Parkir Kegiatan Mujahadah',
    ],
    catatanKhusus: 'Mengelola flyer siaran, live streaming mujahadah, dan sound system kegiatan.',
  }
];

function normalizeGolongan(val: string): string {
  if (val === 'Pengamal Umum Dewasa') return 'Bapak - Bapak';
  if (val === 'Wanita Wahidiyah (PW)') return 'Ibu - Ibu';
  if (val === 'Remaja / Pemuda Wahidiyah' || val === 'Mahasiswa / Pelajar Wahidiyah') return 'Remaja';
  if (val === 'Kanak-kanak Wahidiyah') return 'Anak - Anak';
  return val;
}

export function getAnggotaList(): AnggotaWahidiyah[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => ({
        ...item,
        golonganPengamal: normalizeGolongan(item.golonganPengamal),
      }));
    }
    return INITIAL_DATA;
  } catch (err) {
    console.error('Failed to load anggota list', err);
    return INITIAL_DATA;
  }
}

export function saveAnggotaList(list: AnggotaWahidiyah[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save anggota list', err);
  }
}

export function generateNextRegistrationNumber(existingList: AnggotaWahidiyah[]): string {
  const currentYear = new Date().getFullYear();
  const count = existingList.length + 1;
  const padded = count.toString().padStart(3, '0');
  return `YPW-CPY/${currentYear}/${padded}`;
}
