'use client';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableProduk from '@/components/Tables/TableProduk';
import Modal from 'react-modal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SignInForm from '@/components/form/barangForm';
import { toast } from 'react-toastify';

type Barang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
};

const Product = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dataBarang, setDataBarang] = useState<Barang[]>([]);
  const [barangEdit, setBarangEdit] = useState<Barang | null>(null);

  const deleteBarang = async (kode: string) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus barang ini?');

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/produk/${kode}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setDataBarang((prevData) => prevData.filter((barang) => barang.kode !== kode));
        toast.success('Barang berhasil dihapus!');
      } catch (error: any) {
        console.log('Error:', error);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetch('/api/produk')
      .then((response) => response.json())
      .then((data) => setDataBarang(data.data));
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setBarangEdit(null);
  };

  const openModalEdit = (barang: Barang) => {
    setBarangEdit(barang);
    setModalIsOpen(true);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Barang' />
      <div className='flex flex-col gap-10'>
        <Link href='#' onClick={openModal} className='bg-primary inline-flex items-center justify-center rounded-md px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
          Tambah Barang
        </Link>
        <Modal
          className={`md:mt-30 lg:mt-46 lg:ml-46 sm:mt- mt-36 flex items-center justify-center bg-transparent`}
          isOpen={modalIsOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          contentLabel='Sign In Form'
          style={{
            overlay: {
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.01)',
            },
          }}
        >
          <SignInForm setDataBarang={setDataBarang} closeModal={closeModal} barangEdit={barangEdit} setBarangEdit={setBarangEdit} />
        </Modal>

        <TableProduk dataBarang={dataBarang} openModalEdit={openModalEdit} deleteBarang={deleteBarang} />
      </div>
    </DefaultLayout>
  );
};

export default Product;
