import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';
import bcrypt from 'bcrypt';

type Data = {
  status: string;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      // Cek apakah email sudah terdaftar
      const docRef = doc(collection(db, 'users'), email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Jika email sudah terdaftar, kirim pesan error
        res.status(400).json({
          status: 'alreadyRegistered',
          message: 'Email already registered',
        });
      } else {
        // Jika email belum terdaftar, lanjutkan pendaftaran

        // Enkripsi password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await setDoc(docRef, {
          name: name,
          email: email,
          password: hashedPassword, // Simpan password yang sudah dienkripsi
          role: 'user', // Tambahkan role sebagai 'user'
        });

        res.status(200).json({
          status: 'ok',
          message: 'register successfully',
        });
      }
    } catch (e) {
      console.error(e); // Menambahkan console log untuk mencetak detail kesalahan
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  } else {
    // Menangani permintaan selain POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
