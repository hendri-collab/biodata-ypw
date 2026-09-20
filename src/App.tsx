/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnggotaWahidiyah } from './types/biodata';
import {
  getAnggotaList,
  saveAnggotaList,
  generateNextRegistrationNumber,
  INITIAL_DATA,
} from './utils/storage';
import { BiodataForm } from './components/BiodataForm';
import { AnggotaListView } from './components/AnggotaListView';
import { BiodataPreviewModal } from './components/BiodataPreviewModal';
import { RekapPreviewModal } from './components/RekapPreviewModal';
import { WahidiyahLogo } from './components/WahidiyahLogo';
import { exportAllAnggotaToExcel } from './utils/exportExcel';
import { exportRekapAnggotaToPdf } from './utils/exportRekapPdf';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  CheckCircle,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [anggotaList, setAnggotaList] = useState<AnggotaWahidiyah[]>([]);
  const [currentView, setCurrentView] = useState<'form' | 'list'>('form');
  const [editingAnggota, setEditingAnggota] = useState<AnggotaWahidiyah | null>(null);
  const [previewAnggota, setPreviewAnggota] = useState<AnggotaWahidiyah | null>(null);
  const [showRekapModal, setShowRekapModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const data = getAnggotaList();
    setAnggotaList(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handle Save (New or Edit)
  const handleSave = (formData: Omit<AnggotaWahidiyah, 'id'>, existingId?: string) => {
    let updatedList: AnggotaWahidiyah[];
    let savedItem: AnggotaWahidiyah;

    if (existingId) {
      // Edit existing
      savedItem = { ...formData, id: existingId };
      updatedList = anggotaList.map((item) => (item.id === existingId ? savedItem : item));
      showToast(`Biodata ${savedItem.namaLengkap} berhasil diperbarui! Silakan unduh PDF atau Excel.`);
    } else {
      // Create new
      const newId = `ypw-${Date.now()}`;
      const regNumber = formData.noRegistrasi || generateNextRegistrationNumber(anggotaList);
      savedItem = {
        ...formData,
        id: newId,
        noRegistrasi: regNumber,
      };
      updatedList = [savedItem, ...anggotaList];
      showToast(`Biodata ${savedItem.namaLengkap} berhasil disimpan! Anda sekarang dapat mengunduh PDF atau Excel.`);
    }

    setAnggotaList(updatedList);
    saveAnggotaList(updatedList);
    setEditingAnggota(null);
    setCurrentView('list'); // Switch directly to Rekam Data where downloads are located

    // Open preview modal for immediate verification & single-click PDF/Excel download
    setPreviewAnggota(savedItem);
  };

  const handleAddNew = () => {
    setEditingAnggota(null);
    setCurrentView('form');
  };

  const handleEdit = (item: AnggotaWahidiyah) => {
    setEditingAnggota(item);
    setCurrentView('form');
    setPreviewAnggota(null);
  };

  const handleDelete = (id: string) => {
    const updated = anggotaList.filter((item) => item.id !== id);
    setAnggotaList(updated);
    saveAnggotaList(updated);
    showToast('Data anggota telah dihapus.');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Muat ulang data contoh resmi Kecamatan Cipayung?')) {
      setAnggotaList(INITIAL_DATA);
      saveAnggotaList(INITIAL_DATA);
      showToast('Data contoh berhasil dimuat ulang.');
    }
  };

  const nextRegNumber = generateNextRegistrationNumber(anggotaList);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-fade-in max-w-md text-xs sm:text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Wahidiyah Identity */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-md border-b border-amber-600/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-3.5 text-left w-full md:w-auto">
            <div className="shrink-0 p-1 bg-white/10 rounded-full border border-amber-400/40 shadow-inner">
              <WahidiyahLogo size={44} className="sm:w-[54px] sm:h-[54px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
                  Kecamatan Cipayung
                </span>
                <span className="text-emerald-400">•</span>
                <span className="text-[10px] sm:text-[11px] text-emerald-200">
                  Jakarta Timur
                </span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-tight truncate sm:whitespace-normal">
                Pendataan Anggota Yayasan Perjuangan Wahidiyah
              </h1>
              <p className="text-[11px] sm:text-xs text-emerald-100/90 mt-0.5">
                Sistem Formulir Biodata &amp; Rekapitulasi Resmi
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/60">
            {/* Rekap PDF Button */}
            <button
              onClick={() => setShowRekapModal(true)}
              className="flex-1 md:flex-none justify-center bg-red-700/90 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg border border-red-500/50 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Lihat & Unduh Rekapitulasi Lengkap Semua Anggota ke PDF Resmi"
            >
              <FileText className="w-4 h-4 text-red-100" />
              <span>Rekap PDF</span>
            </button>

            {/* Rekap Excel Button */}
            <button
              onClick={() => exportAllAnggotaToExcel(anggotaList)}
              className="flex-1 md:flex-none justify-center bg-emerald-800/90 hover:bg-emerald-700 text-emerald-50 text-xs font-semibold px-3 py-2 rounded-lg border border-emerald-600/60 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Unduh rekapitulasi data anggota ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Rekap Excel</span>
            </button>

            {currentView === 'list' ? (
              <button
                onClick={handleAddNew}
                className="flex-1 md:flex-none justify-center bg-amber-500 hover:bg-amber-400 text-emerald-950 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">+ Formulir Baru</span>
                <span className="sm:hidden">+ Form</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingAnggota(null);
                  setCurrentView('list');
                }}
                className="flex-1 md:flex-none justify-center bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg border border-emerald-600 flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Daftar Anggota ({anggotaList.length})</span>
                <span className="sm:hidden">Daftar ({anggotaList.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Subnav / Kelurahan Strip */}
        <div className="bg-emerald-950/90 border-t border-emerald-800/60 px-3 sm:px-6 py-1.5 sm:py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] text-emerald-200">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
              <span className="font-bold text-amber-300 uppercase tracking-wider shrink-0">
                Wilayah Binaan:
              </span>
              <span className="text-emerald-100/80 whitespace-nowrap">
                Bambu Apus • Ceger • Cilangkap • Cipayung • Lubang Buaya • Munjul • Pondok Ranggon • Setu
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 shrink-0 ml-3">
              <button
                onClick={handleResetDemoData}
                className="text-emerald-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                title="Reset ke data contoh resmi"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Data Demo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 lg:p-8">
        {/* Navigation Tabs */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-300 pb-3">
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            <button
              onClick={() => {
                setEditingAnggota(null);
                setCurrentView('form');
              }}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all text-center ${
                currentView === 'form'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300'
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {editingAnggota ? 'Ubah Biodata' : 'Formulir Biodata'}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingAnggota(null);
                setCurrentView('list');
              }}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all text-center ${
                currentView === 'list'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Rekam Data ({anggotaList.length})</span>
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-gray-500">
            <span className="font-medium text-[11px] sm:text-xs">Standar Cetak:</span>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold text-[10px] sm:text-[11px] border border-emerald-300">
              ✓ Dokumen Resmi A4 &amp; Excel
            </span>
          </div>
        </div>

        {/* View Switching */}
        {currentView === 'form' ? (
          <BiodataForm
            initialData={editingAnggota}
            nextRegNumber={nextRegNumber}
            onSave={handleSave}
            onCancel={() => {
              setEditingAnggota(null);
              setCurrentView('list');
            }}
          />
        ) : (
          <AnggotaListView
            anggotaList={anggotaList}
            onAddNew={handleAddNew}
            onView={(anggota) => setPreviewAnggota(anggota)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenRekap={() => setShowRekapModal(true)}
          />
        )}
      </main>

      {/* Biodata Preview & Download Modal (Per Anggota - PDF & Excel) */}
      {previewAnggota && (
        <BiodataPreviewModal
          anggota={previewAnggota}
          onClose={() => setPreviewAnggota(null)}
          onEdit={(anggota) => {
            setPreviewAnggota(null);
            handleEdit(anggota);
          }}
        />
      )}

      {/* Rekapitulasi Semua Anggota Modal (PDF & Excel) */}
      {showRekapModal && (
        <RekapPreviewModal
          list={anggotaList}
          onClose={() => setShowRekapModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-5 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <WahidiyahLogo size={30} />
            <span className="font-semibold text-emerald-900 text-xs sm:text-sm">
              Yayasan Perjuangan Wahidiyah — Kecamatan Cipayung
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Formulir Pendataan Anggota Resmi (Tanpa NIK) • Dukungan Unduh PDF &amp; Excel
          </p>
        </div>
      </footer>
    </div>
  );
}
