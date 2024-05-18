import { useEffect, useState } from 'react';

type Barang = {
  diskonRp: number;
  nama: string;
  id: number | null;
  harga: number;
  subtotal: number;
  kode: string;
  qty: number;
  diskonPersen: number;
  hargaBandrol: number;
  hargaDiskon: number;
};

type Customer = {
  id: number;
  nohp: string;
  kode: string;
  nama: string;
};

type Transaksi = {
  diskon: number;
  ongkir: number;
  totalYangHarusDibayar: number;
  totalHarga: number;
  customer: Customer;
  kodeTransaksi: string;
  tanggalTransaksi: string;
  barang: Barang[];
};

function formatRupiah(angka: number) {
  const reverse = angka.toString().split('').reverse().join('');
  const ribuan = reverse.match(/\d{1,3}/g);
  return 'Rp. ' + ribuan!.join('.').split('').reverse().join('');
}

const TableTwo = () => {
  const [productData, setproductData] = useState<Transaksi[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/transaksi');
        const data = await response.json();

        if (data.status === 'ok') {
          setproductData(data.data);
        } else {
          console.error('Terjadi kesalahan saat mengambil data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Hitung jumlah penjualan dan profit untuk setiap barang
  const barangData = productData.flatMap((transaksi) =>
    transaksi.barang.map((barang) => ({
      ...barang,
      terjual: barang.qty,
      profit: (barang.hargaBandrol - barang.hargaDiskon) * barang.qty,
    }))
  );

  // Gabungkan data untuk barang yang sama
  const aggregatedBarangData = Object.values(
    barangData.reduce((acc: Record<string, Barang & { terjual: number; profit: number }>, barang) => {
      if (!acc[barang.kode]) {
        acc[barang.kode] = { ...barang, terjual: 0, profit: 0 };
      }
      acc[barang.kode].terjual += barang.terjual;
      acc[barang.kode].profit += barang.profit;
      return acc;
    }, {})
  );

  // Urutkan barang dari yang terlaris hingga yang tidak laris
  const sortedBarangData = aggregatedBarangData.sort((a, b) => b.terjual - a.terjual);

  return (
    <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white'>
      <div className='xl:px-7.5 px-4 py-6 md:px-6'>
        <h4 className='text-xl font-semibold text-black dark:text-white'>Top Products</h4>
      </div>

      <div className='border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6'>
        <div className='col-span-3 flex items-center'>
          <p className='font-medium'>Product Name</p>
        </div>
        <div className='col-span-2 hidden items-center sm:flex'>
          <p className='font-medium'></p>
        </div>
        <div className='col-span-1 flex items-center'>
          <p className='font-medium'>Price</p>
        </div>
        <div className='col-span-1 flex items-center'>
          <p className='font-medium'>Sold</p>
        </div>
        <div className='col-span-1 flex items-center'>
          <p className='font-medium'>Profit</p>
        </div>
      </div>

      {sortedBarangData.map((barang, key) => (
        <div className='border-stroke py-4.5 dark:border-strokedark 2xl:px-7.5 grid grid-cols-6 border-t px-4 sm:grid-cols-8 md:px-6' key={key}>
          <div className='col-span-3 flex items-center'>
            <p className='text-sm text-black dark:text-white'>{barang.nama}</p>
          </div>
          <div className='col-span-2 hidden items-center sm:flex'>
            <p className='text-sm text-black dark:text-white'></p>
          </div>
          <div className='col-span-1 flex items-center'>
            <p className='text-sm text-black dark:text-white'>{formatRupiah(barang.harga)}</p>
          </div>
          <div className='col-span-1 flex items-center'>
            <p className='text-sm text-black dark:text-white'>{barang.terjual}</p>
          </div>
          <div className='col-span-1 flex items-center'>
            <p className='text-meta-3 text-sm'>{formatRupiah(barang.profit)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
