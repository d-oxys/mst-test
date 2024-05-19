import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type FormTransaksiProps = {
  totalHarga: number;
  diskon?: number;
  ongkir?: number;
  kodeTransaksi?: string;
  selectedData: Barang[];
  tanggalTransaksi: string | null;
  selectedCustomer: Customer | null;
};

type Customer = {
  id: number;
  kode: string;
  nama: string;
  nohp: string;
};

type Barang = {
  id: number;
  kode: string;
  nama: string;
  harga: number;
  qty?: number;
  diskonPersen?: number;
  diskonRp?: number;
};

const FormTransaksi: React.FC<FormTransaksiProps> = (props) => {
  const [diskon, setDiskon] = useState('');
  const [ongkir, setOngkir] = useState('');
  const router = useRouter();

  function formatRupiah(angka: number | null) {
    if (angka === null) {
      return 'Rp. 0';
    }
    var reverse = angka.toString().split('').reverse().join(''),
      ribuan = reverse.match(/\d{1,3}/g);
    return 'Rp. ' + (ribuan ? ribuan.join('.').split('').reverse().join('') : '0');
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<string>>) => {
    const value = event.target.value;
    const formattedValue = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setState(formattedValue);
  };

  useEffect(() => {
    setDiskon(String(props.diskon || 0));
    setOngkir(String(props.ongkir || 0));
  }, [props.diskon, props.ongkir]);

  const totalYangHarusDibayar = props.totalHarga - Number(diskon.replace(/\./g, '')) + Number(ongkir.replace(/\./g, ''));

  const handleSubmit = async () => {
    const diskonAngkaNormal = Number(diskon.replace(/\./g, ''));
    const ongkirAngkaNormal = Number(ongkir.replace(/\./g, ''));

    if (!props.selectedCustomer) {
      toast.error('Silahkan pilih customer terlebih dahulu');
      return;
    }
    if (!props.tanggalTransaksi) {
      toast.error('Silahkan pilih tanggal terlebih dahulu');
      return;
    }

    if (diskonAngkaNormal >= props.totalHarga) {
      toast.error('Diskon Tidak Boleh Lebih Dari Total harga!!!');
      return;
    }

    try {
      const response = await fetch('/api/transaksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kodeTransaksi: props.kodeTransaksi,
          barang: props.selectedData,
          tanggalTransaksi: props.tanggalTransaksi,
          customer: props.selectedCustomer,
          totalHarga: props.totalHarga,
          diskon: diskonAngkaNormal,
          ongkir: ongkirAngkaNormal,
          totalYangHarusDibayar: totalYangHarusDibayar,
        }),
      });

      const data = await response.json();

      if (data.status === 'ok') {
        toast.success('Transaksi berhasil ditambahkan');
        router.push('/transaksi');
      } else {
        toast.error('Terjadi kesalahan saat menambahkan transaksi');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menambahkan transaksi');
    }
  };

  return (
    <>
      <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark mt-12 rounded-sm border bg-white pb-8'>
        <div className='border-stroke px-6.5 dark:border-strokedark border-b py-4'>
          <h3 className='font-medium text-black dark:text-white'>Rincian Pembayaran</h3>
        </div>
        <div className='gap-5.5 p-6.5 flex flex-col'>
          <div>
            <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Total Harga</label>
            <input
              type='text'
              value={formatRupiah(props.totalHarga)}
              placeholder='Total harga'
              disabled
              className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white dark:disabled:bg-black'
            />
          </div>
          <div>
            <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Diskon</label>
            <input
              type='text'
              placeholder='Diskon Rp.'
              value={`RP. ${diskon}`}
              onChange={(e) => handleInputChange(e, setDiskon)}
              className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
            />
          </div>
          <div>
            <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Ongkir</label>
            <input
              type='text'
              placeholder='Ongkos Kirim Rp.'
              value={`RP. ${ongkir}`}
              onChange={(e) => handleInputChange(e, setOngkir)}
              className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white'
            />
          </div>
          <div>
            <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Total Yang Harus Di bayar</label>
            <input
              type='text'
              placeholder='Yang harus di bayar'
              value={formatRupiah(totalYangHarusDibayar)}
              disabled
              className='border-stroke focus:border-primary active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition disabled:cursor-default dark:text-white dark:disabled:bg-black'
            />
          </div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default FormTransaksi;
