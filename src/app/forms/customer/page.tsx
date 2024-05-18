'use client';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableCustomer from '@/components/Tables/TableCustomer';
import Modal from 'react-modal';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CustomerForm from '@/components/form/customerForm';
import { toast } from 'react-toastify';

type Customer = {
  id: number;
  kode: string;
  nama: string;
  nohp: string;
};

const Product = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [dataCustomer, setDataCustomer] = useState<Customer[]>([]);
  const [customerEdit, setCustomerEdit] = useState<Customer | null>(null);

  const deleteCustomer = async (kode: string) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus barang ini?');

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/customer/${kode}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setDataCustomer((prevData) => prevData.filter((barang) => barang.kode !== kode));
        toast.success('Barang berhasil dihapus!');
      } catch (error: any) {
        console.log('Error:', error);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetch('/api/customer')
      .then((response) => response.json())
      .then((data) => setDataCustomer(data.data));
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCustomerEdit(null);
  };

  const openModalEdit = (customer: Customer) => {
    setCustomerEdit(customer);
    setModalIsOpen(true);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName='Customer' />
      <div className='flex flex-col gap-10'>
        <Link href='#' onClick={openModal} className='bg-primary inline-flex items-center justify-center rounded-md px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
          Tambah Customer
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
          <CustomerForm setDataCustomer={setDataCustomer} closeModal={closeModal} customerEdit={customerEdit} setCustomerEdit={setCustomerEdit} />
        </Modal>

        <TableCustomer dataCustomer={dataCustomer} openModalEdit={openModalEdit} deleteCustomer={deleteCustomer} />
      </div>
    </DefaultLayout>
  );
};

export default Product;
