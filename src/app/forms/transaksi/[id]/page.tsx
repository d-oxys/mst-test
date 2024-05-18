// form-page transaksi
'use client';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableKeranjang from '@/components/Tables/TableKeranjang';
import FormTransaksi from '@/components/form/transaksiForm';
import { useEffect, useState } from 'react';

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
  window.location.reload();
  const [totalHarga, setTotalHarga] = useState(0);
  const [ongkir, setOngkir] = useState(0);
  const [diskon, setDiskon] = useState(0);
  const [selectedData, setSelectedData] = useState<Barang[]>([]);
  const [tanggalTransaksi, setTanggalTransaksi] = useState<string | null>('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const url = window.location.href;
  const id = url.split('/').pop();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transaksi/${id}`);
        const data = await response.json();

        if (data.status === 'ok') {
          setTotalHarga(data.transaksi.totalHarga);
          setOngkir(data.transaksi.ongkir);
          setDiskon(data.transaksi.diskon);
          setSelectedData(data.transaksi.barang);
          setTanggalTransaksi(data.transaksi.tanggalTransaksi);
          setSelectedCustomer(data.transaksi.customer);
        } else {
          console.error('Terjadi kesalahan saat mengambil data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='px-8 pt-8'>
      <Breadcrumb pageName='keranjang' />
      <div>
        <TableKeranjang selectedData={selectedData} updateTotalHarga={setTotalHarga} updateSelectedData={setSelectedData} updateTanggalTransaksi={setTanggalTransaksi} updateSelectedCustomer={setSelectedCustomer} />
        <FormTransaksi kodeTransaksi={id} totalHarga={totalHarga} selectedData={selectedData} tanggalTransaksi={tanggalTransaksi} selectedCustomer={selectedCustomer} diskon={diskon} ongkir={ongkir} />
      </div>
    </div>
  );
};

export default TablesPage;
