import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';

type Data = {
  status: string;
  message: string;
  data?: any[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { nama, harga } = req.body;

    try {
      // Membuat query untuk mencari barang dengan nama yang sama
      const q = query(collection(db, 'm_barang'), where('nama', '==', nama));

      // Menjalankan query
      const querySnapshot = await getDocs(q);

      // Jika barang dengan nama yang sama sudah ada, kirim pesan error
      if (!querySnapshot.empty) {
        res.status(400).json({
          status: 'error',
          message: 'Barang sudah tersedia',
        });
        return;
      }

      // Jika barang belum ada, lanjutkan penambahan barang
      const allDocsSnapshot = await getDocs(collection(db, 'm_barang'));
      const id = allDocsSnapshot.size + 1;
      const kode = nama.slice(0, 3).toUpperCase() + String(id).padStart(3, '0');

      await addDoc(collection(db, 'm_barang'), {
        id: id,
        kode: kode,
        nama: nama,
        harga: harga,
      });

      res.status(200).json({
        status: 'ok',
        message: 'Barang berhasil ditambahkan',
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menambahkan barang',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'm_barang'));
      const data = querySnapshot.docs.map((doc) => doc.data());

      res.status(200).json({
        status: 'ok',
        message: 'Data berhasil diambil',
        data: data,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat mengambil data',
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
