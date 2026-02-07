import React, { useState, useEffect, createContext, useContext } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  timezone?: string;
  preferredCurrency?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  hasCompletedOnboarding?: boolean;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = localStorage.getItem('vaultx_token');
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Try to validate token with backend
      const userData = await api.auth.getProfile();
      
      if (userData) {
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('vaultx_token');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Failed to validate token:', error);
      // Token is invalid or backend error, clear everything
      localStorage.removeItem('vaultx_token');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try to connect to the backend API
      const response = await api.auth.login(email, password);

      if (response && response.access_token) {
        localStorage.setItem('vaultx_token', response.access_token);
        // Fetch user profile after login
        const userData = await api.auth.getProfile();
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Login failed. Please check your credentials.',
        }));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        // Backend returned an error response
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 403) {
          errorMessage = 'Account is disabled. Please contact support.';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await api.auth.signup({ 
        email, 
        password, 
        username,
        firstName, 
        lastName,
      });

      if (response && response.access_token) {
        localStorage.setItem('vaultx_token', response.access_token);
        // Fetch user profile after signup
        const userData = await api.auth.getProfile();
        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Signup failed. Please try again.',
        }));
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response) {
        // Backend returned an error response
        if (error.response.status === 400) {
          if (error.response.data?.detail) {
            errorMessage = error.response.data.detail;
          } else {
            errorMessage = 'Invalid signup data. Please check your information.';
          }
        } else if (error.response.status === 409) {
          errorMessage = 'Email or username already exists.';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('ERR_CONNECTION_REFUSED')) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try to notify backend about logout
      try {
        await api.auth.logout();
      } catch (error) {
        // Don't fail logout if backend is unavailable
        console.warn('Backend logout failed, proceeding with client-side logout');
      }

      // Always clear local storage and state
      localStorage.removeItem('vaultx_token');
      localStorage.removeItem('hasCompletedOnboarding');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      
      console.info('✅ Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      localStorage.removeItem('vaultx_token');
      localStorage.removeItem('hasCompletedOnboarding');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('vaultx_refresh_token');
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.auth.refreshToken(refreshTokenValue);
      
      if (response.success && response.data) {
        localStorage.setItem('vaultx_token', response.data.access_token);
        
        setAuthState(prev => ({
          ...prev,
          user: response.data?.user || null,
          error: null,
        }));
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error: any) {
      console.warn('Token refresh failed:', error.message);
      // On refresh failure, logout user
      await logout();
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    try {
      const response = await api.auth.updateProfile(updates);
      
      if (response) {
        setAuthState(prev => ({
          ...prev,
          user: response || null,
        }));
        
        // If completing onboarding, store locally
        if (updates.hasCompletedOnboarding) {
          localStorage.setItem('hasCompletedOnboarding', 'true');
        }
      }
    } catch (error: any) {
      console.error('Profile update failed:', error.message);
      throw error;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    clearError,
    refreshToken,
    updateUserProfile,
  };
};