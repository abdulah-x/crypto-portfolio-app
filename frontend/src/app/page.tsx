import { Shield, TrendingUp, Lock, BarChart3, Zap, Bitcoin, Wallet, Eye, Github, DollarSign, ArrowRight, Activity, PieChart, LineChart, Globe } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white relative overflow-hidden">
      {/* Unified Background with Crypto Elements */}
      <div className="absolute inset-0">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        
        {/* Floating Crypto Icons */}
        <div className="absolute top-20 left-20 opacity-10">
          <Bitcoin className="h-16 w-16 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute top-40 right-32 opacity-10">
          <TrendingUp className="h-12 w-12 text-green-400 animate-bounce" />
        </div>
        <div className="absolute bottom-40 left-32 opacity-10">
          <BarChart3 className="h-14 w-14 text-blue-400 animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Wallet className="h-12 w-12 text-purple-400 animate-bounce" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Full-Screen Responsive Layout */}
      <div className="relative z-10 min-h-screen w-full flex flex-col xl:flex-row">
        
        {/* Left Side - Enhanced Signup Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 xl:py-0 bg-gradient-to-br from-slate-800/30 to-transparent backdrop-blur-sm w-full xl:w-1/2">
          <div className="max-w-lg mx-auto w-full">
            {/* Enhanced Header with Modern Typography */}
            <div className="text-center mb-8 sm:mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-100 to-cyan-100 bg-clip-text text-transparent leading-tight tracking-tight">
                Get Started Now
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-md mx-auto font-medium">
                Welcome to <span className="text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-semibold">VaultX</span>. 
                Create your account to start your crypto portfolio journey
              </p>
            </div>

            {/* Enhanced Social Login Buttons */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <button className="w-full flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700/70 rounded-xl sm:rounded-2xl transition-all duration-300 border border-slate-600/50 hover:border-slate-500 backdrop-blur-sm group transform hover:scale-[1.02] active:scale-[0.98]">
                <Github className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300 group-hover:text-white transition-colors" />
                <span className="font-semibold text-sm sm:text-base text-slate-200 group-hover:text-white transition-colors">Sign up with GitHub</span>
              </button>
              <button className="w-full flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 rounded-xl sm:rounded-2xl transition-all duration-300 border border-yellow-500/30 hover:border-yellow-400/50 backdrop-blur-sm group transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-500/10">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                <span className="font-semibold text-sm sm:text-base text-yellow-200 group-hover:text-yellow-100 transition-colors">Sign up with Binance</span>
              </button>
            </div>

            {/* Elegant Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
              </div>
              <div className="relative flex justify-center text-sm sm:text-base">
                <span className="px-4 sm:px-6 py-1 bg-gradient-to-r from-slate-800/90 to-slate-800/90 text-slate-300 rounded-full font-medium backdrop-blur-sm border border-slate-700/50">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Enhanced Form */}
            <form className="space-y-5 sm:space-y-6">
              <div className="group">
                <label className="block text-sm sm:text-base font-semibold text-slate-200 mb-3 group-focus-within:text-purple-300 transition-colors tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="trader@vaultx.com"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 outline-none transition-all duration-300 backdrop-blur-sm text-white text-base sm:text-lg placeholder-slate-400 font-medium hover:border-slate-500/70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
              <div className="group">
                <label className="block text-sm sm:text-base font-semibold text-slate-200 mb-3 group-focus-within:text-purple-300 transition-colors tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Create secure password"
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 outline-none transition-all duration-300 backdrop-blur-sm text-white text-base sm:text-lg placeholder-slate-400 font-medium hover:border-slate-500/70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            </form>

            {/* Enhanced Terms Agreement */}
            <div className="mt-6 sm:mt-8">
              <label className="flex items-start gap-3 sm:gap-4 text-sm sm:text-base text-slate-300 cursor-pointer hover:text-slate-200 transition-colors font-medium">
                <input type="checkbox" className="mt-1 w-4 h-4 sm:w-5 sm:h-5 text-purple-600 bg-slate-800/50 border-slate-500 rounded focus:ring-purple-500/50 focus:ring-2" />
                <span className="leading-relaxed">
                  I agree to VaultX{" "}
                  <span className="text-purple-400 hover:text-purple-300 transition-colors font-semibold underline decoration-purple-400/30">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-purple-400 hover:text-purple-300 transition-colors font-semibold underline decoration-purple-400/30">
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>

            {/* Enhanced Sign Up Button */}
            <Link href="/signup" className="w-full mt-6 sm:mt-8 px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:from-purple-500 hover:to-cyan-400 relative overflow-hidden group tracking-wide block">
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                Create Account
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1 duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Enhanced Sign In Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <span className="text-slate-300 text-sm sm:text-base font-medium">
                Already trading with us?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline decoration-purple-400/50">
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Platform Showcase */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 xl:py-0 relative w-full xl:w-1/2">
          {/* Enhanced Background Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-purple-600/10 via-transparent to-transparent xl:bg-gradient-to-l xl:from-purple-600/15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/5 via-transparent to-transparent"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto xl:mx-0">
            {/* Enhanced VaultX Branding */}
            <div className="flex items-center space-x-4 sm:space-x-6 mb-8 sm:mb-12">
              <div className="p-3 sm:p-4 lg:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-2xl shadow-purple-500/20">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  VaultX
                </span>
                <p className="text-slate-400 text-sm sm:text-base lg:text-lg font-semibold tracking-wide mt-1">
                  Professional Crypto Portfolio
                </p>
              </div>
            </div>

            {/* Enhanced Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-6 sm:mb-8 lg:mb-10 leading-tight tracking-tight">
              Intelligent Platform For{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent block sm:inline">
                crypto traders
              </span>
            </h2>
            
            {/* Enhanced Platform Benefits */}
            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-12 lg:mb-16">
              <div className="flex items-start gap-4 sm:gap-6 group">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 group-hover:border-green-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20">
                  <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-400 group-hover:text-green-300 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide group-hover:text-green-100 transition-colors">
                    Real-Time Portfolio Tracking
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                    Monitor your crypto investments across multiple exchanges with live market data and instant updates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 sm:gap-6 group">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  <BarChart3 className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide group-hover:text-blue-100 transition-colors">
                    Advanced Analytics
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                    Deep insights into P&L, risk metrics, and performance analytics to optimize your trading strategy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 sm:gap-6 group">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                  <Lock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-wide group-hover:text-purple-100 transition-colors">
                    Bank-Grade Security
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                    Enterprise-level security with encrypted API connections and read-only access to your accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Live Market Data Visualization */}
            <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-12 hover:border-slate-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-wide group-hover:text-slate-100 transition-colors">
                  Live Market Overview
                </h4>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-semibold text-green-400 tracking-wide">LIVE</span>
                </div>
              </div>
              
              {/* Enhanced Crypto Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl sm:rounded-2xl transition-all duration-300 border border-slate-700/30 hover:border-yellow-500/30 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Bitcoin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-slate-400 tracking-wider">BTC</div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-white font-mono">$67,832</div>
                    <div className="text-xs sm:text-sm font-bold text-green-400">+2.5%</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl sm:rounded-2xl transition-all duration-300 border border-slate-700/30 hover:border-blue-500/30 group">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-slate-400 tracking-wider">ETH</div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-white font-mono">$3,421</div>
                    <div className="text-xs sm:text-sm font-bold text-green-400">+1.8%</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Portfolio Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl sm:rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
                <div className="mb-3 sm:mb-0">
                  <div className="text-sm sm:text-base font-semibold text-slate-300 tracking-wide">Total Portfolio Value</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-mono group-hover:text-purple-100 transition-colors">
                    $247,832.09
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-2 bg-green-500/20 hover:bg-green-500/30 rounded-full border border-green-400/30 hover:border-green-400/50 transition-all duration-300">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                  <span className="text-sm sm:text-base font-bold text-green-400">+12.5%</span>
                </div>
              </div>

              {/* Enhanced Floating Analytics Icons */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 p-2 sm:p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 backdrop-blur-sm rounded-xl border border-cyan-400/30 hover:scale-110 transition-transform duration-300">
                <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 p-2 sm:p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-xl border border-purple-400/30 hover:scale-110 transition-transform duration-300">
                <LineChart className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              </div>
            </div>

            {/* Enhanced Platform Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  500+
                </div>
                <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-400 tracking-wider mt-1">
                  Crypto Assets
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-400 tracking-wider mt-1">
                  Live Monitoring
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm lg:text-base font-semibold text-slate-400 tracking-wider mt-1">
                  Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
