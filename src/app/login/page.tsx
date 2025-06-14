"use client";

import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router]);

  if (isAdmin) {
    // Optional: show a loading or redirecting message
    return <div className="flex justify-center items-center min-h-screen"><p>Redirecting...</p></div>;
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center p-6 bg-primary/10">
          <Image 
            src="https://placehold.co/150x80.png" 
            alt="Tricks Land Logo" 
            width={150} 
            height={80}
            data-ai-hint="logo abstract"
            className="mx-auto mb-4 rounded"
          />
          <CardTitle className="font-headline text-3xl text-primary">{t('login')}</CardTitle>
          <CardDescription>{t('adminDashboard')}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
