"use client";

import { useState, useEffect } from "react";
import { Shield, ArrowRight, TrendingUp, Bitcoin, BarChart3, Wallet, Activity, PieChart, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import GoogleOAuthModal from "@/components/auth/GoogleOAuthModal";

export default function HomePage() {
  const { login, signup, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // Start with login view
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    agreedToTerms: false 
  });

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-800 text-white relative overflow-hidden">
      
      {/* Enhanced Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-cyan-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-pink-600/10"></div>
        
        {/* Animated 3D Geometric Shapes */}
        <div className="absolute top-20 left-20 opacity-30">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500/40 to-cyan-500/40 rounded-3xl rotate-45 animate-pulse backdrop-blur-sm border border-purple-400/30"></div>
        </div>
        <div className="absolute top-40 right-32 opacity-25">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-full animate-bounce border-2 border-cyan-400/30" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute bottom-40 left-32 opacity-30">
          <div className="w-28 h-28 bg-gradient-to-br from-pink-500/40 to-purple-500/40 rounded-2xl animate-pulse border border-pink-400/30" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="absolute bottom-20 right-20 opacity-25">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/40 to-orange-500/40 rounded-full animate-bounce border border-yellow-400/30" style={{animationDelay: '3s'}}></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
        <div className="absolute top-64 right-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-48 left-1/3 w-3 h-3 bg-pink-400/60 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" style={{transform: 'rotate(15deg) scale(1.2)'}}></div>
        
        {/* Floating 3D Cards */}
        <div className="absolute top-1/4 right-1/4 opacity-20">
          <div className="w-16 h-24 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/50 backdrop-blur-sm transform rotate-12 hover:rotate-6 transition-transform duration-700">
            <div className="p-2">
              <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded mb-2"></div>
              <div className="w-3/4 h-1 bg-slate-600 rounded mb-1"></div>
              <div className="w-1/2 h-1 bg-slate-600 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 left-1/5 opacity-20">
          <div className="w-20 h-28 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/50 backdrop-blur-sm transform -rotate-12 hover:rotate-0 transition-transform duration-700">
            <div className="p-2">
              <div className="w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded mb-2"></div>
              <div className="w-4/5 h-1 bg-slate-600 rounded mb-1"></div>
              <div className="w-2/3 h-1 bg-slate-600 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Animated Lines/Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path d="M100,200 Q300,100 500,300" stroke="url(#lineGradient1)" strokeWidth="2" fill="none" className="animate-pulse" />
          <path d="M200,500 Q600,300 800,600" stroke="url(#lineGradient2)" strokeWidth="1.5" fill="none" className="animate-pulse" style={{animationDelay: '1s'}} />
        </svg>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/3 left-1/6">
          <div className="w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-16 h-16 bg-purple-400/40 rounded-full absolute top-8 left-8 animate-ping"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/5">
          <div className="w-28 h-28 bg-cyan-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="w-12 h-12 bg-cyan-400/40 rounded-full absolute top-8 left-8 animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10" style={{paddingTop: process.env.NODE_ENV === 'development' ? '3rem' : '3rem'}}>
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

            {/* Live Portfolio Preview with 3D Effects */}
            <div className="relative bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-slate-600/40 rounded-2xl p-6 hover:border-slate-500/60 transition-all duration-500 group shadow-2xl shadow-purple-900/20 hover:shadow-purple-900/40 transform hover:-translate-y-1">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-white group-hover:text-purple-100 transition-colors">Live Portfolio</h4>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-400">LIVE</span>
                </div>
              </div>
              
              {/* Enhanced 3D Crypto Assets */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="relative flex items-center gap-3 p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/40 rounded-xl border border-slate-600/40 hover:border-yellow-500/50 transition-all duration-300 group transform hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg group-hover:shadow-yellow-500/50 transition-shadow">
                    <Bitcoin className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                  <div className="relative">
                    <div className="text-xs text-slate-400 font-medium">BTC</div>
                    <div className="text-lg font-black text-white font-mono tracking-tight">$67,832</div>
                    <div className="text-xs text-green-400 font-semibold">↗ +2.5%</div>
                  </div>
                </div>
                
                <div className="relative flex items-center gap-3 p-4 bg-gradient-to-br from-slate-700/60 to-slate-800/40 rounded-xl border border-slate-600/40 hover:border-blue-500/50 transition-all duration-300 group transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                    <Activity className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                  <div className="relative">
                    <div className="text-xs text-slate-400 font-medium">ETH</div>
                    <div className="text-lg font-black text-white font-mono tracking-tight">$3,421</div>
                    <div className="text-xs text-green-400 font-semibold">↗ +1.8%</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Portfolio Value with 3D Effect */}
              <div className="relative flex items-center justify-between p-6 bg-gradient-to-br from-purple-600/30 via-purple-700/20 to-cyan-600/30 rounded-xl border border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 group shadow-2xl hover:shadow-purple-900/50 transform hover:-translate-y-1">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 rounded-xl animate-pulse"></div>
                <div className="relative">
                  <div className="text-sm text-slate-300 font-medium mb-1">Total Portfolio Value</div>
                  <div className="text-3xl font-black font-mono tracking-tight bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent">
                    $247,832.09
                  </div>
                </div>
                <div className="relative flex items-center gap-3 px-4 py-2 bg-green-500/30 hover:bg-green-500/40 rounded-full border border-green-400/40 hover:border-green-300/60 transition-all duration-300 shadow-lg shadow-green-900/30">
                  <TrendingUp className="h-5 w-5 text-green-400 animate-bounce" />
                  <span className="text-lg font-bold text-green-400">+12.5%</span>
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

          {/* Right Side - Enhanced Authentication Form */}
          <div className="max-w-md mx-auto w-full">
            <div className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/60 shadow-2xl shadow-purple-900/20 hover:shadow-purple-900/30 transition-all duration-500 transform hover:-translate-y-1">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-purple-600/10 rounded-2xl opacity-50 blur-xl -z-10"></div>
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
                  onClick={() => setShowGoogleModal(true)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 disabled:opacity-50 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLogin ? 'Sign in with Google' : 'Continue with Google'}
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
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-400 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-1 shadow-2xl shadow-purple-900/50 hover:shadow-purple-900/70 border border-purple-500/50 hover:border-purple-400/70"
                >
                  {isLoading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-slate-400 text-sm">
                  {isLogin ? (
                    <>
                      Don&apos;t have an account?{" "}
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

        {/* Google OAuth Modal */}
        <GoogleOAuthModal
          isOpen={showGoogleModal}
          onClose={() => setShowGoogleModal(false)}
          context={isLogin ? 'login' : 'signup'}
          onSuccess={(token, user) => {
            // Check if user has completed onboarding
            const hasCompletedOnboarding = user.hasCompletedOnboarding || localStorage.getItem('hasCompletedOnboarding') === 'true';
            
            if (hasCompletedOnboarding) {
              router.push('/dashboard');
            } else {
              router.push('/onboarding');
            }
          }}
        />
      </div>
    </div>
  );
}