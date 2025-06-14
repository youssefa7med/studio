"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale'; // For localized date formatting

export default function SchedulePage() {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const currentLocale = language === 'ar' ? arSA : enUS;

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{t('schedule')}</CardTitle>
          <CardDescription>{t('selectSessionDay')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-auto p-4 border rounded-lg shadow-md bg-card">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              locale={currentLocale}
              initialFocus
            />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="font-headline text-xl text-accent">
              {language === 'en' ? 'Selected Date Information' : 'معلومات التاريخ المحدد'}
            </h3>
            {selectedDate ? (
              <p className="text-lg">
                {language === 'en' ? 'You selected: ' : 'لقد اخترت: '} 
                <span className="font-semibold text-primary">
                  {format(selectedDate, 'PPP', { locale: currentLocale })}
                </span>
              </p>
            ) : (
              <p className="text-muted-foreground">{language === 'en' ? 'No date selected.' : 'لم يتم تحديد تاريخ.'}</p>
            )}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-semibold mb-2">{language === 'en' ? 'Upcoming Sessions (Placeholder)' : 'الجلسات القادمة (عنصر نائب)'}</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>{language === 'en' ? 'Junior Acrobats - Main Hall' : 'الأكروبات الصغار - القاعة الرئيسية'}</li>
                <li>{language === 'en' ? 'Advanced Tumblers - Gym B' : 'المتمرسون المتقدمون - صالة الألعاب الرياضية ب'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
