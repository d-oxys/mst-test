import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, setDoc, Timestamp, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';

type Data = {
  status: string;
  message: string;
  data?: any[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { barang, tanggalTransaksi, customer, totalHarga, diskon, ongkir, totalYangHarusDibayar, kodeTransaksi } = req.body;

    try {
      const docName =
        kodeTransaksi ||
        'TS_' +
          Timestamp.now()
            .toDate()
            .toISOString()
            .replace(/[^0-9]/g, '');

      // Menyimpan data ke dalam dokumen
      await setDoc(
        doc(db, 't_sales', docName),
        {
          barang: barang,
          tanggalTransaksi: tanggalTransaksi,
          customer: customer,
          totalHarga: totalHarga,
          diskon: diskon,
          ongkir: ongkir,
          totalYangHarusDibayar: totalYangHarusDibayar,
          kodeTransaksi: docName,
        },
        { merge: true }
      );

      res.status(200).json({
        status: 'ok',
        message: 'Transaksi berhasil ditambahkan',
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan saat menambahkan transaksi',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 't_sales'));
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
