import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { UserRole, UserProfile } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  dbConnected: boolean;
  dbMessage: string;
  currentRole: UserRole;
  switchMockRole: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string, 
    password: string, 
    fullName: string, 
    requestedRole: UserRole, 
    staffInviteCode?: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  signOut: () => Promise<void>;
  refreshConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Recognized secure staff verification tokens for SIH demonstration
const STAFF_VERIFICATION_CODES: Record<string, UserRole> = {
  'HOSPITAL-DOC-2026': 'doctor',
  'LAB-ASSIST-2026': 'lab_technician',
  'HOSPITAL-ADMIN-2026': 'admin'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(MOCK_USERS['patient']);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [dbMessage, setDbMessage] = useState<string>('Checking database status...');
  const [mockRole, setMockRole] = useState<UserRole>('patient');

  // Verify Supabase connectivity on mount
  const checkDb = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setDbConnected(false);
      setDbMessage('Supabase URL/Key not set in frontend/.env (Operating in local test mode)');
      setLoading(false);
      return;
    }

    const res = await testSupabaseConnection();
    setDbConnected(res.connected);
    setDbMessage(res.message);
  };

  useEffect(() => {
    checkDb();

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Listen to Supabase Auth State changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          setProfile(MOCK_USERS[mockRole]);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [mockRole]);

  const fetchUserProfile = async (userId: string) => {
    if (!supabase) return;
    try {
      const { data, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr) {
        console.warn('Could not fetch remote profile:', profileErr.message);
        return;
      }

      if (data) {
        setProfile({
          id: data.id,
          name: data.full_name,
          email: data.email,
          role: data.role === 'lab_assistant' ? 'lab_technician' : (data.role as UserRole),
          pqcPublicKey: data.pqc_public_key,
          pqcDsaPublicKey: data.pqc_dsa_public_key,
          department: data.department,
          licenseNumber: data.license_number
        });
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }
  };

  const switchMockRole = (role: UserRole) => {
    setMockRole(role);
    if (!user) {
      setProfile(MOCK_USERS[role]);
    }
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      // Mock Sign In
      const foundRole = (
        email.includes('admin') ? 'admin' :
        email.includes('doc') ? 'doctor' : 
        email.includes('lab') ? 'lab_technician' : 'patient'
      ) as UserRole;
      switchMockRole(foundRole);
      return { success: true };
    }

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        return { success: false, error: authErr.message };
      }

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      return { success: true };
    } catch (err: any) {
      setError(err?.message || 'Login failed');
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    requestedRole: UserRole,
    staffInviteCode?: string
  ) => {
    setError(null);
    if (!isSupabaseConfigured || !supabase) {
      switchMockRole(requestedRole);
      return { 
        success: true, 
        message: 'Signed up in local preview mode.' 
      };
    }

    // Role Escalation Defense: Verify staff code for Doctor & Lab Assistant roles
    let assignedRole: UserRole = 'patient';
    let isStaff = false;

    if (requestedRole === 'doctor' || requestedRole === 'lab_technician') {
      const expectedRole = requestedRole === 'lab_technician' ? 'lab_technician' : 'doctor';
      if (!staffInviteCode || STAFF_VERIFICATION_CODES[staffInviteCode] !== expectedRole) {
        return {
          success: false,
          error: 'Security Notice: Privileged staff roles (Doctor/Lab Assistant) require a valid administrative verification code. Defaulting to Patient role is required without valid staff credentials.'
        };
      }
      assignedRole = requestedRole;
      isStaff = true;
    }


    try {
      const { data, error: signupErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: assignedRole,
          }
        }
      });

      if (signupErr) {
        setError(signupErr.message);
        return { success: false, error: signupErr.message };
      }

      if (data.user) {
        // Insert into public.profiles
        const { error: insertErr } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email,
            full_name: fullName,
            role: assignedRole,
            is_verified_staff: isStaff,
            pqc_public_key: `MLKEM768-PUB-${data.user.id.slice(0, 8)}`,
            pqc_dsa_public_key: `MLDSA65-PUB-${data.user.id.slice(0, 8)}`
          }
        ]);

        if (insertErr) {
          console.error('Failed to create profile record:', insertErr.message);
        }
      }

      return { 
        success: true, 
        message: 'Registration successful! Please check your email to confirm your account.' 
      };
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      return { success: false, error: err?.message || 'Registration failed' };
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(MOCK_USERS['patient']);
  };

  const currentRole = profile?.role ?? mockRole;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        error,
        isConfigured: isSupabaseConfigured,
        dbConnected,
        dbMessage,
        currentRole,
        switchMockRole,
        signIn,
        signUp,
        signOut,
        refreshConnection: checkDb,
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
