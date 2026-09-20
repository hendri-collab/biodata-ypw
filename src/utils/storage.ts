import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AnggotaWahidiyah } from '../types/biodata';

const COLLECTION_NAME = 'anggota';

// Mengambil seluruh data anggota secara real dari Firebase Firestore
export async function getAnggotaList(): Promise<AnggotaWahidiyah[]> {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const list: AnggotaWahidiyah[] = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
                id: docSnap.id,
                ...data
            } as AnggotaWahidiyah);
        });
        return list;
    } catch (err) {
        console.error('Gagal mengambil data dari Firebase:', err);
        return [];
    }
}

// Menyimpan data anggota baru langsung ke Firebase Firestore
export async function saveAnggotaToFirebase(data: AnggotaWahidiyah): Promise<void> {
    try {
        const { id, ...dataToSave } = data;
        await addDoc(collection(db, COLLECTION_NAME), dataToSave);
    } catch (err) {
        console.error('Gagal menyimpan data ke Firebase:', err);
        throw err;
    }
}

// Menghapus data anggota berdasarkan ID dari Firebase Firestore
export async function deleteAnggotaFromFirebase(id: string): Promise<void> {
    try {
        if (!id) throw new Error('ID tidak valid');
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (err) {
        console.error('Gagal menghapus data dari Firebase:', err);
        throw err;
    }
}

// Fungsi bantu untuk nomor registrasi otomatis
export function generateNextRegistrationNumber(existingList: AnggotaWahidiyah[]): string {
    const currentYear = new Date().getFullYear();
    const count = existingList.length + 1;
    const padded = count.toString().padStart(3, '0');
    return `YPW-CPY/${currentYear}/${padded}`;
}