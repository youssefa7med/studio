
"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { StudentDataProvider } from "@/contexts/student-data-context"; 
import React from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StudentDataProvider> 
          {children}
        </StudentDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
