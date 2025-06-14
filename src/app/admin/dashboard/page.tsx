"use client";

import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, CalendarDays, UserCog, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();

  const quickLinks = [
    { href: "/admin/students", labelKey: "students", icon: Users, descriptionKey: "Manage student profiles and grades." },
    { href: "/admin/schedule", labelKey: "schedule", icon: CalendarDays, descriptionKey: "View and manage session schedules." },
    { href: "/admin/manage-admins", labelKey: "manageAdmins", icon: UserCog, descriptionKey: "Add or modify admin accounts." },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Image src="https://placehold.co/100x100.png" data-ai-hint="trophy star" alt="Tricks Land Emblem" width={80} height={80} className="rounded-full border-4 border-background shadow-md"/>
            <div>
              <CardTitle className="font-headline text-4xl text-background">{t('adminDashboard')}</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">{t('welcomeAdmin')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {language === 'en' ? 'From here, you can manage all aspects of Tricks Land Academy. Use the navigation links to manage students, schedule sessions, and oversee admin accounts. Let\'s make learning fun and rewarding!' : 'من هنا، يمكنك إدارة جميع جوانب أكاديمية تريكس لاند. استخدم روابط التنقل لإدارة الطلاب وجدولة الجلسات والإشراف على حسابات المسؤولين. لنجعل التعلم ممتعًا ومجزيًا!'}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map(link => (
          <Card key={link.href} className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium font-headline text-primary">{t(link.labelKey)}</CardTitle>
              <link.icon className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-xs text-muted-foreground">
                {language === 'en' ? link.descriptionKey : (link.labelKey === 'students' ? 'إدارة ملفات الطلاب ودرجاتهم.' : link.labelKey === 'schedule' ? 'عرض وإدارة جداول الجلسات.' : 'إضافة أو تعديل حسابات المسؤولين.')}
              </p>
            </CardContent>
            <div className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={link.href}>{t(link.labelKey)}</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-accent"/>
            {language === 'en' ? 'Academy Stats (Placeholder)' : 'إحصائيات الأكاديمية (عنصر نائب)'}
          </CardTitle>
          <CardDescription>
            {language === 'en' ? 'Overview of student engagement and performance.' : 'نظرة عامة على مشاركة الطلاب وأدائهم.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 bg-muted/30 rounded-b-lg">
          <p className="text-muted-foreground italic">
            {language === 'en' ? 'Charts and statistics will be displayed here.' : 'سيتم عرض الرسوم البيانية والإحصائيات هنا.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
