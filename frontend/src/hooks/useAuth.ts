import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AUTH_CONFIG } from '@/lib/auth-config';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: 'email' | 'google' | 'apple' | 'github';
  isEmailVerified: boolean;
  createdAt: string;
  hasCompletedOnboarding?: boolean;
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
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
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
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData.user,
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
        // This is a mock token from development mode, restore mock user
        const mockUser = {
          id: 'mock-user-restored',
          email: 'demo@vaultx.com',
          firstName: 'Demo',
          lastName: 'User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
          provider: 'email' as const,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
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
      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('vaultx_token', data.token);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Login failed',
        }));
      }
    } catch (error) {
      console.warn('Backend API not available, using mock authentication for development');
      
      // Mock authentication for development when backend is not available
      if (email && password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock user data
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
          provider: 'email' as const,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
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
          error: 'Please enter valid credentials',
        }));
      }
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, username: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          first_name: firstName, 
          last_name: lastName,
          username 
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('vaultx_token', data.token);
        setAuthState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Signup failed',
        }));
      }
    } catch (error) {
      console.warn('Backend API not available, using mock registration for development');
      
      // Mock registration for development when backend is not available
      if (email && password && firstName && lastName && username) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create mock user data
        const mockUser = {
          id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
          email: email,
          firstName: firstName,
          lastName: lastName,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format&q=80',
          provider: 'email' as const,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
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
    }
  };

  const loginWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Redirect to backend Google OAuth endpoint
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initiate Google login',
      }));
    }
  };

  const loginWithApple = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Redirect to backend Apple OAuth endpoint
      window.location.href = '/api/auth/apple';
    } catch (error) {
      console.error('Apple login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initiate Apple login',
      }));
    }
  };

  const loginWithGitHub = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Redirect to backend GitHub OAuth endpoint
      window.location.href = '/api/auth/github';
    } catch (error) {
      console.error('GitHub login error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initiate GitHub login',
      }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const token = localStorage.getItem('vaultx_token');
      if (token) {
        await fetch(`${AUTH_CONFIG.API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      localStorage.removeItem('vaultx_token');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if backend call fails
      localStorage.removeItem('vaultx_token');
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
      const token = localStorage.getItem('vaultx_token');
      if (!token) return;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('vaultx_token', data.token);
        setAuthState(prev => ({
          ...prev,
          user: data.user,
        }));
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const updateUserProfile = async (updates: Partial<User>): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // For mock implementation, just update local state
      // In real app, this would call the API
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
        isLoading: false
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile'
      }));
    }
  };

  return {
    ...authState,
    login,
    signup,
    loginWithGoogle,
    loginWithApple,
    loginWithGitHub,
    logout,
    clearError,
    refreshToken,
    updateUserProfile,
  };
};