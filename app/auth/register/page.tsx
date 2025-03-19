import React from 'react';
import Head from 'next/head';
import { RegisterForm } from '@/app/modules/auth/components/RegisterForm';
const RegisterPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Inscription | PassBi</title>
        <meta name="description" content="Créez un nouveau compte PassBi" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* <div className="text-center mb-8">
            <img
              className="mx-auto h-12 w-auto"
              src="/logo.svg"
              alt="PassBi Logo"
            />
          </div> */}
          
          <RegisterForm />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;