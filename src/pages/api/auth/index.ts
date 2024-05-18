import type { NextApiRequest, NextApiResponse } from 'next';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseAdmin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type Data = {
  status: string;
  message: string;
  user?: {
    name: string;
    email: string;
    role: string;
    customer_id: number;
  };
  token?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Cek apakah email sudah terdaftar
      const docRef = doc(collection(db, 'users'), email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const user = docSnap.data();

        // Verifikasi password
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
          // Jika password valid, buat token JWT
          const token = jwt.sign({ name: user.name, email: user.email, role: user.role, customer_id: user.customer_id }, 'YOUR_JWT_SECRET', { expiresIn: '1h' });

          res.status(200).json({
            status: 'ok',
            message: 'logged in successfully',
            user: {
              name: user.name,
              email: user.email,
              role: user.role,
              customer_id: user.customer_id,
            },
            token: token,
          });
        } else {
          // Jika password tidak valid, kirim pesan error
          res.status(400).json({
            status: 'error',
            message: 'Invalid password',
          });
        }
      } else {
        // Jika email belum terdaftar, kirim pesan error
        res.status(400).json({
          status: 'error',
          message: 'Email not registered',
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
