'use client';
import PrimaryButton from '@/components/buttons/primaryButton';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <main>
      <section className='flex w-full justify-center'>
        <div className='mx-5 flex w-full max-w-screen-xl flex-col items-center  gap-8 py-10 text-center md:mx-20 md:gap-24 md:py-28'>
          <h1 className='max-w-[50rem] text-2xl font-bold  text-black md:text-6xl'>Opps.. Looks like you have been lost.</h1>
          <h1 className='text-secondaryColor max-w-[50rem] text-2xl  font-bold md:text-6xl'>4 0 4</h1>
          <PrimaryButton onClick={() => router.push('/')} text='Home Page'></PrimaryButton>
        </div>
      </section>
    </main>
  );
}
