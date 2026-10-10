import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getStoredToken, setStoredToken } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  elevateRole: (secretKey?: string, targetRole?: 'teacher' | 'admin') => Promise<void>;
  quickLoginAs: (role: 'student' | 'teacher') => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { targetBand?: number | null; testDate?: string | null; testTypePreference?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.me();
      setUser(res.user);
    } catch (err) {
      console.warn('Session expired or invalid token', err);
      setStoredToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setStoredToken(res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setStoredToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    setStoredToken(null);
    setUser(null);
  };

  const elevateRole = async (secretKey?: string, targetRole: 'teacher' | 'admin' = 'teacher') => {
    const res = await api.elevate({ secretKey, targetRole });
    setStoredToken(res.token);
    setUser(res.user);
  };

  const quickLoginAs = async (role: 'student' | 'teacher') => {
    if (role === 'teacher') {
      await login('arik@ieltsplatform.test', 'Password123!');
    } else {
      await login('student@ieltsplatform.test', 'Password123!');
    }
  };

  const updateProfile = async (data: { targetBand?: number | null; testDate?: string | null; testTypePreference?: string }) => {
    const res = await api.updateProfile(data);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        elevateRole,
        quickLoginAs,
        refreshUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
