'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { SessionProvider } from 'next-auth/react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/";

  return (
    <>
    <SessionProvider>
      {showNavbar && <Navbar />}
      {children}
      </SessionProvider>
    </>
  );
}