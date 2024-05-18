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
    const { nama, nohp } = req.body;

    try {
      // Membuat query untuk mencari barang dengan nama yang sama
      const q = query(collection(db, 'm_customer'), where('nama', '==', nama));

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
      const allDocsSnapshot = await getDocs(collection(db, 'm_customer'));
      const id = allDocsSnapshot.size + 1;
      const kode = nama.slice(0, 3).toUpperCase() + String(id).padStart(3, '0');

      await addDoc(collection(db, 'm_customer'), {
        id: id,
        kode: kode,
        nama: nama,
        nohp: nohp,
      });

      res.status(200).json({
        status: 'ok',
        message: 'Customer berhasil ditambahkan',
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menambahkan Customer',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'm_customer'));
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
