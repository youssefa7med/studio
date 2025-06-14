"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { Button } from '@/components/ui/button';
import { Home, LogIn, UserCog } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export function SiteHeader() {
  const { t, language } = useLanguage();
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="font-headline text-xl font-bold text-primary">
            {t('appName')}
          </span>
        </Link>
        <nav className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button variant="ghost" asChild>
            <Link href="/" aria-label={t('home')}>
              <Home className="h-5 w-5" />
              <span className="sr-only">{t('home')}</span>
            </Link>
          </Button>
          {isAdmin ? (
             <Button variant="ghost" asChild>
             <Link href="/admin/dashboard" aria-label={t('adminDashboard')}>
               <UserCog className="h-5 w-5" />
               <span className="sr-only">{t('adminDashboard')}</span>
             </Link>
           </Button>
          ) : (
            <Button variant="ghost" asChild>
            <Link href="/login" aria-label={t('login')}>
              <LogIn className="h-5 w-5" />
              <span className="sr-only">{t('login')}</span>
            </Link>
          </Button>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
