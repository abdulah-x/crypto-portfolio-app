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
      const response = await api.validateToken();
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
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
      console.warn('Backend API not available for token validation, checking local token');
      
      // If backend is not available, check if we have a mock token for development
      const token = localStorage.getItem('vaultx_token');
      if (token && token.startsWith('mock-jwt-token')) {
        // Mock user for development
        const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
        const mockUser = {
          id: 1,
          username: 'demouser',
          email: 'demo@vaultx.com',
          firstName: 'Demo',
          lastName: 'User',
          timezone: 'UTC',
          preferredCurrency: 'USD',
          isActive: true,
          isVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          hasCompletedOnboarding: hasCompletedOnboarding,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
        };
        
        setAuthState({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        console.info('✅ Mock authentication restored from local storage');
      } else {
        // Unknown token or backend error, clear everything
        if (token) {
          localStorage.removeItem('vaultx_token');
        }
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try to connect to the backend API
      const response = await api.login({ email, password });

      if (response.success && response.data) {
        localStorage.setItem('vaultx_token', response.data.access_token);
        setAuthState({
          user: response.data.user,
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
      console.warn('Backend API not available, using mock authentication for development');
      
      // If backend is not available, provide mock authentication for development
      if (error.message && error.message.includes('Backend service is not available')) {
        // Mock authentication for development when backend is not available
        if (email && password) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Create mock user data
          const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
          const isReturningUser = localStorage.getItem(`user_${email}_returning`) === 'true';
          
          const mockUser = {
            id: parseInt(`${email.replace('@', '').replace('.', '').slice(0, 8)}`) || 1,
            username: email.split('@')[0],
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            timezone: 'UTC',
            preferredCurrency: 'USD',
            isActive: true,
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            hasCompletedOnboarding: hasCompletedOnboarding && isReturningUser,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
          };
          
          // Create mock token
          const mockToken = 'mock-jwt-token-for-development';
          localStorage.setItem('vaultx_token', mockToken);
          
          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          
          console.info('✅ Mock login successful for development');
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Please provide both email and password',
          }));
        }
      } else {
        // Real error from backend
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.message) {
          if (error.message.includes('Authentication required')) {
            errorMessage = 'Invalid email or password';
          } else if (error.message.includes('Validation error')) {
            errorMessage = error.message;
          } else if (error.message.includes('Server error')) {
            errorMessage = 'Server error. Please try again later.';
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
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await api.signup({ 
        email, 
        password, 
        username,
        first_name: firstName, 
        last_name: lastName,
      });

      if (response.success && response.data) {
        localStorage.setItem('vaultx_token', response.data.access_token);
        setAuthState({
          user: response.data.user,
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
      console.warn('Backend API not available, using mock registration for development');
      
      // If backend is not available, provide mock registration for development
      if (error.message && error.message.includes('Backend service is not available')) {
        // Mock registration for development when backend is not available
        if (email && password && firstName && lastName && username) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create mock user data - new users should NOT have completed onboarding
          const mockUser = {
            id: parseInt(Math.random().toString().slice(2, 10)) || 1,
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            timezone: 'UTC',
            preferredCurrency: 'USD',
            isActive: true,
            isVerified: false, // New users need email verification
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            hasCompletedOnboarding: false, // New users always need onboarding
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
          };
          
          // Create mock token
          const mockToken = 'mock-jwt-token-for-development-' + Date.now();
          localStorage.setItem('vaultx_token', mockToken);
          
          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          
          console.info('✅ Mock registration successful for development');
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Please fill in all required fields',
          }));
        }
      } else {
        // Real error from backend
        let errorMessage = 'Signup failed. Please try again.';
        
        if (error.message) {
          if (error.message.includes('Validation error')) {
            errorMessage = error.message;
          } else if (error.message.includes('Server error')) {
            errorMessage = 'Server error. Please try again later.';
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
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Try to notify backend about logout
      try {
        await api.logout();
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
      const response = await api.refreshToken();
      
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
      const response = await api.updateUserProfile(updates);
      
      if (response.success && response.data) {
        setAuthState(prev => ({
          ...prev,
          user: response.data || null,
        }));
      } else {
        // For mock/offline mode, update locally
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, ...updates } : null,
        }));
        
        // If completing onboarding, mark user as returning user for future logins
        if (updates.hasCompletedOnboarding && authState.user?.email) {
          localStorage.setItem(`user_${authState.user.email}_returning`, 'true');
          localStorage.setItem('hasCompletedOnboarding', 'true');
        }
      }
    } catch (error: any) {
      console.warn('Profile update via API failed, updating locally:', error.message);
      // Fallback to local update
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
      
      // If completing onboarding, mark user as returning user for future logins
      if (updates.hasCompletedOnboarding && authState.user?.email) {
        localStorage.setItem(`user_${authState.user.email}_returning`, 'true');
        localStorage.setItem('hasCompletedOnboarding', 'true');
      }
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