/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  email: string;
  password: string;
}

const LoginComponent: React.FC = () => {
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (!user.email || !user.password) {
      toast.error('Email and password are required'); // Tampilkan toast error jika email atau password kosong
      return;
    }

    setIsLoading(true);
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (data.status === 'ok') {
      toast.success(data.message);
      Cookies.set('token', data.token);
      Cookies.set('user', JSON.stringify(data.user));

      setShouldRedirect(true);
    } else {
      toast.error('Login failed');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/');
    }
  }, [shouldRedirect]);

  return (
    <>
      {isLoading ? (
        <div className='bg-gradient-calm-elegant flex h-screen w-screen items-center justify-center'>
          <ReactLoading type='spokes' color='#000' />
        </div>
      ) : (
        <div>
          <div className='flex h-screen justify-center bg-gray-100 text-gray-900'>
            <div className='m-0 flex max-w-screen-xl flex-1 justify-center bg-white shadow sm:m-10 sm:rounded-lg'>
              <div className='p-6 sm:p-12 lg:w-1/2 xl:w-5/12'>
                <div className='mt-12 flex flex-col items-center'>
                  <h1 className='text-2xl font-extrabold xl:text-3xl'>Sign in</h1>
                  <div className='mt-8 w-full flex-1'>
                    <div className='mx-auto max-w-xs'>
                      <input
                        className='w-full rounded-lg border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none'
                        type='email'
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder='Email'
                      />
                      <input
                        className='mt-5 w-full rounded-lg border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-medium placeholder-gray-500 focus:border-gray-400 focus:bg-white focus:outline-none'
                        type='password'
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder='Password'
                      />
                      <button
                        onClick={login}
                        disabled={isLoading}
                        className='focus:shadow-outline mt-5 flex w-full items-center justify-center rounded-lg bg-indigo-500 py-4 font-semibold tracking-wide text-white transition-all duration-300 ease-in-out hover:bg-indigo-700 focus:outline-none'
                      >
                        <svg className='-ml-2 h-6 w-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
                          <circle cx='8.5' cy='7' r='4' />
                          <path d='M20 8v6M23 11h-6' />
                        </svg>
                        <span className='ml-3'>Masuk</span>
                      </button>
                      <h2 className='mt-12 text-center text-base font-semibold text-indigo-800'>
                        Belum Punya Akun?
                        <Link href='/register'>
                          <span className='cursor-pointer hover:text-indigo-950'> Daftar dulu</span>
                        </Link>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className='hidden flex-1 bg-indigo-100 text-center lg:flex'>
                <div
                  className='m-12 w-full bg-contain bg-center bg-no-repeat xl:m-16'
                  style={{ backgroundImage: `url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginComponent;
