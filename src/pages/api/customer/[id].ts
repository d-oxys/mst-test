import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';

type Data = {
  status: string;
  message: string;
  data?: any[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { nama, nohp } = req.body;
  const kode = req.method === 'DELETE' ? req.query.id : req.body.kode;

  // Membuat query untuk mencari barang dengan kode yang sama
  const q = query(collection(db, 'm_customer'), where('kode', '==', kode));

  // Menjalankan query
  const querySnapshot = await getDocs(q);

  // Jika barang dengan kode yang sama tidak ada, kirim pesan error
  if (querySnapshot.empty) {
    res.status(400).json({
      status: 'error',
      message: 'Customer tidak ditemukan',
    });
    return;
  }

  // Jika barang ditemukan, lanjutkan pembaruan atau penghapusan barang
  const docRef = doc(db, 'm_customer', querySnapshot.docs[0].id);

  if (req.method === 'PUT') {
    try {
      await updateDoc(docRef, {
        nama: nama,
        nohp: nohp,
      });

      res.status(200).json({
        status: 'ok',
        message: 'Customer berhasil diperbarui',
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat memperbarui barang',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteDoc(docRef);

      res.status(200).json({
        status: 'ok',
        message: 'Barang berhasil dihapus',
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menghapus barang',
      });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
