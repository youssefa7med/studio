
"use client";

import { useLanguage } from '@/contexts/language-context';
import { useStudentData } from '@/contexts/student-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, CalendarDays, UserCog, BarChart3, School, CalendarClock, TrendingUp, ClipboardList, Trophy } from 'lucide-react';
import Image from 'next/image';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const { students, classes } = useStudentData();

  const dashboardStats = {
    totalStudents: students.length,
    activeClasses: classes.length, // Representing total defined classes for now
    upcomingSessions: 3, // This remains a static value until session logic is implemented
  };

  const quickLinks = [
    { href: "/admin/students", labelKey: "students", icon: Users, descriptionKey: "manageStudentProfiles" },
    { href: "/admin/classes", labelKey: "classes", icon: School, descriptionKey: "manageClassesDesc" },
    { href: "/admin/sessions", labelKey: "sessions", icon: ClipboardList, descriptionKey: "trackSessionsDesc" },
    { href: "/admin/schedule", labelKey: "schedule", icon: CalendarDays, descriptionKey: "manageSessionSchedules" },
    { href: "/admin/scoreboard", labelKey: "scoreboard", icon: Trophy, descriptionKey: "viewOverallScoresDesc" },
    { href: "/admin/manage-admins", labelKey: "manageAdmins", icon: UserCog, descriptionKey: "manageAdminAccounts" },
  ];

  const overviewStats = [
    { titleKey: "totalStudents", value: dashboardStats.totalStudents, icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { titleKey: "activeClasses", value: dashboardStats.activeClasses, icon: School, color: "text-green-500", bgColor: "bg-green-500/10" },
    { titleKey: "upcomingSessions", value: dashboardStats.upcomingSessions, icon: CalendarClock, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-accent p-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Image 
              src="https://placehold.co/100x100.png" 
              alt="Tricks Land Emblem" 
              width={80} 
              height={80} 
              data-ai-hint="trophy star"
              className="rounded-full border-4 border-background shadow-md"
            />
            <div>
              <CardTitle className="font-headline text-4xl text-background">{t('adminDashboard')}</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80">{t('welcomeAdminDashboard')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {t('dashboardIntro')}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {overviewStats.map(stat => (
          <Card key={stat.titleKey} className={`shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out ${stat.bgColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t(stat.titleKey)}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{t(`${stat.titleKey}Desc`)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div>
        <h2 className="font-headline text-2xl text-primary mb-4">{t('quickAccess')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map(link => (
            <Card key={link.href} className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium font-headline text-primary">{t(link.labelKey)}</CardTitle>
                <link.icon className="h-6 w-6 text-accent" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-xs text-muted-foreground">
                  {t(link.descriptionKey)}
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button asChild className="w-full">
                  <Link href={link.href}>{t('viewDetails')}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-accent"/>
            {t('performanceMetrics')}
          </CardTitle>
          <CardDescription>
            {t('performanceOverview')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60 bg-muted/30 rounded-b-lg">
          {/* Placeholder for charts, e.g., using <ChartContainer /> from ShadCN */}
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-2"/>
            <p className="text-muted-foreground italic">
              {t('chartsPlaceholder')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
