'use client';
import Spinner from '@/components/loaders';
import React, { FC } from 'react';
import { useFormStatus } from 'react-dom';

interface PrimaryButtonProps {
  text: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ text, className, type, onClick }) => {
  const { pending } = useFormStatus();
  return (
    <button onClick={onClick} type={type} className={`bg-primaryColor md:text-md flex w-[130px] items-center justify-center p-2 text-sm text-white md:h-[52px] md:w-[170px] md:p-4 ${className} `}>
      {pending ? <Spinner></Spinner> : text}
    </button>
  );
};

export default PrimaryButton;
