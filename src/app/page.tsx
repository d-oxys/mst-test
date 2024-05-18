import ECommerce from '@/components/Dashboard/E-commerce';
import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLayout';

export const metadata: Metadata = {
  title: 'PT. Mitra Sinerji Teknoindo',
  description: 'test programming PT. Mitra Sinerji Teknoindo',
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
