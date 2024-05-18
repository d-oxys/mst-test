import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';

type Data = {
  status: string;
  message: string;
  transaksi?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  const trimmedId = (id as string).trim();
  const docRef = doc(db, 't_sales', trimmedId);

  if (req.method === 'GET') {
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        res.status(200).json({
          status: 'ok',
          message: 'Transaksi fetched successfully!',
          transaksi: docSnap.data(),
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: `Transaksi with kode barang ${trimmedId} not found`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteDoc(docRef);

      res.status(200).json({
        status: 'ok',
        message: `Transaksi with kode barang ${trimmedId} deleted successfully!`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
