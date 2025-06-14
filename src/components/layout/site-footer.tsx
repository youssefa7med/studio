"use client";

import { useLanguage } from '@/contexts/language-context';

export function SiteFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {currentYear} {t('tricksLandAcademy')}. {t('landingSubtitle')}
        </p>
      </div>
    </footer>
  );
}
