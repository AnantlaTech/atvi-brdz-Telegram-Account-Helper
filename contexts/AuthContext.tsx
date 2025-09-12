//Path: contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSDK } from '@/hooks/useSDK';

interface AuthContextType {
  user: any;
  token: string | null;
  ekycStatus: string;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateEkycStatus: (status: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions untuk localStorage
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { token: null, user: null };
  
  return {
    token: localStorage.getItem('auth_token'),
    user: {
      user_id: localStorage.getItem('user_id'),
      username: localStorage.getItem('username'),
      email: localStorage.getItem('email')
    }
  };
};

const setStoredAuth = (token: string, user: any) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_id', user.user_id?.toString() || user.id?.toString() || '');
  localStorage.setItem('username', user.username || '');
  localStorage.setItem('email', user.email || '');
};

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('ekyc_status');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ekycStatus, setEkycStatus] = useState<string>('PENDING');
  const [isLoading, setIsLoading] = useState(true);

  const { sdk, isReady } = useSDK();

  useEffect(() => {
    if (isReady) {
      const { token: storedToken, user: storedUser } = getStoredAuth();
      
      if (storedToken && storedUser.user_id) {
        setToken(storedToken);
        setUser(storedUser);
        setEkycStatus(localStorage.getItem('ekyc_status') || 'PENDING');
      }
      setIsLoading(false);
    }
  }, [isReady]);

  const login = async (email: string, password: string) => {
    if (!sdk) throw new Error('SDK not ready');
    
    try {
      const response = await sdk.auth.loginUser(email, password);
      
      // Handle different response formats
      const token = response.data?.token || response.token;
      const userData = response.data?.user || response.user || response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid login response');
      }
      
      setToken(token);
      setUser(userData);
      setStoredAuth(token, userData);
      
      // Set eKYC status if available
      const userEkycStatus = userData.ekyc_status || 'PENDING';
      setEkycStatus(userEkycStatus);
      localStorage.setItem('ekyc_status', userEkycStatus);
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    if (!sdk) throw new Error('SDK not ready');
    
    try {
      const response = await sdk.auth.registerUser(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      
      // Registration successful - user still needs to login
      console.log('Registration successful:', response);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setEkycStatus('PENDING');
    clearStoredAuth();
  };

  const updateEkycStatus = (status: string) => {
    setEkycStatus(status);
    localStorage.setItem('ekyc_status', status);
  };

  const value = {
    user,
    token,
    ekycStatus,
    login,
    register,
    logout,
    updateEkycStatus,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper hook for pages that require authentication
export const useRequireAuth = () => {
  const { user, token, ekycStatus, isLoading } = useAuth();
  const isAuthenticated = !!token && !!user?.user_id;
  
  return {
    user,
    token,
    ekycStatus,
    isAuthenticated,
    isLoading,
    needsEkyc: isAuthenticated && ekycStatus !== 'APPROVED'
  };
};