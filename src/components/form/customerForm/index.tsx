import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';

type Customer = {
  id: number;
  kode: string;
  nama: string;
  nohp: string; // ubah tipe nohp menjadi string
};

type CustomerFormProps = {
  setDataCustomer: React.Dispatch<React.SetStateAction<Customer[]>>;
  closeModal: () => void;
  customerEdit: Customer | null;
  setCustomerEdit: React.Dispatch<React.SetStateAction<Customer | null>>;
};

export default function SignInForm({ setDataCustomer, closeModal, customerEdit, setCustomerEdit }: CustomerFormProps) {
  const [nama, setNama] = useState(customerEdit ? customerEdit.nama : '');
  const [nohp, setNohp] = useState(customerEdit ? String(customerEdit.nohp) : '');
  const [formattedNohp, setFormattedNohp] = useState('');

  // Update nohp dan formattedNohp setiap kali customerEdit berubah
  useEffect(() => {
    if (customerEdit) {
      setNama(customerEdit.nama);
      setNohp(String(customerEdit.nohp));
      const formattedValue = String(customerEdit.nohp)
        .replace(/\D/g, '')
        .replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormattedNohp(formattedValue);
    }
  }, [customerEdit]);

  const resetForm = () => {
    setNama('');
    setNohp('');
    setFormattedNohp('');
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    setNohp(value.replace(/\D/g, ''));
    setFormattedNohp(formattedValue);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      let response;
      if (customerEdit) {
        response = await fetch(`/api/customer/${customerEdit.kode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kode: customerEdit.kode,
            nama: nama,
            nohp: nohp, // simpan sebagai string
          }),
        });
      } else {
        response = await fetch('/api/customer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nama: nama,
            nohp: nohp, // simpan sebagai string
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
      setDataCustomer((prevData) => {
        if (customerEdit) {
          // Jika customerEdit ada, perbarui Customer tersebut
          return prevData.map((Customer) =>
            Customer.id === customerEdit.id
              ? {
                  ...Customer,
                  nama: nama,
                  nohp: nohp, // simpan sebagai string
                }
              : Customer
          );
        } else {
          // Jika customerEdit tidak ada, tambahkan Customer baru
          return [
            ...prevData,
            {
              id: prevData.length + 1,
              kode: nama.slice(0, 3).toUpperCase() + String(prevData.length + 1).padStart(3, '0'),
              nama: nama,
              nohp: nohp, // simpan sebagai string
            },
          ];
        }
      });

      toast.success('Customer berhasil ditambahkan!');
      closeModal();
      resetForm();
      setCustomerEdit(null);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-9'>
      <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white md:w-[40rem]'>
        <div className='border-stroke px-6.5 dark:border-strokedark border-b py-4'>
          <h3 className='font-medium text-black dark:text-white'>Form Tambah Customer</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='p-6.5'>
            <div className='mb-4.5'>
              <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Nama Customer</label>
              <input
                type='Text'
                placeholder='Masukan Nama Customer'
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
              />
            </div>
            <div>
              <label className='mb-3 block text-sm font-medium text-black dark:text-white'>No HP</label>
              <input
                type='text'
                value={`${formattedNohp}`}
                onChange={handleInputChange}
                className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
              />
            </div>
            <button type='submit' className='bg-primary text-gray mt-8 flex w-full justify-center rounded p-3 font-medium hover:bg-opacity-90'>
              {customerEdit ? 'Edit' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
