
"use client";

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function SessionsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <ClipboardList className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl text-primary">{t('sessions')}</CardTitle>
              <CardDescription>{t('trackSessions')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('This page will be used for tracking individual training sessions, managing attendance, and evaluating performance during each session. Session history and detailed reports will be accessible here.')}
          </p>
          {/* Placeholder for future content like a list of sessions, add session button, filters, etc. */}
        </CardContent>
      </Card>
    </div>
  );
}
