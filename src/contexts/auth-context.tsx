"use client";

import type { AdminUser } from '@/types';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  login: (usernameInput: string, passwordInput: string) => boolean;
  logout: () => void;
  admins: AdminUser[];
  addAdmin: (newAdmin: AdminUser) => void;
  currentAdmin: AdminUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_ADMIN_USERNAME = 'YoussefAhmed';
const INITIAL_ADMIN_PASSWORD = 'AdminTricksLand123$';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', username: INITIAL_ADMIN_USERNAME, password: INITIAL_ADMIN_PASSWORD }
  ]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Persist admin state could be done here with localStorage
    // For this example, it resets on refresh if not using localStorage
  }, []);


  const login = (usernameInput: string, passwordInput: string): boolean => {
    const adminExists = admins.find(admin => admin.username === usernameInput && admin.password === passwordInput);
    if (adminExists) {
      setIsAdmin(true);
      setCurrentAdmin(adminExists);
      // if (isMounted) localStorage.setItem('isAdmin', 'true'); // Example persistence
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentAdmin(null);
    // if (isMounted) localStorage.removeItem('isAdmin'); // Example persistence
  };

  const addAdmin = (newAdmin: AdminUser) => {
    setAdmins(prevAdmins => [...prevAdmins, { ...newAdmin, id: String(prevAdmins.length + 1) }]);
  };

  // Only render children after mount to ensure localStorage (if used) is accessible
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, admins, addAdmin, currentAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
