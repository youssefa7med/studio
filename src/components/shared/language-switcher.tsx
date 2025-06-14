"use client";

import { useLanguage, type Language } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang as Language);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
      <Globe className="h-5 w-5" />
      <span className="sr-only">Toggle language, current: {language === 'en' ? 'English' : 'العربية'}</span>
    </Button>
  );
}
