import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableTransaksi from '@/components/Tables/TableTransaksi';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transaksi Page',
  description: 'Ini Adalah Halaman Transaksi',
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName='Transaksi' />
      <div className='flex flex-col gap-10'>
        <Link href='/forms/transaksi' className='bg-primary inline-flex items-center justify-center rounded-md px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10'>
          Tambah Transaksi
        </Link>
        <TableTransaksi />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
