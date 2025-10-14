"use client";

import { useState } from "react";
import { Shield, ArrowRight, Github, TrendingUp, Bitcoin, BarChart3, Wallet, Activity, PieChart, DollarSign, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function HomePage() {
  const { loginWithGoogle, loginWithApple, loginWithGitHub, login, signup, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true); // Start with login view
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    agreedToTerms: false 
  });

  // Form handlers
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    
    if (isLogin) {
      // Handle login
      if (!formData.email || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }
      
      try {
        await login(formData.email, formData.password);
      } catch (err) {
        console.error('Login error:', err);
        alert('Login failed. Please check your credentials.');
      }
    } else {
      // Handle signup
      if (!formData.agreedToTerms) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        return;
      }
      
      if (!formData.email || !formData.password || !formData.username || !formData.firstName || !formData.lastName) {
        alert('Please fill in all required fields');
        return;
      }
      
      try {
        await signup(formData.email, formData.password, formData.firstName, formData.lastName, formData.username);
      } catch (err) {
        console.error('Signup error:', err);
        alert('Registration failed. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Side - Enhanced Crypto Showcase */}
          <div className="space-y-8 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Crypto Icons */}
              <div className="absolute top-10 left-10 opacity-20 animate-bounce">
                <Bitcoin className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="absolute top-32 right-16 opacity-20 animate-pulse">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="absolute bottom-32 left-20 opacity-20 animate-bounce" style={{animationDelay: '1s'}}>
                <BarChart3 className="h-7 w-7 text-blue-400" />
              </div>
              <div className="absolute bottom-16 right-12 opacity-20 animate-pulse" style={{animationDelay: '2s'}}>
                <Wallet className="h-6 w-6 text-purple-400" />
              </div>
            </div>

            {/* Main Branding */}
            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">VaultX</h1>
                  <p className="text-slate-400 text-sm">Portfolio Tracker</p>
                </div>
              </div>
              <h2 className="text-5xl font-bold leading-tight">
                Professional Crypto
                <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text block">
                  Trading Platform
                </span>
              </h2>
              <p className="text-slate-300 text-xl leading-relaxed">
                Advanced analytics, real-time tracking, and intelligent portfolio management for the modern crypto trader.
              </p>
            </div>

            {/* Live Portfolio Preview */}
            <div className="relative bg-slate-800/30 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 hover:border-slate-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white">Live Portfolio</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-400">LIVE</span>
                </div>
              </div>
              
              {/* Crypto Assets */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-yellow-500/30 transition-all group">
                  <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                    <Bitcoin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">BTC</div>
                    <div className="text-lg font-bold text-white font-mono">$67,832</div>
                    <div className="text-xs text-green-400">+2.5%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/30 hover:border-blue-500/30 transition-all group">
                  <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">ETH</div>
                    <div className="text-lg font-bold text-white font-mono">$3,421</div>
                    <div className="text-xs text-green-400">+1.8%</div>
                  </div>
                </div>
              </div>
              
              {/* Portfolio Value */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-lg border border-purple-500/30">
                <div>
                  <div className="text-sm text-slate-300">Total Portfolio Value</div>
                  <div className="text-2xl font-black text-white font-mono">$247,832.09</div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-bold text-green-400">+12.5%</span>
                </div>
              </div>

              {/* Analytics Icons */}
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 backdrop-blur-sm rounded-lg border border-cyan-400/30 hover:scale-110 transition-transform">
                <PieChart className="h-4 w-4 text-cyan-400" />
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  500+
                </div>
                <div className="text-sm text-slate-400">Crypto Assets</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  24/7
                </div>
                <div className="text-sm text-slate-400">Live Trading</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  99.9%
                </div>
                <div className="text-sm text-slate-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Form */}
          <div className="max-w-md mx-auto w-full">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              {/* Form Toggle */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-slate-700/50 rounded-xl p-1 flex">
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isLogin 
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      !isLogin 
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h3>
              <p className="text-slate-300 mb-6">
                {isLogin 
                  ? 'Sign in to access your crypto portfolio' 
                  : 'Create your account to start tracking'
                }
              </p>

              {/* Security Badge */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-sm font-semibold text-green-300">Bank-Grade Security</div>
                    <div className="text-xs text-green-400/70">Your data is encrypted and secure</div>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <button 
                  onClick={() => loginWithGoogle()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-colors border text-gray-700 hover:text-gray-900 disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLogin ? 'Sign in with Google' : 'Continue with Google'}
                </button>

                <button 
                  onClick={() => loginWithApple()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 rounded-xl transition-colors border border-gray-800 text-white disabled:opacity-50"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  {isLogin ? 'Sign in with Apple' : 'Continue with Apple'}
                </button>

                <button 
                  onClick={() => loginWithGitHub()}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors border border-slate-600 text-white disabled:opacity-50"
                >
                  <Github className="h-5 w-5" />
                  {isLogin ? 'Sign in with GitHub' : 'Continue with GitHub'}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">
                    {isLogin ? 'or sign in with email' : 'or continue with email'}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Signup-only fields */}
                {!isLogin && (
                  <div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Username"
                      required
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-white placeholder-slate-400"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-white placeholder-slate-400"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                      className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-white placeholder-slate-400"
                    />
                  </div>
                )}

                {/* Common fields */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-white placeholder-slate-400"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    required
                    minLength={isLogin ? 1 : 8}
                    className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors text-white placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Login-specific elements */}
                {isLogin && (
                  <div className="text-right">
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Signup-specific elements */}
                {!isLogin && (
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500" 
                    />
                    <label className="text-sm text-slate-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || (!isLogin && !formData.agreedToTerms)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold text-white hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-slate-400 text-sm">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <button 
                        onClick={() => setIsLogin(false)}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        Create Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button 
                        onClick={() => setIsLogin(true)}
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}