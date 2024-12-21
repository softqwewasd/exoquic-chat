'use client'

import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <OrganizationProvider>
        {children}
      </OrganizationProvider>
    </SessionProvider>
  );
}
