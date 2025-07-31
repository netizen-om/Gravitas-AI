'use client';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: { children: React.ReactNode }) => {

   useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('Warning: Expected server HTML to match client HTML')
        ) {
          return;
        }
        originalError(...args);
      };
    }
  }, []);

  return (
    <SessionProvider>
      {children}
      <Toaster richColors theme="dark"/>
    </SessionProvider>
  );
};