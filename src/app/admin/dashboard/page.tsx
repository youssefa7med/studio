
"use client";

import { useLanguage } from '@/contexts/language-context';
import { useStudentData } from '@/contexts/student-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, School, CalendarClock, UserCog, TrendingUp, ClipboardList, Trophy } from 'lucide-react';
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import React from 'react';

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
  const { students, classes } = useStudentData();

  const dashboardStats = {
    totalStudents: students.length,
    activeClasses: classes.length, 
    upcomingSessions: 3, 
  };

  const quickLinks = [
    { href: "/admin/students", labelKey: "students", icon: Users, descriptionKey: "manageStudentProfiles" },
    { href: "/admin/classes", labelKey: "classes", icon: School, descriptionKey: "manageClassesDesc" },
    { href: "/admin/sessions", labelKey: "sessions", icon: ClipboardList, descriptionKey: "trackSessionsDesc" },
    { href: "/admin/schedule", labelKey: "schedule", icon: CalendarClock, descriptionKey: "manageSessionSchedules" }, // Changed icon to CalendarClock for consistency
    { href: "/admin/scoreboard", labelKey: "scoreboard", icon: Trophy, descriptionKey: "viewOverallScoresDesc" },
    { href: "/admin/manage-admins", labelKey: "manageAdmins", icon: UserCog, descriptionKey: "manageAdminAccounts" },
  ];

  const overviewStats = [
    { titleKey: "totalStudents", value: dashboardStats.totalStudents, icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { titleKey: "activeClasses", value: dashboardStats.activeClasses, icon: School, color: "text-green-500", bgColor: "bg-green-500/10" },
    { titleKey: "upcomingSessions", value: dashboardStats.upcomingSessions, icon: CalendarClock, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  ];

  const classStudentCounts = React.useMemo(() => {
    return classes.map(cls => ({
      name: cls.name,
      studentCount: students.filter(student => student.className === cls.name).length,
    }));
  }, [classes, students]);

  const chartConfig = {
    studentCount: {
      label: t('numberOfStudents'),
      color: "hsl(var(--primary))",
    },
  };

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
            {t('studentsPerClassChartTitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] bg-muted/30 rounded-b-lg p-4">
          {classStudentCounts.length > 0 ? (
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classStudentCounts} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8} 
                    angle={language === 'ar' ? 0 : -45}
                    textAnchor={language === 'ar' ? 'middle' : 'end'}
                    height={language === 'ar' ? 30 : 70}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={8}
                    label={{ value: t('numberOfStudents'), angle: -90, position: 'insideLeft', offset:10, style: { textAnchor: 'middle' } }}
                  />
                  <RechartsTooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <ChartLegend content={<ChartLegend />} />
                  <Bar dataKey="studentCount" fill="var(--color-studentCount)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-center">
                <p className="text-muted-foreground italic">
                  {t('noDataForChart')}
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
