'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { validateLoginForm } from '@/utils/validation';
import { useAuth } from '@/providers/AuthProvider';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading, error: authError, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showSecurityTips, setShowSecurityTips] = useState(false);

  // Redirect based on authentication and onboarding status
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has completed onboarding
      const hasCompletedOnboarding = user.hasCompletedOnboarding || localStorage.getItem('hasCompletedOnboarding') === 'true';
      
      if (hasCompletedOnboarding) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      await login(formData.email, formData.password);
      
      // If login is successful, the useEffect above will handle redirect
      setLoginAttempts(0);
      console.log('✅ Login successful, redirecting to dashboard...');
      
    } catch (error) {
      console.error('Login failed:', error);
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setErrors({ 
          email: 'Too many failed attempts. Account temporarily locked for security. Please try again in 15 minutes.' 
        });
        setShowSecurityTips(true);
      } else {
        const errorMessage = authError || 'Invalid email or password';
        setErrors({ 
          email: `${errorMessage}. ${3 - newAttempts} attempts remaining before temporary lockout.` 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        
        {/* Animated Geometric Shapes */}
        <div className="absolute top-20 left-20 opacity-10">
          <div className="w-32 h-32 border border-purple-400/30 rotate-45 animate-pulse"></div>
        </div>
        <div className="absolute top-40 right-32 opacity-10">
          <div className="w-24 h-24 border border-cyan-400/30 rounded-full animate-pulse delay-1000"></div>
        </div>
        <div className="absolute bottom-40 left-32 opacity-10">
          <div className="w-28 h-28 border border-purple-400/20 rounded-full animate-pulse delay-2000"></div>
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <div className="w-20 h-20 border border-cyan-400/20 rotate-45 animate-pulse delay-3000"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link 
              href="/"
              className="inline-block mb-8 text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
            >
              VaultX
            </Link>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Sign in to your account to access your crypto portfolio
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-purple-300 transition-colors duration-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm ${
                      errors.email 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-slate-600/50 focus:border-purple-400/50'
                    }`}
                    placeholder="Enter your email address"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-slate-300 mb-2 group-focus-within:text-purple-300 transition-colors duration-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:bg-slate-700/50 transition-all duration-300 backdrop-blur-sm ${
                      errors.password 
                        ? 'border-red-400/50 focus:border-red-400/70' 
                        : 'border-slate-600/50 focus:border-purple-400/50'
                    }`}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 underline underline-offset-2"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-slate-900 transform ${
                  isLoading 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Security Notice */}
            {!showSecurityTips ? (
              <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Security Notice</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Your account is protected with industry-standard security. We never store passwords in plain text and use secure encryption.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-red-400 mb-1">Account Temporarily Locked</h4>
                      <p className="text-xs text-red-300 leading-relaxed">
                        For your security, this account has been temporarily locked due to multiple failed login attempts.
                      </p>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-white mb-2">Security Tips:</h5>
                      <ul className="text-xs text-slate-300 space-y-1">
                        <li>• Double-check your email address for typos</li>
                        <li>• Ensure Caps Lock is not enabled</li>
                        <li>• Try resetting your password if you&apos;re unsure</li>
                        <li>• Contact support if you believe this is an error</li>
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-red-400/20">
                      <p className="text-xs text-red-300">
                        Access will be restored automatically in <span className="font-medium text-red-400">15 minutes</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30 flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-300 mb-1">Secure Login</h4>
                  <p className="text-xs text-blue-200/90 leading-relaxed">
                    Your credentials are encrypted and we never store your private keys or wallet passwords.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Login Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/40 text-slate-400 font-medium">or continue with</span>
              </div>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="space-y-3">
              {/* Google Login */}
              <button className="w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 group-hover:text-gray-900">Continue with Google</span>
              </button>

              {/* Apple Login */}
              <button className="w-full bg-black hover:bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-white group-hover:text-gray-100">Continue with Apple</span>
              </button>

              {/* GitHub Login */}
              <button className="w-full bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl px-4 py-3 flex items-center justify-center gap-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-slate-200 group-hover:text-white">Continue with GitHub</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{' '}
              <Link 
                href="/"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300 underline underline-offset-2"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}