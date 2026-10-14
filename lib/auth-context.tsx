'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_ADMIN } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';

interface RegisteredAccount {
  email: string;
  password: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role?: UserRole, email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (displayName: string, email: string, role: UserRole, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickLogin: (targetRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  demoCredentials: {
    student: { email: string; pass: string; label: string };
    teacher: { email: string; pass: string; label: string };
    admin: { email: string; pass: string; label: string };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'deaflms_auth_user';
const ACCOUNTS_STORAGE_KEY = 'deaflms_registered_accounts';

export const DEMO_CREDENTIALS = {
  student: {
    email: 'student@deaflms.org',
    pass: 'learner123',
    label: 'Amina (Primary 4 Learner)',
  },
  teacher: {
    email: 'teacher@deaflms.org',
    pass: 'teacher123',
    label: 'Jordan Ellis (Deaf Facilitator)',
  },
  admin: {
    email: 'admin@deaflms.org',
    pass: 'admin123',
    label: 'Dr. Patricia Okon (Institutional Admin)',
  },
};

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    email: DEMO_CREDENTIALS.student.email.toLowerCase(),
    password: DEMO_CREDENTIALS.student.pass,
    profile: {
      ...MOCK_CURRENT_USER,
      email: DEMO_CREDENTIALS.student.email,
    },
  },
  {
    email: DEMO_CREDENTIALS.teacher.email.toLowerCase(),
    password: DEMO_CREDENTIALS.teacher.pass,
    profile: {
      ...MOCK_TEACHER,
      email: DEMO_CREDENTIALS.teacher.email,
    },
  },
  {
    email: DEMO_CREDENTIALS.admin.email.toLowerCase(),
    password: DEMO_CREDENTIALS.admin.pass,
    profile: {
      ...MOCK_ADMIN,
      email: DEMO_CREDENTIALS.admin.email,
    },
  },
];

function getStoredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function saveAccount(account: RegisteredAccount) {
  try {
    const current = getStoredAccounts();
    const filtered = current.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
    const updated = [...filtered, account];
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving local account:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session from localStorage or cookie
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        // Ensure cookies match session
        if (typeof document !== 'undefined' && parsed?.role) {
          document.cookie = `deaflms_role=${parsed.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `deaflms_user_id=${parsed.id}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
        // True guest state: unauthenticated until sign in
        setUser(null);
      }
    } catch {
      setUser(null);
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

  const login = async (
    role?: UserRole,
    email?: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // 1. If Supabase is configured, use real Supabase authentication
    if (isSupabaseConfigured && supabase && email && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            displayName: data.user.user_metadata?.display_name || email.split('@')[0],
            role: (data.user.user_metadata?.role as UserRole) || role || 'student',
            avatarUrl:
              role === 'teacher'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
            totalStars: role === 'student' ? 24 : undefined,
          };
          persistUser(profile);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase auth failed, falling back to local registry:', err);
      }
    }

    // 2. Local Verified Account Registry (Offline & Pitch Proof)
    const normalizedEmail = (email || '').trim().toLowerCase();
    const accounts = getStoredAccounts();

    if (normalizedEmail) {
      const match = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

      if (match) {
        if (password && password !== match.password) {
          setIsLoading(false);
          return {
            success: false,
            error: 'Incorrect password. Please verify or use 1-click demo login below.',
          };
        }

        // Account authenticated successfully
        const activeProfile: UserProfile = {
          ...match.profile,
          role: role || match.profile.role,
        };
        persistUser(activeProfile);
        setIsLoading(false);
        return { success: true };
      }

      // If email not found in registry but password provided, create ad-hoc profile
      if (password && password.length >= 4) {
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          email: normalizedEmail,
          displayName: normalizedEmail.split('@')[0].replace(/[-_.]/g, ' '),
          role: role || 'student',
          avatarUrl:
            (role || 'student') === 'teacher'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
          totalStars: role === 'student' ? 10 : undefined,
        };
        saveAccount({
          email: normalizedEmail,
          password,
          profile: newProfile,
        });
        persistUser(newProfile);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Account not found. Please register or select 1-click demo login.',
      };
    }

    // 3. Fallback quick login when no email passed
    const targetRole: UserRole = role || 'student';
    let fallbackProfile = MOCK_CURRENT_USER;
    if (targetRole === 'teacher') fallbackProfile = MOCK_TEACHER;
    if (targetRole === 'admin') fallbackProfile = MOCK_ADMIN;

    persistUser(fallbackProfile);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (
    displayName: string,
    email: string,
    role: UserRole,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Real Supabase registration if configured
    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { display_name: displayName, role } },
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: normalizedEmail,
            displayName,
            role,
            avatarUrl:
              role === 'teacher'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
            totalStars: role === 'student' ? 10 : undefined,
          };
          persistUser(profile);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        console.warn('Supabase signup error, using local accounts registry:', err);
      }
    }

    // 2. Local Account Registration
    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (existing) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      displayName: displayName.trim() || normalizedEmail.split('@')[0],
      role,
      avatarUrl:
        role === 'student'
          ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'
          : role === 'teacher'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      totalStars: role === 'student' ? 10 : undefined,
    };

    saveAccount({
      email: normalizedEmail,
      password: password || 'learner123',
      profile: newProfile,
    });

    persistUser(newProfile);
    setIsLoading(false);
    return { success: true };
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

    // Update in stored accounts if available
    if (user.email) {
      const accounts = getStoredAccounts();
      const match = accounts.find((a) => a.email.toLowerCase() === user.email.toLowerCase());
      if (match) {
        saveAccount({
          ...match,
          profile: updated,
        });
      }
    }
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
        demoCredentials: DEMO_CREDENTIALS,
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
