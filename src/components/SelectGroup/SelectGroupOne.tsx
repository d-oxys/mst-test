'use client';
import React, { useState, useEffect } from 'react';

type Customer = {
  id: number;
  kode: string;
  nama: string;
  nohp: string;
};

type SelectGroupOneProps = {
  updateSelectedCustomer: (customer: Customer | null) => void;
  selectedCustomer?: Customer | null;
};

const SelectGroupOne: React.FC<SelectGroupOneProps> = ({ updateSelectedCustomer, selectedCustomer }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  useEffect(() => {
    fetch('/api/customer')
      .then((response) => response.json())
      .then((data) => setCustomers(data.data));
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setSelectedOption(selectedCustomer.kode);
    }
  }, [selectedCustomer]);

  return (
    <div className='mb-4.5'>
      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>Pilih Customer</label>

      <div className='dark:bg-form-input relative z-20 bg-transparent'>
        <select
          value={selectedOption}
          onChange={(e) => {
            const selectedCustomer = customers.find((customer) => customer.kode === e.target.value);
            setSelectedOption(e.target.value);
            updateSelectedCustomer(selectedCustomer || null);
            changeTextColor();
          }}
          className={`border-stroke focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary relative z-20 w-full appearance-none rounded border bg-transparent px-5 py-3 outline-none transition ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
          <option value='' disabled className='text-body dark:text-bodydark'>
            Select an option
          </option>
          {customers.map(
            (
              customer // tambahkan ini
            ) => (
              <option key={customer.id} value={customer.kode} className='text-body dark:text-bodydark'>
                {customer.nama}
              </option>
            )
          )}
        </select>

        <span className='absolute right-4 top-1/2 z-30 -translate-y-1/2'>
          <svg className='fill-current' width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <g opacity='0.8'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z'
                fill=''
              ></path>
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SelectGroupOne;
