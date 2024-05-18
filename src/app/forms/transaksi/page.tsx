// form-page transaksi
'use client';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableKeranjang from '@/components/Tables/TableKeranjang';
import FormTransaksi from '@/components/form/transaksiForm';
import { useState } from 'react';

type Barang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
  qty?: number;
  diskonPersen?: number;
  diskonRp?: number;
};

type Customer = {
  id: number;
  kode: string;
  nama: string;
  nohp: string;
};

const TablesPage = () => {
  const [totalHarga, setTotalHarga] = useState(0);
  const [selectedData, setSelectedData] = useState<Barang[]>([]);
  const [tanggalTransaksi, setTanggalTransaksi] = useState<string | null>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  function updateTotalHarga(total: number) {
    setTotalHarga(total);
  }

  function updateSelectedData(data: Barang[]) {
    setSelectedData(data);
  }

  return (
    <div className='px-8 pt-8'>
      <Breadcrumb pageName='keranjang' />
      <div className=''>
        <TableKeranjang updateTotalHarga={updateTotalHarga} updateSelectedData={updateSelectedData} updateTanggalTransaksi={setTanggalTransaksi} updateSelectedCustomer={setSelectedCustomer} />
        <FormTransaksi totalHarga={totalHarga} selectedData={selectedData} tanggalTransaksi={tanggalTransaksi} selectedCustomer={selectedCustomer} />
      </div>
    </div>
  );
};

export default TablesPage;
