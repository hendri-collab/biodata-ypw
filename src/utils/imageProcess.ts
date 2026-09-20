/**
 * Utility untuk memproses dan menstandarkan foto anggota
 * secara otomatis ke rasio Pas Foto resmi 3:4 (450 x 600 px)
 * agar rapi, proporsional, tidak gepeng/pecah, dan ukuran file konsisten.
 */

export interface ProcessImageOptions {
  targetWidth?: number; // default 450px
  targetHeight?: number; // default 600px (rasio 3:4)
  quality?: number; // default 0.88
}

export function processPasFoto(
  file: File,
  options: ProcessImageOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Format file harus berupa gambar (JPG, JPEG, PNG, atau WEBP).'));
    }

    const { targetWidth = 450, targetHeight = 600, quality = 0.88 } = options;
    const targetRatio = targetWidth / targetHeight; // 0.75 (3:4)

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas foto.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar foto.'));
      img.onload = () => {
        try {
          const originalWidth = img.naturalWidth || img.width;
          const originalHeight = img.naturalHeight || img.height;

          if (!originalWidth || !originalHeight) {
            return reject(new Error('Dimensi gambar tidak valid.'));
          }

          const originalRatio = originalWidth / originalHeight;

          let cropX = 0;
          let cropY = 0;
          let cropWidth = originalWidth;
          let cropHeight = originalHeight;

          if (originalRatio > targetRatio) {
            // Gambar terlalu lebar (landscape atau kotak) -> potong sisi kiri & kanan (center crop)
            cropWidth = originalHeight * targetRatio;
            cropX = (originalWidth - cropWidth) / 2;
          } else {
            // Gambar terlalu tinggi (portrait ekstrim) -> potong atas & bawah
            // Beri bobot 30% dari atas agar kepala/wajah pas foto tetap terlihat jelas
            cropHeight = originalWidth / targetRatio;
            cropY = Math.max(0, (originalHeight - cropHeight) * 0.3);
          }

          // Siapkan Canvas untuk rendering presisi
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return reject(new Error('Gagal menyiapkan rendering kanvas.'));
          }

          // Gambar latar belakang putih bersih
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Render gambar dengan smoothing tingkat tinggi
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );

          // Ekspor ke format JPEG terkompresi berkualitas tinggi
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Gagal memproses foto.'));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
