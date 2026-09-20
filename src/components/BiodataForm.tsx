import React, { useState, useRef } from 'react';
import {
  AnggotaWahidiyah,
  DEFAULT_FORM_DATA,
  KELURAHAN_CIPAYUNG,
  GOLONGAN_PENGAMAL_LIST,
  AMANAH_STRUKTUR_LIST,
  AKTIVITAS_RUTIN_LIST,
  KEAHLIAN_POTENSI_LIST,
} from '../types/biodata';
import {
  User,
  MapPin,
  HeartHandshake,
  Upload,
  X,
  Save,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { exportSingleAnggotaToExcel } from '../utils/exportExcel';
import { exportElementToPdf } from '../utils/exportPdf';
import { processPasFoto } from '../utils/imageProcess';
import { BiodataPrintSheet } from './BiodataPrintSheet';
import { WahidiyahLogo } from './WahidiyahLogo';

interface BiodataFormProps {
  initialData?: AnggotaWahidiyah | null;
  onSave: (data: Omit<AnggotaWahidiyah, 'id'>, id?: string) => void;
  onCancel?: () => void;
  nextRegNumber: string;
}

export const BiodataForm: React.FC<BiodataFormProps> = ({
  initialData,
  onSave,
  onCancel,
  nextRegNumber,
}) => {
  const [formData, setFormData] = useState<Omit<AnggotaWahidiyah, 'id'>>(() => {
    if (initialData) {
      const { id: _, ...rest } = initialData;
      return rest;
    }
    return {
      ...DEFAULT_FORM_DATA,
      noRegistrasi: nextRegNumber,
    };
  });

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Auto-compute umur if tanggalLahir changes
      if (name === 'tanggalLahir' && value) {
        try {
          const birth = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
          }
          if (age >= 0) {
            updated.umur = age.toString();
          }
        } catch {
          // ignore
        }
      }

      return updated;
    });
  };

  // Handle Photo Upload (Convert and Auto-Crop to Standard 3:4 Pas Foto)
  const handlePhotoUpload = async (file: File) => {
    setPhotoError(null);
    if (!file.type.startsWith('image/')) {
      setPhotoError('Format file harus berupa gambar (JPG, PNG, atau WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError('Ukuran file foto maksimal 15MB.');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      // Automatically center-crop to 3:4 aspect ratio (450 x 600 px), optimize quality & dimensions
      const normalizedDataUrl = await processPasFoto(file, {
        targetWidth: 450,
        targetHeight: 600,
        quality: 0.9,
      });

      setFormData((prev) => ({
        ...prev,
        fotoUrl: normalizedDataUrl,
      }));
    } catch (err) {
      console.error('Error processing photo:', err);
      setPhotoError(
        err instanceof Error ? err.message : 'Gagal memproses dan menyesuaikan ukuran foto.'
      );
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  // Toggle array item (checkboxes)
  const toggleArrayItem = (field: 'aktivitasRutin' | 'potensiKeahlian', item: string) => {
    setFormData((prev) => {
      const currentList = prev[field] || [];
      const exists = currentList.includes(item);
      const updated = exists
        ? currentList.filter((x) => x !== item)
        : [...currentList, item];
      return {
        ...prev,
        [field]: updated,
      };
    });
  };

  const validate = () => {
    if (!formData.namaLengkap.trim()) {
      alert('Mohon masukkan Nama Lengkap anggota.');
      return false;
    }
    if (!formData.noHpWhatsapp.trim()) {
      alert('Mohon masukkan No. WhatsApp / HP.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData, initialData?.id);
  };

  // Quick Direct Download Excel from current form state
  const handleDirectExcel = () => {
    if (!formData.namaLengkap.trim()) {
      alert('Mohon isi minimal Nama Lengkap sebelum mengunduh Excel.');
      return;
    }
    const tempAnggota: AnggotaWahidiyah = {
      ...formData,
      id: initialData?.id || 'temp-export',
    };
    exportSingleAnggotaToExcel(tempAnggota);
  };

  // Quick Direct Download PDF from current form state
  const handleDirectPdf = async () => {
    if (!formData.namaLengkap.trim()) {
      alert('Mohon isi minimal Nama Lengkap sebelum mengunduh PDF.');
      return;
    }
    try {
      setIsExportingPdf(true);
      const cleanName = (formData.namaLengkap || 'Anggota').replace(/[^a-zA-Z0-9]/g, '_');
      await exportElementToPdf('form-live-print-sheet', `Biodata_Wahidiyah_Cipayung_${cleanName}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF langsung. Silakan simpan data terlebih dahulu.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleResetForm = () => {
    if (window.confirm('Kosongkan formulir biodata ini?')) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        noRegistrasi: nextRegNumber,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden print sheet for direct PDF download while filling */}
      <div className="hidden">
        <BiodataPrintSheet
          anggota={{ ...formData, id: initialData?.id || 'temp-id' }}
          id="form-live-print-sheet"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-emerald-950/15 overflow-hidden">
        {/* Form Title & Top Action Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-4 sm:p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <div className="shrink-0 p-1 bg-white/10 rounded-full border border-amber-400/30 shadow-inner">
                <WahidiyahLogo size={42} className="sm:w-[48px] sm:h-[48px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Formulir Resmi Kecamatan Cipayung</span>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight leading-snug">
                  {initialData ? 'Ubah Formulir Biodata Anggota' : 'Formulir Biodata Pendataan Anggota'}
                </h2>
              </div>
            </div>

            {/* Quick Actions at Top */}
            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 sm:flex-none justify-center text-xs bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 px-3 py-2 rounded-lg border border-emerald-500/40 flex items-center gap-1.5 transition-colors"
                title="Kosongkan formulir"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLivePreview(!showLivePreview)}
                className="flex-1 sm:flex-none justify-center text-xs bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="truncate">{showLivePreview ? 'Tutup Pratinjau' : 'Pratinjau Lembar Cetak'}</span>
              </button>
            </div>
          </div>

          {/* Registration Number Strip */}
          <div className="mt-3 sm:mt-4 pt-3 border-t border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-200 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-[11px] sm:text-xs">No. Registrasi:</span>
              <span className="font-mono bg-emerald-800 px-2 py-0.5 rounded text-amber-300 font-bold border border-emerald-700 text-xs">
                {formData.noRegistrasi || nextRegNumber}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <span className="font-semibold text-white">Tanggal Terdata:</span>
              <span>{formData.tanggalDaftar}</span>
            </div>
          </div>
        </div>

        {/* Live Preview Toggle View if opened */}
        {showLivePreview && (
          <div className="p-3 sm:p-5 lg:p-6 bg-slate-100 border-b border-gray-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
              <h3 className="font-bold text-gray-800 text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Pratinjau Lembar Fisik Dokumen Cetak (PDF / Kertas)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDirectPdf}
                  disabled={isExportingPdf}
                  className="flex-1 sm:flex-none justify-center bg-red-700 hover:bg-red-800 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? 'Memproses...' : 'Unduh PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDirectExcel}
                  className="flex-1 sm:flex-none justify-center bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Excel</span>
                </button>
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto overflow-x-auto border border-gray-300 rounded-xl p-2 bg-white shadow-inner">
              <BiodataPrintSheet
                anggota={{ ...formData, id: initialData?.id || 'live-preview' }}
                id="biodata-live-preview-box"
              />
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* ======================================================== */}
          {/* SECTION 1: DATA PRIBADI ANGGOTA (TANPA NIK)              */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-emerald-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-800" />
                  <span>Data Pribadi Anggota</span>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                    Tanpa NIK
                  </span>
                </h3>
                <p className="text-xs text-gray-500">Identitas dasar anggota pengamal Wahidiyah Kecamatan Cipayung</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-2">
              {/* Photo Upload Box */}
              <div className="lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Pas Foto Resmi (3 × 4 cm)
                  </label>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl bg-emerald-50/40 p-3 text-center relative transition-all flex flex-col items-center justify-center min-h-[260px]"
                >
                  {/* Processing / Loading State */}
                  {isProcessingPhoto ? (
                    <div className="flex flex-col items-center justify-center py-10">
                      <Loader2 className="w-8 h-8 text-emerald-700 animate-spin mb-2" />
                      <p className="text-xs font-bold text-emerald-900">Memproses Foto...</p>
                    </div>
                  ) : formData.fotoUrl ? (
                    /* Photo Uploaded */
                    <div className="flex flex-col items-center w-full">
                      {/* Fixed Aspect Ratio Frame */}
                      <div className="relative w-36 h-48 sm:w-40 sm:h-52 aspect-[3/4] rounded-lg overflow-hidden border-2 border-emerald-700 shadow-md bg-white group">
                        <img
                          src={formData.fotoUrl}
                          alt="Pas Foto Anggota"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Action buttons below photo */}
                      <div className="flex items-center gap-2 mt-3 w-full justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs bg-white text-emerald-800 font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-50 shadow-2xs flex items-center gap-1 transition-colors"
                          title="Ganti foto dengan berkas lain"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Ganti Foto</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, fotoUrl: '' }))}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-2.5 py-1.5 rounded-lg border border-red-200 shadow-2xs flex items-center gap-1 transition-colors"
                          title="Hapus foto ini"
                        >
                          <X className="w-3 h-3" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Upload Prompt */
                    <div className="flex flex-col items-center justify-center text-gray-500 py-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mb-2.5 shadow-2xs">
                        <Camera className="w-7 h-7" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">Tarik atau Pilih Pas Foto</p>
                      <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WEBP (Maks 15MB)</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 text-xs bg-white text-emerald-900 font-bold px-3 py-1.5 rounded-lg border border-emerald-400 hover:bg-emerald-50 shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pilih Berkas Foto</span>
                      </button>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </div>

                {photoError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                    {photoError}
                  </p>
                )}
              </div>

              {/* Personal Fields */}
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nama Lengkap (beserta gelar) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    placeholder="Contoh: H. Achmad Fauzi, S.Pd.I"
                    required
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nama Panggilan / Akrab
                  </label>
                  <input
                    type="text"
                    name="namaPanggilan"
                    value={formData.namaPanggilan}
                    onChange={handleChange}
                    placeholder="Contoh: Pak Fauzi"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white font-medium"
                  >
                    <option value="Laki-laki">Laki-laki (Ikhwan)</option>
                    <option value="Perempuan">Perempuan (Akhwat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status Pernikahan
                  </label>
                  <select
                    name="statusPernikahan"
                    value={formData.statusPernikahan}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                  >
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Duda">Duda</option>
                    <option value="Janda">Janda</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Jumlah Anak
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Orang</span>
                  </div>
                  <input
                    type="number"
                    name="jumlahAnak"
                    min="0"
                    max="25"
                    value={formData.jumlahAnak}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Golongan Darah
                  </label>
                  <select
                    name="golonganDarah"
                    value={formData.golonganDarah}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                  >
                    <option value="-">- Pilih Gol. Darah -</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                    <option value="Tidak Tahu">Tidak Tahu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pendidikan Terakhir
                  </label>
                  <select
                    name="pendidikanTerakhir"
                    value={formData.pendidikanTerakhir}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                  >
                    <option value="SD/MI">SD / MI</option>
                    <option value="SMP/MTs">SMP / MTs</option>
                    <option value="SMA/SMK/MA">SMA / SMK / MA</option>
                    <option value="Diploma (D1-D3)">Diploma (D1-D3)</option>
                    <option value="Sarjana (S1)">Sarjana (S1)</option>
                    <option value="Magister (S2)">Magister (S2)</option>
                    <option value="Doktor (S3)">Doktor (S3)</option>
                    <option value="Pondok Pesantren">Pondok Pesantren</option>
                  </select>
                </div>

                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Pekerjaan / Profesi / Bidang Usaha
                  </label>
                  <input
                    type="text"
                    name="pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    placeholder="Contoh: Guru, Karyawan Swasta, Wiraswasta, Ibu Rumah Tangga"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: KONTAK & DOMISILI (CIPAYUNG)                   */}
          {/* ======================================================== */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-emerald-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                  <span>Kontak &amp; Domisili Tempat Tinggal</span>
                </h3>
                <p className="text-xs text-gray-500">Alamat tinggal di wilayah Kecamatan Cipayung dan nomor kontak yang dapat dihubungi</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  No. WhatsApp / Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="noHpWhatsapp"
                  value={formData.noHpWhatsapp}
                  onChange={handleChange}
                  placeholder="Contoh: 0812-8901-2345"
                  required
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Contoh: pengamal@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Alamat Lengkap (Jalan, No. Rumah, Gang, Patokan)
                </label>
                <textarea
                  name="alamatJalan"
                  rows={2}
                  value={formData.alamatJalan}
                  onChange={handleChange}
                  placeholder="Contoh: Jl. Bambu Wulung No. 24 RT 04 RW 05, Gang Masjid"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  RT / RW
                </label>
                <input
                  type="text"
                  name="rtRw"
                  value={formData.rtRw}
                  onChange={handleChange}
                  placeholder="Contoh: 04 / 05"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kelurahan (Kec. Cipayung) <span className="text-red-500">*</span>
                </label>
                <select
                  name="kelurahan"
                  value={formData.kelurahan}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white font-bold text-emerald-950"
                >
                  {KELURAHAN_CIPAYUNG.map((kel) => (
                    <option key={kel} value={kel}>
                      {kel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  readOnly
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Kota / Kode Pos
                </label>
                <input
                  type="text"
                  name="kodePos"
                  value={formData.kodePos}
                  onChange={handleChange}
                  placeholder="Kode Pos: 13840"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SECTION 3: DATA KE-WAHIDIYAH-AN & KEAKTIFAN              */}
          {/* ======================================================== */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 pb-2 border-b-2 border-emerald-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-emerald-800" />
                  <span>Data Ke-Wahidiyah-an &amp; Amanah Organisasi</span>
                </h3>
                <p className="text-xs text-gray-500">Catatan pengamalan Sholawat Wahidiyah, keikutsertaan mujahadah, serta potensi keahlian</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tahun Mulai Mengamalkan Sholawat
                </label>
                <input
                  type="number"
                  name="tahunMulaiWahidiyah"
                  min="1960"
                  max={new Date().getFullYear()}
                  value={formData.tahunMulaiWahidiyah}
                  onChange={handleChange}
                  placeholder="Contoh: 2012"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none font-medium text-emerald-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Jalur Pengenalan Awal
                </label>
                <select
                  name="jalurPengenalan"
                  value={formData.jalurPengenalan}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white"
                >
                  <option value="Keluarga">Keluarga</option>
                  <option value="Teman / Sahabat">Teman / Sahabat</option>
                  <option value="Tetangga Lingkungan">Tetangga Lingkungan</option>
                  <option value="Majelis Ta'lim & Silaturahmi">Majelis Ta'lim &amp; Silaturahmi</option>
                  <option value="Siaran / Brosur Sholawat Wahidiyah">Siaran / Brosur Sholawat Wahidiyah</option>
                  <option value="Pengajian Akbar / Mujahadah">Pengajian Akbar / Mujahadah</option>
                  <option value="Media Sosial / Internet">Media Sosial / Internet</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Golongan Pengamal <span className="text-red-500">*</span>
                </label>
                <select
                  name="golonganPengamal"
                  value={formData.golonganPengamal}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white font-medium"
                >
                  {GOLONGAN_PENGAMAL_LIST.map((gol) => (
                    <option key={gol} value={gol}>
                      {gol}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Amanah / Struktur Organisasi di Cipayung <span className="text-red-500">*</span>
                </label>
                <select
                  name="amanahStruktur"
                  value={formData.amanahStruktur}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none bg-white font-bold text-gray-900"
                >
                  {AMANAH_STRUKTUR_LIST.map((am) => (
                    <option key={am} value={am}>
                      {am}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Tugas / Jabatan Spesifik
                </label>
                <input
                  type="text"
                  name="jabatanSpesifik"
                  value={formData.jabatanSpesifik}
                  onChange={handleChange}
                  placeholder="Contoh: Koordinator Halqoh RT 03"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
                />
              </div>
            </div>

            {/* Checkbox: Aktivitas Rutin Mujahadah */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Keikutsertaan Mujahadah Rutin
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-200">
                {AKTIVITAS_RUTIN_LIST.map((item) => {
                  const checked = formData.aktivitasRutin.includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors border ${
                        checked
                          ? 'bg-emerald-100/90 border-emerald-400 text-emerald-950 font-semibold shadow-2xs'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem('aktivitasRutin', item)}
                        className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Checkbox: Potensi Keahlian */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Potensi / Minat Keahlian Khusus (Untuk Pemberdayaan Yayasan)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 bg-amber-50/30 p-3.5 rounded-xl border border-amber-200">
                {KEAHLIAN_POTENSI_LIST.map((item) => {
                  const checked = formData.potensiKeahlian.includes(item);
                  return (
                    <label
                      key={item}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors border ${
                        checked
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-semibold shadow-2xs'
                          : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayItem('potensiKeahlian', item)}
                        className="mt-0.5 rounded text-amber-700 focus:ring-amber-600"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Catatan Khusus / Keterangan Tambahan
              </label>
              <textarea
                name="catatanKhusus"
                rows={2}
                value={formData.catatanKhusus}
                onChange={handleChange}
                placeholder="Catatan tambahan mengenai pengamal atau permohonan khusus..."
                className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-none"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR: HANYA TOMBOL SIMPAN */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/30">
          <div className="text-center sm:text-left">
            <p className="font-bold text-base text-amber-300">
              Selesai Pengisian Biodata
            </p>
            <p className="text-xs text-emerald-200 mt-0.5">
              Klik Simpan untuk menyimpan ke rekam data. Pengunduhan dokumen (PDF &amp; Excel) tersedia pada menu Rekam Data.
            </p>
          </div>

          <div className="flex items-center justify-center w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-emerald-950 font-extrabold text-sm px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-5 h-5" />
              <span>Simpan Data Anggota</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
