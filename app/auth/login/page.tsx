import React from 'react';
import Head from 'next/head';
import { LoginForm } from '@/app/modules/auth/components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Connexion | PassBi</title>
        <meta name="description" content="Connectez-vous à votre compte PassBi" />
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
          
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;