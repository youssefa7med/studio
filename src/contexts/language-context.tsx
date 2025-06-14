
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
  manageClasses: { en: "Manage classes and student assignments.", ar: "إدارة الفصول الدراسية وواجبات الطلاب."},
  trackSessions: { en: "Track sessions, attendance, and performance.", ar: "تتبع الجلسات والحضور والأداء."},
  viewOverallScores: { en: "View real-time scores and metrics.", ar: "عرض النتائج والمقاييس في الوقت الفعلي."},
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
