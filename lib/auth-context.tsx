'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_ADMIN } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, email?: string, password?: string) => Promise<boolean>;
  signup: (displayName: string, email: string, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => void;
  quickLogin: (targetRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'deaflms_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load persisted user on client
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to student demo user
        setUser(MOCK_CURRENT_USER);
      }
    } catch (e) {
      setUser(MOCK_CURRENT_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
        if (typeof document !== 'undefined') {
          document.cookie = `deaflms_role=${newUser.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `deaflms_user_id=${newUser.id}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        if (typeof document !== 'undefined') {
          document.cookie = 'deaflms_role=; path=/; max-age=0; SameSite=Lax';
          document.cookie = 'deaflms_user_id=; path=/; max-age=0; SameSite=Lax';
        }
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const login = async (role: UserRole, email?: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            displayName: data.user.user_metadata?.display_name || email.split('@')[0],
            role,
            avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
            totalStars: role === 'student' ? 24 : undefined,
          };
          persistUser(profile);
          setIsLoading(false);
          return true;
        }
      }

      // Mock login fallback
      let matchedUser: UserProfile = MOCK_CURRENT_USER;
      if (role === 'teacher') matchedUser = MOCK_TEACHER;
      if (role === 'admin') matchedUser = MOCK_ADMIN;

      if (email) {
        matchedUser = {
          ...matchedUser,
          email,
          displayName: email.split('@')[0].replace('.', ' '),
        };
      }

      persistUser(matchedUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.warn('Login error, using mock:', e);
      persistUser(role === 'teacher' ? MOCK_TEACHER : role === 'admin' ? MOCK_ADMIN : MOCK_CURRENT_USER);
      setIsLoading(false);
      return true;
    }
  };

  const signup = async (
    displayName: string,
    email: string,
    role: UserRole,
    password?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName, role } },
        });
        if (!error && data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email,
            displayName,
            role,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            totalStars: role === 'student' ? 10 : undefined,
          };
          persistUser(newUser);
          setIsLoading(false);
          return true;
        }
      }

      // Mock registration
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        displayName,
        role,
        avatarUrl:
          role === 'student'
            ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
            : role === 'teacher'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        totalStars: role === 'student' ? 10 : undefined,
      };

      persistUser(newUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.warn('Signup error, using mock:', e);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    persistUser(null);
  };

  const quickLogin = (targetRole: UserRole) => {
    if (targetRole === 'student') persistUser(MOCK_CURRENT_USER);
    if (targetRole === 'teacher') persistUser(MOCK_TEACHER);
    if (targetRole === 'admin') persistUser(MOCK_ADMIN);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
        quickLogin,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
