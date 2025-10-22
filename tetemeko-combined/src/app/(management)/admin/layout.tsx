// admin/dashboard/page.tsx
// src/app/(management)/admin/dashboard/page.tsx

'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" /> {/* ✅ Add this for toast support */}
          {children}
    </AuthProvider>
  );
}
