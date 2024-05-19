'use client';
import { toast } from 'react-toastify';
import DatePickerOne from '../FormElements/DatePicker/DatePickerOne';
import MultiSelect from '../FormElements/MultiSelect';
import SelectGroupOne from '../SelectGroup/SelectGroupOne';
import React, { useState, useEffect } from 'react';

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

type TableKeranjangProps = {
  selectedData?: Barang[];
  updateTotalHarga: (total: number) => void;
  updateSelectedData: (data: Barang[]) => void;
  tanggalTransaksi?: string | null;
  updateTanggalTransaksi: React.Dispatch<React.SetStateAction<string | null>>;
  updateSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | null>>;
  selectedCustomer?: Customer | null;
};

function formatRupiah(angka: number) {
  const reverse = angka.toString().split('').reverse().join('');
  const ribuan = reverse.match(/\d{1,3}/g);
  return 'Rp. ' + ribuan!.join('.').split('').reverse().join('');
}

const TableKeranjang: React.FC<TableKeranjangProps> = (props) => {
  const [localSelectedData, setLocalSelectedData] = useState<Barang[]>(props.selectedData || []);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const pathParts = path.split('/');
    if (pathParts.length > 3) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  }, []);

  useEffect(() => {
    const newData = localSelectedData.map((item) => {
      const qty = item.qty || 0;
      const diskonPersen = item.diskonPersen || 0;
      const hargaBandrol = item.harga * qty;
      const diskonRp = (hargaBandrol * diskonPersen) / 100;
      const hargaDiskon = hargaBandrol - diskonRp;
      const subtotal = hargaDiskon;

      return {
        ...item,
        hargaBandrol,
        diskonRp,
        hargaDiskon,
        subtotal,
      };
    });

    const total = newData.reduce((sum, item) => sum + item.subtotal, 0);

    if (JSON.stringify(newData) !== JSON.stringify(props.selectedData)) {
      props.updateTotalHarga(total);
      props.updateSelectedData(newData);
    }
  }, [localSelectedData]);

  const [selectedOption, setSelectedOption] = useState<Barang | null>(null);

  useEffect(() => {
    const matchingItem = localSelectedData.find((item) => item.kode === selectedOption?.kode);
    if (matchingItem) {
      setSelectedOption(matchingItem);
    }
  }, [localSelectedData, selectedOption]);

  useEffect(() => {
    setLocalSelectedData(props.selectedData || []);
  }, [props.selectedData]);

  const handleQtyChange = (index: number, newQty: number) => {
    setLocalSelectedData((prevData) => prevData.map((barang, i) => (i === index ? { ...barang, qty: newQty } : barang)));
  };

  const handleDiskonPersenChange = (index: number, newDiskonPersen: number) => {
    if (newDiskonPersen > 100) {
      toast.error('Persentase diskon tidak boleh melebihi 100%');
      newDiskonPersen = 100;
    }

    setLocalSelectedData((prevData) => prevData.map((barang, i) => (i === index ? { ...barang, diskonPersen: newDiskonPersen } : barang)));
  };

  return (
    <div className='flex flex-col gap-10'>
      <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark rounded-sm border bg-white'>
        <div className='border-stroke px-6.5 dark:border-strokedark border-b py-4'>
          <h3 className='font-medium text-black dark:text-white'>Rincian Transaksi</h3>
        </div>
        <div className='gap-5.5 p-6.5 flex flex-col'>
          <DatePickerOne updateTanggalTransaksi={props.updateTanggalTransaksi} tanggalTransaksi={props.tanggalTransaksi} />
          <SelectGroupOne updateSelectedCustomer={props.updateSelectedCustomer} selectedCustomer={props.selectedCustomer} />
          <div className=''>
            {!isHidden && (
              <MultiSelect
                id='multiSelect'
                updateSelectedData={props.updateSelectedData}
                onChange={(selectedOptions) => {
                  const updatedItems = localSelectedData.filter((localItem) => selectedOptions.some((selectedOption) => selectedOption.kode === localItem.kode));

                  selectedOptions.forEach((selectedOption) => {
                    const existingItemIndex = updatedItems.findIndex((item) => item.kode === selectedOption.kode);
                    if (existingItemIndex > -1) {
                      if (selectedOption.qty !== undefined) {
                        updatedItems[existingItemIndex].qty = selectedOption.qty;
                      }
                      if (selectedOption.diskonPersen !== undefined) {
                        updatedItems[existingItemIndex].diskonPersen = selectedOption.diskonPersen;
                      }
                    } else {
                      updatedItems.push(selectedOption);
                    }
                  });

                  setLocalSelectedData(updatedItems);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className=''>
        <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 min-h-48 rounded-sm border bg-white px-5 pb-2.5 pt-6 xl:pb-1'>
          <div className='max-w-full overflow-x-auto'>
            <table className='w-full table-auto'>
              <thead>
                <tr className='bg-gray-2 dark:bg-meta-4 text-left'>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>NO</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Kode Barang</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Harga</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>QTY</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Harga Bandrol</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Diskon (%)</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Diskon (Rp)</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Harga Diskon</th>
                  <th className='px-4 py-4 font-medium text-black  dark:text-white'>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {localSelectedData.map((item, index) => {
                  const qty = item.qty || 0;
                  const diskonPersen = item.diskonPersen || 0;
                  const hargaBandrol = item.harga * qty;
                  const diskonRp = (hargaBandrol * diskonPersen) / 100;
                  const hargaDiskon = hargaBandrol - diskonRp;

                  return (
                    <tr key={index}>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5 '>
                        <h5 className='font-medium text-black dark:text-white'>{index + 1}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5 '>
                        <h5 className='font-medium text-black dark:text-white'>{item.kode}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5 '>
                        <h5 className='font-medium text-black dark:text-white'>{formatRupiah(item.harga)}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee]  px-4 py-5'>
                        <input type='text' value={qty} className='max-w-24 border-none bg-transparent font-medium text-black focus:border-none dark:text-white' onChange={(e) => handleQtyChange(index, Number(e.target.value))} />
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5'>
                        <h5 className='font-medium text-black dark:text-white'>{formatRupiah(hargaBandrol)}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5'>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <input type='text' value={diskonPersen} className='max-w-24 bg-transparent font-medium text-black dark:text-white' onChange={(e) => handleDiskonPersenChange(index, Number(e.target.value))} />
                          <span>%</span>
                        </div>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5'>
                        <h5 className='font-medium text-black dark:text-white'>{formatRupiah(diskonRp)}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5'>
                        <h5 className='font-medium text-black dark:text-white'>{formatRupiah(hargaDiskon)}</h5>
                      </td>
                      <td className='dark:border-strokedark border-b border-[#eee] px-4 py-5'>
                        <h5 className='font-medium text-black dark:text-white'>{formatRupiah(hargaDiskon)}</h5>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableKeranjang;
