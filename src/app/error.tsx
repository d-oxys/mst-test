'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className='flex w-full justify-center text-center md:text-left'>
      <div className=' mx-5 flex w-full max-w-screen-xl flex-col  items-center gap-8 py-10 md:mx-20 md:gap-24 md:py-44'>
        <h2 className='text-primaryColor font-bold md:text-xl'>Something went wrong ⚠️</h2>
        <span className='text-black md:text-xl'>{error.message}</span>
      </div>
    </section>
  );
}
