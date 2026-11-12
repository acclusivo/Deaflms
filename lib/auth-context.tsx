'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole, AgeSegment } from './types';
import { MOCK_CURRENT_USER, MOCK_TEACHER, MOCK_PARENT, MOCK_ADMIN } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';

export interface RegisteredAccount {
  email: string;
  password: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role?: UserRole, email?: string, password?: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signup: (
    displayName: string,
    email: string,
    role: UserRole,
    password?: string,
    ageSegment?: AgeSegment,
    customAge?: number,
    schoolOrOrganization?: string
  ) => Promise<{ success: boolean; error?: string; pendingApproval?: boolean }>;
  logout: () => void;
  quickLogin: (targetRole: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  approveTeacher: (emailOrId: string) => Promise<boolean>;
  rejectTeacher: (emailOrId: string) => Promise<boolean>;
  getPendingTeachers: () => RegisteredAccount[];
  demoCredentials: {
    student: { email: string; pass: string; label: string };
    teacher: { email: string; pass: string; label: string };
    parent: { email: string; pass: string; label: string };
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
    label: 'Learner Portal',
  },
  parent: {
    email: 'parent@deaflms.org',
    pass: 'parent123',
    label: 'Parent Portal',
  },
  teacher: {
    email: 'teacher@deaflms.org',
    pass: 'teacher123',
    label: 'Facilitator Studio',
  },
  admin: {
    email: 'admin@deaflms.org',
    pass: 'admin123',
    label: 'Administrator Console',
  },
};

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    email: 'student@deaflms.org',
    password: 'learner123',
    profile: MOCK_CURRENT_USER,
  },
  {
    email: 'parent@deaflms.org',
    password: 'parent123',
    profile: MOCK_PARENT,
  },
  {
    email: 'teacher@deaflms.org',
    password: 'teacher123',
    profile: MOCK_TEACHER,
  },
  {
    email: 'admin@deaflms.org',
    password: 'admin123',
    profile: MOCK_ADMIN,
  },
  // Sample Pending Teacher Application for demo of Admin Approval Workflow
  {
    email: 'samuel.adeyemi@school.org',
    password: 'teacher123',
    profile: {
      id: 'teacher-pending-demo',
      email: 'samuel.adeyemi@school.org',
      displayName: 'Samuel Adeyemi',
      role: 'teacher',
      approvalStatus: 'pending',
      schoolOrOrganization: 'Abuja Model Deaf Academy',
      gradeLevel: 'STEM & Visual Tech Instructor',
      signLanguage: 'NSL',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      totalStars: 0,
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
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    // Always merge DEFAULT_ACCOUNTS so demo accounts (admin, teacher, student, parent) are guaranteed to exist
    const accountMap = new Map<string, RegisteredAccount>();
    DEFAULT_ACCOUNTS.forEach((acc) => accountMap.set(acc.email.toLowerCase(), acc));
    parsed.forEach((acc) => {
      if (acc && acc.email) {
        accountMap.set(acc.email.toLowerCase(), acc);
      }
    });
    return Array.from(accountMap.values());
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
        // Ensure cookies match session for zero-trust edge middleware
        if (typeof document !== 'undefined' && parsed?.role) {
          document.cookie = `deaflms_role=${parsed.role}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `deaflms_user_id=${parsed.id}; path=/; max-age=604800; SameSite=Lax`;
        }
      } else {
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
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);

    const normalizedEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Look up any cached local verified account
    const accounts = getStoredAccounts();
    const localMatch = normalizedEmail
      ? accounts.find((a) => a.email.toLowerCase() === normalizedEmail)
      : null;

    // 2. Strict Teacher Approval Check (Edge & Dashboard Security)
    if (localMatch && localMatch.profile.role === 'teacher') {
      if (localMatch.profile.approvalStatus === 'pending') {
        setIsLoading(false);
        return {
          success: false,
          error: 'Your teacher account is pending administrator approval. An administrator must verify and approve your account before you can sign in.',
        };
      }
      if (localMatch.profile.approvalStatus === 'rejected') {
        setIsLoading(false);
        return {
          success: false,
          error: 'Your teacher registration was not approved. Please contact platform administration.',
        };
      }
    }

    // 3. Supabase authentication if configured
    if (isSupabaseConfigured && supabase && normalizedEmail && cleanPassword) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password: cleanPassword,
        });

        if (!error && data.user) {
          let profileRow: any = null;
          try {
            const { data: row } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            profileRow = row;
          } catch {}

          const resolvedRole: UserRole =
            (profileRow?.role as UserRole) ||
            (data.user.user_metadata?.role as UserRole) ||
            localMatch?.profile.role ||
            role ||
            'student';

          const approvalStatus = profileRow?.approval_status || localMatch?.profile.approvalStatus || 'approved';

          // Ensure teacher approval is respected from Supabase
          if (resolvedRole === 'teacher' && approvalStatus === 'pending') {
            setIsLoading(false);
            return {
              success: false,
              error: 'Your teacher account is pending administrator approval.',
            };
          }

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || normalizedEmail,
            displayName:
              profileRow?.display_name ||
              data.user.user_metadata?.display_name ||
              localMatch?.profile.displayName ||
              normalizedEmail.split('@')[0],
            role: resolvedRole,
            approvalStatus,
            ageSegment: profileRow?.age_segment || localMatch?.profile.ageSegment || '9-12',
            customAge: profileRow?.custom_age || localMatch?.profile.customAge,
            schoolOrOrganization: profileRow?.school_organization || localMatch?.profile.schoolOrOrganization,
            avatarUrl:
              profileRow?.avatar_url ||
              localMatch?.profile.avatarUrl ||
              (resolvedRole === 'teacher'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : resolvedRole === 'parent'
                ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'),
            totalStars: profileRow?.total_stars || localMatch?.profile.totalStars || 0,
            enrolledCourseIds: ['course-digital-literacy-1'],
          };

          saveAccount({
            email: normalizedEmail,
            password: cleanPassword,
            profile,
          });

          persistUser(profile);
          setIsLoading(false);
          return { success: true, role: resolvedRole };
        }
      } catch (err: any) {
        console.warn('Supabase auth network notice:', err);
      }
    }

    // 4. Local Verified Account Registry
    if (normalizedEmail) {
      if (localMatch) {
        if (cleanPassword && cleanPassword !== localMatch.password) {
          setIsLoading(false);
          return {
            success: false,
            error: 'Incorrect password. Please verify your credentials.',
          };
        }

        const activeRole: UserRole = localMatch.profile.role || role || 'student';
        const activeProfile: UserProfile = {
          ...localMatch.profile,
          role: activeRole,
        };
        persistUser(activeProfile);
        setIsLoading(false);
        return { success: true, role: activeRole };
      }

      // If user is trying to log in as teacher without a registered account
      if (role === 'teacher') {
        setIsLoading(false);
        return {
          success: false,
          error: 'No approved teacher account found with this email. Teachers must submit an application and receive administrator approval before signing in.',
        };
      }

      // If user enters credentials for student or parent, register locally
      if (cleanPassword && cleanPassword.length >= 4) {
        const autoRole: UserRole = role || 'student';
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          email: normalizedEmail,
          displayName: normalizedEmail.split('@')[0].replace(/[-_.]/g, ' '),
          role: autoRole,
          approvalStatus: 'approved',
          ageSegment: '9-12',
          avatarUrl:
            autoRole === 'parent'
              ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
              : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
          totalStars: 0,
        };
        saveAccount({
          email: normalizedEmail,
          password: cleanPassword,
          profile: newProfile,
        });
        persistUser(newProfile);
        setIsLoading(false);
        return { success: true, role: autoRole };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Account not found. Please register an account first.',
      };
    }

    // 5. Clean guest login when no email provided
    const targetRole: UserRole = role || 'student';
    if (targetRole === 'teacher') {
      setIsLoading(false);
      return {
        success: false,
        error: 'Teacher accounts require administrator approval. Please sign in with your approved educator credentials or submit an application.',
      };
    }

    const fallbackProfile: UserProfile = {
      id: `user-guest-${Date.now()}`,
      email: `${targetRole}@deaflms.org`,
      displayName: targetRole === 'parent' ? 'Guest Parent' : targetRole === 'admin' ? 'Guest Administrator' : 'Guest Learner',
      role: targetRole,
      approvalStatus: 'approved',
      ageSegment: '9-12',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      totalStars: 0,
      enrolledCourseIds: ['course-digital-literacy-1'],
    };

    persistUser(fallbackProfile);
    setIsLoading(false);
    return { success: true, role: targetRole };
  };

  const signup = async (
    displayName: string,
    email: string,
    role: UserRole,
    password?: string,
    ageSegment?: AgeSegment,
    customAge?: number,
    schoolOrOrganization?: string
  ): Promise<{ success: boolean; error?: string; pendingApproval?: boolean }> => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = (password || 'learner123').trim();
    const isTeacher = role === 'teacher';

    const calculatedSegment: AgeSegment =
      ageSegment ||
      (customAge
        ? customAge <= 8
          ? '6-8'
          : customAge <= 12
          ? '9-12'
          : customAge <= 17
          ? '13-17'
          : '18+'
        : '9-12');

    const newProfile: UserProfile = {
      id: `user-${Date.now()}`,
      email: normalizedEmail,
      displayName: displayName.trim() || normalizedEmail.split('@')[0],
      role,
      ageSegment: calculatedSegment,
      customAge,
      schoolOrOrganization: schoolOrOrganization?.trim(),
      approvalStatus: isTeacher ? 'pending' : 'approved',
      avatarUrl:
        role === 'teacher'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : role === 'parent'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      totalStars: role === 'student' ? 10 : 0,
      enrolledCourseIds: ['course-digital-literacy-1'],
    };

    // Save account to local store
    saveAccount({
      email: normalizedEmail,
      password: cleanPassword,
      profile: newProfile,
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem('deaflms_selected_age_segment', calculatedSegment);
      if (customAge) {
        localStorage.setItem('deaflms_custom_age', String(customAge));
      }
    }

    // If teacher, do NOT log in. Must require admin approval!
    if (isTeacher) {
      setIsLoading(false);
      return { success: true, pendingApproval: true };
    }

    // Students and Parents are logged in immediately
    persistUser(newProfile);
    setIsLoading(false);
    return { success: true, pendingApproval: false };
  };

  const approveTeacher = async (emailOrId: string): Promise<boolean> => {
    try {
      const accounts = getStoredAccounts();
      const updated = accounts.map((acc) => {
        if (
          acc.email.toLowerCase() === emailOrId.toLowerCase() ||
          acc.profile.id === emailOrId
        ) {
          return {
            ...acc,
            profile: {
              ...acc.profile,
              approvalStatus: 'approved' as const,
            },
          };
        }
        return acc;
      });
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  };

  const rejectTeacher = async (emailOrId: string): Promise<boolean> => {
    try {
      const accounts = getStoredAccounts();
      const updated = accounts.map((acc) => {
        if (
          acc.email.toLowerCase() === emailOrId.toLowerCase() ||
          acc.profile.id === emailOrId
        ) {
          return {
            ...acc,
            profile: {
              ...acc.profile,
              approvalStatus: 'rejected' as const,
            },
          };
        }
        return acc;
      });
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  };

  const getPendingTeachers = (): RegisteredAccount[] => {
    const accounts = getStoredAccounts();
    return accounts.filter(
      (a) => a.profile.role === 'teacher' && a.profile.approvalStatus === 'pending'
    );
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    persistUser(null);
  };

  const quickLogin = (targetRole: UserRole) => {
    if (targetRole === 'student') persistUser(MOCK_CURRENT_USER);
    if (targetRole === 'parent') persistUser(MOCK_PARENT);
    if (targetRole === 'teacher') persistUser(MOCK_TEACHER);
    if (targetRole === 'admin') persistUser(MOCK_ADMIN);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    persistUser(updated);

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
        approveTeacher,
        rejectTeacher,
        getPendingTeachers,
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
