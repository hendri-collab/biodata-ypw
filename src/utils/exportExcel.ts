import * as XLSX from 'xlsx';
import { AnggotaWahidiyah } from '../types/biodata';

export function exportSingleAnggotaToExcel(anggota: AnggotaWahidiyah): void {
  const data = [
    ['YAYASAN PERJUANGAN WAHIDIYAH DAN PONDOK PESANTREN KEDUNGLO AL-MUNADHDHAROH'],
    ['KECAMATAN CIPAYUNG - KOTA ADMINISTRASI JAKARTA TIMUR'],
    ['FORMULIR BIODATA PENDATAAN ANGGOTA & PENGAMAL WAHIDIYAH (TANPA NIK)'],
    [''],
    ['NO. REGISTRASI', anggota.noRegistrasi || '-'],
    ['TANGGAL PENDAFTARAN', anggota.tanggalDaftar || '-'],
    [''],
    ['I. DATA PRIBADI', ''],
    ['Nama Lengkap', anggota.namaLengkap],
    ['Nama Panggilan', anggota.namaPanggilan || '-'],
    ['Jenis Kelamin', anggota.jenisKelamin],
    ['Tempat, Tanggal Lahir', `${anggota.tempatLahir}, ${anggota.tanggalLahir}`],
    ['Umur', anggota.umur ? `${anggota.umur} Tahun` : '-'],
    ['Status Pernikahan', anggota.statusPernikahan],
    ['Jumlah Anak', anggota.jumlahAnak !== undefined && anggota.jumlahAnak !== '' ? `${anggota.jumlahAnak} Orang` : '0 Orang'],
    ['Golongan Darah', anggota.golonganDarah || '-'],
    ['Pendidikan Terakhir', anggota.pendidikanTerakhir],
    ['Pekerjaan / Profesi', anggota.pekerjaan],
    [''],
    ['II. KONTAK & DOMISILI', ''],
    ['No. WhatsApp / HP', anggota.noHpWhatsapp],
    ['Alamat Email', anggota.email || '-'],
    ['Alamat Lengkap', anggota.alamatJalan],
    ['RT / RW', anggota.rtRw || '-'],
    ['Kelurahan', anggota.kelurahan],
    ['Kecamatan', anggota.kecamatan],
    ['Kota / Kabupaten', anggota.kota],
    ['Provinsi', anggota.provinsi],
    ['Kode Pos', anggota.kodePos || '-'],
    [''],
    ['III. DATA KE-WAHIDIYAH-AN', ''],
    ['Tahun Mulai Mengamalkan', anggota.tahunMulaiWahidiyah || '-'],
    ['Jalur Pengenalan', anggota.jalurPengenalan || '-'],
    ['Golongan Pengamal', anggota.golonganPengamal],
    ['Amanah Struktur Organisasi', anggota.amanahStruktur],
    ['Jabatan / Tugas Spesifik', anggota.jabatanSpesifik || '-'],
    ['Keikutsertaan Mujahadah Rutin', anggota.aktivitasRutin.join(', ') || '-'],
    ['Potensi & Minat Keahlian', anggota.potensiKeahlian.join(', ') || '-'],
    ['Catatan Khusus / Keterangan', anggota.catatanKhusus || '-'],
    [''],
    ['Dicetak otomatis oleh Sistem Pendataan Wahidiyah Kecamatan Cipayung', new Date().toLocaleDateString('id-ID')]
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 32 }, { wch: 60 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Biodata Anggota');

  const cleanName = (anggota.namaLengkap || 'Anggota').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `Biodata_Wahidiyah_Cipayung_${cleanName}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportAllAnggotaToExcel(list: AnggotaWahidiyah[]): void {
  const rows = list.map((item, index) => ({
    'No': index + 1,
    'No. Registrasi': item.noRegistrasi,
    'Tanggal Daftar': item.tanggalDaftar,
    'Nama Lengkap': item.namaLengkap,
    'Nama Panggilan': item.namaPanggilan || '-',
    'Jenis Kelamin': item.jenisKelamin,
    'Tempat Lahir': item.tempatLahir,
    'Tanggal Lahir': item.tanggalLahir,
    'Umur': item.umur || '-',
    'Status Pernikahan': item.statusPernikahan,
    'Jumlah Anak': item.jumlahAnak ?? '0',
    'Gol. Darah': item.golonganDarah || '-',
    'Pendidikan Terakhir': item.pendidikanTerakhir,
    'Pekerjaan': item.pekerjaan,
    'No. WhatsApp': item.noHpWhatsapp,
    'Email': item.email || '-',
    'Alamat Jalan': item.alamatJalan,
    'RT/RW': item.rtRw || '-',
    'Kelurahan': item.kelurahan,
    'Kecamatan': item.kecamatan,
    'Kota': item.kota,
    'Tahun Mulai Wahidiyah': item.tahunMulaiWahidiyah || '-',
    'Golongan Pengamal': item.golonganPengamal,
    'Amanah Organisasi': item.amanahStruktur,
    'Jabatan Spesifik': item.jabatanSpesifik || '-',
    'Mujahadah Rutin': item.aktivitasRutin.join('; '),
    'Potensi Keahlian': item.potensiKeahlian.join('; '),
    'Catatan': item.catatanKhusus || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data Anggota Wahidiyah');

  const currentDate = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `Data_Anggota_Wahidiyah_Cipayung_${currentDate}.xlsx`);
}
