
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
        // Optional: Re-validate admin from the 'admins' list if necessary
        const validAdmin = admins.find(a => a.id === parsedAdminUser.id && a.username === parsedAdminUser.username);
        if (validAdmin) {
          setCurrentAdmin(validAdmin);
          setIsAdmin(true);
        } else {
          // Clear localStorage if stored admin is not in current list (e.g., if admins list changes)
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
  }, [admins]); // Add admins to dependency array if re-validation logic depends on it.

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
    // Check if admin already exists to prevent duplicates if username is unique constraint
    if (admins.some(admin => admin.username === newAdmin.username)) {
      console.warn(`Admin with username ${newAdmin.username} already exists.`);
      return;
    }
    setAdmins(prevAdmins => [...prevAdmins, { ...newAdmin, id: String(Date.now()) }]); // Use more unique ID
  };
  
  // The isMounted check for rendering children might not be strictly necessary
  // if authLoading handles the initial state correctly.
  // However, keeping it doesn't hurt and ensures client-side logic dependent on mount executes.
  if (!isMounted) {
    return null; // Or a global loading spinner if preferred
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
