import React, { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

type Barang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
};

type SignInFormProps = {
  setDataBarang: React.Dispatch<React.SetStateAction<Barang[]>>;
  closeModal: () => void;
  barangEdit: Barang | null;
  setBarangEdit: React.Dispatch<React.SetStateAction<Barang | null>>;
};

export default function SignInForm({ setDataBarang, closeModal, barangEdit, setBarangEdit }: SignInFormProps) {
  const [nama, setNama] = useState(barangEdit ? barangEdit.nama : '');
  const [harga, setHarga] = useState(barangEdit ? String(barangEdit.harga) : '');
  const resetForm = () => {
    setNama('');
    setHarga('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setHarga(formattedValue);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      let response;
      if (barangEdit) {
        response = await fetch(`/api/produk/${barangEdit.kode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kode: barangEdit.kode,
            nama: nama,
            harga: parseInt(harga.replace(/\./g, ''), 10),
          }),
        });
      } else {
        response = await fetch('/api/produk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nama: nama,
            harga: parseInt(harga.replace(/\./g, ''), 10),
          }),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message); // Menggunakan pesan error dari server
      }

      const data = await response.json();
      console.log(data);

      // Menambahkan data baru ke state dataBarang
      setDataBarang((prevData) => {
        if (barangEdit) {
          // Jika barangEdit ada, perbarui barang tersebut
          return prevData.map((barang) =>
            barang.id === barangEdit.id
              ? {
                  ...barang,
                  nama: nama,
                  harga: parseInt(harga.replace(/\./g, ''), 10),
                }
              : barang
          );
        } else {
          // Jika barangEdit tidak ada, tambahkan barang baru
          return [
            ...prevData,
            {
              id: prevData.length + 1,
              kode: nama.slice(0, 3).toUpperCase() + String(prevData.length + 1).padStart(3, '0'),
              nama: nama,
              harga: parseInt(harga.replace(/\./g, ''), 10),
            },
          ];
        }
      });

      toast.success('Barang berhasil ditambahkan!');
      closeModal();
      resetForm();
      setBarangEdit(null);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-9'>
      <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white md:w-[40rem]'>
        <div className='border-stroke px-6.5 dark:border-strokedark border-b py-4'>
          <h3 className='font-medium text-black dark:text-white'>Form Tambah Barang</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6.5'>
            <div className='mb-4.5'>
              <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Nama Barang</label>
              <input
                type='Text'
                placeholder='Masukan Nama Barang'
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
              />
            </div>
            <div>
              <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Harga</label>
              <input
                type='text'
                value={`RP. ${harga}`}
                onChange={handleInputChange}
                className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
              />
            </div>
            <button type='submit' className='bg-primary text-gray mt-8 flex w-full justify-center rounded p-3 font-medium hover:bg-opacity-90'>
              {barangEdit ? 'Edit' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
