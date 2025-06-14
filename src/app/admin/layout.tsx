
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only attempt to redirect once auth state is fully loaded and user is not admin
    if (!authLoading && !isAdmin) {
      router.replace('/login');
    }
  }, [authLoading, isAdmin, router]);

  // Show loader if:
  // 1. Auth state is still loading.
  // 2. Auth state is loaded, but user is not admin (redirect will occur or is in progress).
  if (authLoading || (!isAdmin && !authLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If we reach here, authLoading is false and isAdmin is true.
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto bg-background/50">
        {children}
      </main>
    </div>
  );
}
