
"use client";

import type { AdminUser } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  authLoading: boolean; // To indicate if auth state is being loaded
  login: (usernameInput: string, passwordInput: string) => boolean;
  logout: () => void;
  admins: AdminUser[];
  addAdmin: (newAdmin: AdminUser) => void;
  currentAdmin: AdminUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_ADMIN_USERNAME = 'YoussefAhmed';
const INITIAL_ADMIN_PASSWORD = 'AdminTricksLand123$';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', username: INITIAL_ADMIN_USERNAME, password: INITIAL_ADMIN_PASSWORD }
  ]);
  const [isMounted, setIsMounted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Initialize as true

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedIsAdmin = localStorage.getItem('isAdminTricksLand');
      const storedAdminUser = localStorage.getItem('currentAdminTricksLand');

      if (storedIsAdmin === 'true' && storedAdminUser) {
        const parsedAdminUser: AdminUser = JSON.parse(storedAdminUser);
        // Check against the current 'admins' state.
        // Note: 'admins' list itself is not persisted in localStorage, only the current logged-in admin.
        // So, this primarily validates the initial hardcoded admin.
        const validAdmin = admins.find(a => a.id === parsedAdminUser.id && a.username === parsedAdminUser.username);
        if (validAdmin) {
          setCurrentAdmin(validAdmin);
          setIsAdmin(true);
        } else {
          // Clear localStorage if stored admin is not in current (initial) list
          localStorage.removeItem('isAdminTricksLand');
          localStorage.removeItem('currentAdminTricksLand');
        }
      }
    } catch (error) {
      console.error("Error reading auth state from localStorage", error);
      localStorage.removeItem('isAdminTricksLand');
      localStorage.removeItem('currentAdminTricksLand');
    }
    setAuthLoading(false); // Finished attempting to load auth state
  }, []); // Empty dependency array: runs once on client mount

  const login = (usernameInput: string, passwordInput: string): boolean => {
    const adminExists = admins.find(admin => admin.username === usernameInput && admin.password === passwordInput);
    if (adminExists) {
      setIsAdmin(true);
      setCurrentAdmin(adminExists);
      if (isMounted) { // Ensure localStorage is accessed only on client
        localStorage.setItem('isAdminTricksLand', 'true');
        localStorage.setItem('currentAdminTricksLand', JSON.stringify(adminExists));
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentAdmin(null);
    if (isMounted) { // Ensure localStorage is accessed only on client
      localStorage.removeItem('isAdminTricksLand');
      localStorage.removeItem('currentAdminTricksLand');
    }
  };

  const addAdmin = (newAdmin: AdminUser) => {
    if (admins.some(admin => admin.username === newAdmin.username)) {
      console.warn(`Admin with username ${newAdmin.username} already exists.`);
      return;
    }
    // Note: This adds to in-memory 'admins'. For persistence across sessions for new admins,
    // the 'admins' list itself would need to be stored (e.g., in localStorage or a backend).
    setAdmins(prevAdmins => [...prevAdmins, { ...newAdmin, id: String(Date.now()) }]);
  };
  
  // Prevents rendering children on server or before client hydration is certain
  if (!isMounted) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAdmin, authLoading, login, logout, admins, addAdmin, currentAdmin }}>
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
