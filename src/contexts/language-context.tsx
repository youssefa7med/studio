
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  translations: Record<string, Record<Language, string>>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations - in a real app, these would be in JSON files
const translations: Record<string, Record<Language, string>> = {
  appName: { en: "Tricks Land Scoreboard", ar: "لوحة نتائج تريكس لاند" },
  login: { en: "Login", ar: "تسجيل الدخول" },
  username: { en: "Username", ar: "اسم المستخدم" },
  password: { en: "Password", ar: "كلمة المرور" },
  adminDashboard: { en: "Admin Dashboard", ar: "لوحة تحكم المسؤول" },
  students: { en: "Students", ar: "الطلاب" },
  schedule: { en: "Schedule", ar: "الجدول الزمني" },
  manageAdmins: { en: "Manage Admins", ar: "إدارة المسؤولين" },
  logout: { en: "Logout", ar: "تسجيل الخروج" },
  welcomeAdmin: { en: "Welcome, Admin!", ar: "مرحباً أيها المسؤول!" },
  welcomeAdminDashboard: { en: "Welcome to your control center!", ar: "مرحباً بك في مركز التحكم الخاص بك!" },
  dashboardIntro: { en: "From here, you can manage all aspects of Tricks Land Academy. Use the navigation links to manage students, schedule sessions, and oversee admin accounts. Let's make learning fun and rewarding!", ar: "من هنا، يمكنك إدارة جميع جوانب أكاديمية تريكس لاند. استخدم روابط التنقل لإدارة الطلاب وجدولة الجلسات والإشراف على حسابات المسؤولين. لنجعل التعلم ممتعًا ومجزيًا!" },
  addStudent: { en: "Add Student", ar: "إضافة طالب" },
  studentName: { en: "Student Name", ar: "اسم الطالب" },
  className: { en: "Class Name", ar: "اسم الفصل" },
  discipline: { en: "Discipline", ar: "الانضباط" },
  punctuality: { en: "Punctuality", ar: "الالتزام بالمواعيد" },
  engagement: { en: "Engagement", ar: "التفاعل" },
  overallScore: { en: "Overall Score", ar: "التقييم الكلي" },
  saveGrades: { en: "Save Grades", ar: "حفظ الدرجات" },
  generateEncouragement: { en: "Generate Encouragement", ar: "إنشاء رسالة تشجيعية" },
  encouragementMessage: { en: "Encouragement Message", ar: "رسالة تشجيعية" },
  close: { en: "Close", ar: "إغلاق" },
  addAdmin: { en: "Add Admin", ar: "إضافة مسؤول" },
  selectSessionDay: { en: "Select Session Day", ar: "اختر يوم الجلسة" },
  landingTitle: { en: "Welcome to Tricks Land!", ar: "مرحباً بكم في تريكس لاند!" },
  landingSubtitle: { en: "Where learning is an adventure.", ar: "حيث التعلم مغامرة." },
  viewScoreboard: { en: "View Scoreboard", ar: "عرض لوحة النتائج" },
  classScoreboard: { en: "Class Scoreboard", ar: "لوحة نتائج الفصل" },
  noStudentsInClass: { en: "No students in this class yet.", ar: "لا يوجد طلاب في هذا الفصل حتى الآن." },
  errorLoginFailed: { en: "Login Failed", ar: "فشل تسجيل الدخول" },
  errorInvalidCredentials: { en: "Invalid username or password.", ar: "اسم المستخدم أو كلمة المرور غير صالحة." },
  progressDescription: { en: "Progress Description", ar: "وصف التقدم" },
  submit: {en: "Submit", ar: "إرسال"},
  tricksLandAcademy: { en: "Tricks Land Academy", ar: "أكاديمية تريكس لاند" },
  home: { en: "Home", ar: "الرئيسية"},
  admin: { en: "Admin", ar: "المسؤول"},
  dashboard: { en: "Dashboard", ar: "لوحة التحكم"},
  classes: { en: "Classes", ar: "الفصول" },
  sessions: { en: "Sessions", ar: "الجلسات" },
  scoreboard: { en: "Scoreboard", ar: "لوحة النتائج" },
  manageClasses: { en: "Manage classes and student assignments.", ar: "إدارة الفصول الدراسية ومهام الطلاب."},
  manageClassesDesc: { en: "Define classes, assign students, and oversee class schedules.", ar: "حدد الفصول، وعيّن الطلاب، وأشرف على جداول الفصول." },
  trackSessions: { en: "Track sessions, attendance, and performance.", ar: "تتبع الجلسات والحضور والأداء."},
  trackSessionsDesc: { en: "Log training sessions, manage attendance, and evaluate performance.", ar: "سجل جلسات التدريب، وأدر الحضور، وقيّم الأداء." },
  viewOverallScores: { en: "View real-time scores and metrics.", ar: "عرض النتائج والمقاييس في الوقت الفعلي."},
  viewOverallScoresDesc: { en: "Access leaderboards and overall performance data.", ar: "اطلع على لوحات الصدارة وبيانات الأداء العامة." },
  totalStudents: { en: "Total Students", ar: "إجمالي الطلاب" },
  totalStudentsDesc: { en: "Current number of enrolled students.", ar: "العدد الحالي للطلاب المسجلين." },
  activeClasses: { en: "Active Classes", ar: "الفصول النشطة" },
  activeClassesDesc: { en: "Number of classes currently running.", ar: "عدد الفصول الدراسية الجارية حاليًا." },
  upcomingSessions: { en: "Upcoming Sessions", ar: "الجلسات القادمة" },
  upcomingSessionsDesc: { en: "Sessions scheduled for today/this week.", ar: "الجلسات المجدولة لليوم/هذا الأسبوع." },
  quickAccess: { en: "Quick Access", ar: "الوصول السريع" },
  manageStudentProfiles: { en: "Manage student profiles, grades, and progress.", ar: "إدارة ملفات الطلاب ودرجاتهم وتقدمهم." },
  manageSessionSchedules: { en: "View and manage session schedules and calendars.", ar: "عرض وإدارة جداول الجلسات والتقويمات." },
  manageAdminAccounts: { en: "Add or modify administrator accounts.", ar: "إضافة أو تعديل حسابات المسؤولين." },
  viewDetails: { en: "View Details", ar: "عرض التفاصيل" },
  performanceMetrics: { en: "Performance Metrics", ar: "مقاييس الأداء" },
  performanceOverview: { en: "Overview of student engagement and performance trends.", ar: "نظرة عامة على مشاركة الطلاب واتجاهات الأداء." },
  chartsPlaceholder: { en: "Detailed charts and statistics will be displayed here.", ar: "سيتم عرض الرسوم البيانية والإحصائيات التفصيلية هنا." },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // You could persist language choice in localStorage here
    // For Arabic, set document direction
    if (language === 'ar') {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key: string): string => {
    if (!isMounted) return translations[key]?.['en'] || key; // Default to EN during SSR or before mount
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };
  
  if (!isMounted) {
    // Render nothing or a loading indicator on the server or before hydration
    // This helps avoid hydration mismatches with document.dir
    return null; 
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

