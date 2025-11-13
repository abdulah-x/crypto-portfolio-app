"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  DollarSign, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Target,
  Activity,
  BarChart3,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

import MetricCard from "@/components/ui/MetricCard";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import DynamicInsights from "@/components/dashboard/DynamicInsights";

import {
  generateUserMockData,
  mockAllocationData,
  mockHoldingsData,
  mockPerformanceData,
  sparklineData
} from "@/data/mockData";

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Generate user-specific mock data
  const userMockData = user ? generateUserMockData(user.id, user.email) : null;
  const mockPortfolioMetrics = userMockData?.mockPortfolioMetrics || {
    totalCapital: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    unrealizedPnL: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    realizedPnL: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    successRate: { percentage: "0%", profitFromWins: "0", totalTrades: 0, winningTrades: 0 }
  };

  const totalPortfolioValue = mockHoldingsData.reduce((sum, holding) => sum + holding.marketValue, 0);

  // Get user display info with fallbacks
  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    return 'Portfolio Owner';
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return 'PO';
  };

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <span className="text-white font-bold text-xl">PO</span>
          </div>
          <div className="text-white text-lg font-medium">Loading Portfolio...</div>
          <div className="text-gray-400 text-sm mt-2">Please wait while we prepare your dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* User Profile Section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  {user?.avatar && !imageError ? (
                    <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg">{getInitials()}</span>
                  )}
                </div>
                
                {/* User Info */}
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">{getDisplayName()}</h1>
                  <p className="text-xs text-gray-400">Portfolio Dashboard</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-32"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                    {user?.avatar && !imageError ? (
                      <Image 
                        src={user.avatar} 
                        alt="Profile" 
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-lg object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="text-white font-bold text-xs">{getInitials()}</span>
                    )}
                  </div>
                  <span className="text-white font-medium text-sm hidden md:block">{getDisplayName()}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-white font-medium text-sm">{getDisplayName()}</p>
                      <p className="text-gray-400 text-xs">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          // Add settings functionality later
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>
                      <button
                        onClick={async () => {
                          setUserMenuOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:relative z-30 w-64 h-screen bg-gray-900/90 backdrop-blur-xl border-r border-gray-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            <nav className="space-y-2">
              {[
                { name: "Dashboard", icon: BarChart3, active: true },
                { name: "Portfolio", icon: PieChartIcon },
                { name: "Markets Overview", icon: TrendingUp },
                { name: "Trade History", icon: Activity },
                { name: "Analytics", icon: BarChart3 },
                { name: "Risk & Exposure", icon: PieChartIcon },
                { name: "Settings", icon: Settings }
              ].map((item) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    item.active
                      ? "bg-cyan-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6 relative z-10">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Capital"
              value={mockPortfolioMetrics.totalCapital.value}
              change={mockPortfolioMetrics.totalCapital.change24h}
              sparklineData={sparklineData}
              icon={<DollarSign className="w-5 h-5 text-cyan-500" />}
            />
            <MetricCard
              title="Unrealized P&L"
              value={mockPortfolioMetrics.unrealizedPnL.value}
              change={mockPortfolioMetrics.unrealizedPnL.change24h}
              subtitle="Open Positions"
              sparklineData={sparklineData.map(val => val * 0.8)} // Different trend
              icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
            />
            <MetricCard
              title="Realized P&L"
              value={mockPortfolioMetrics.realizedPnL.value}
              change={mockPortfolioMetrics.realizedPnL.change24h}
              subtitle="Closed Positions"
              sparklineData={sparklineData.map(val => val * 1.2)} // Different trend
              icon={<Target className="w-5 h-5 text-emerald-500" />}
            />
            <MetricCard
              title="Success Rate"
              value={mockPortfolioMetrics.successRate.percentage}
              change={{
                value: `${mockPortfolioMetrics.successRate.winningTrades}/${mockPortfolioMetrics.successRate.totalTrades} trades`,
                percentage: `$${parseInt(mockPortfolioMetrics.successRate.profitFromWins).toLocaleString()} profit`,
                isPositive: true
              }}
              subtitle="Winning Trades"
              icon={<PieChartIcon className="w-5 h-5 text-blue-500" />}
            />
          </div>

          {/* Portfolio Overview and Performance Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <PortfolioOverview
              totalBalance="$49,500.65"
              allocationData={mockAllocationData}
              dayChange={{
                value: "+$2,845.23",
                percentage: "+6.1%",
                isPositive: true
              }}
              weekChange={{
                value: "+$8,922.15",
                percentage: "+21.9%",
                isPositive: true
              }}
            />

            <PerformanceChart
              data={mockPerformanceData}
              timeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </div>

          {/* Holdings Table */}
          <HoldingsTable 
            holdings={mockHoldingsData}
            totalValue={totalPortfolioValue}
          />

          {/* Bottom Row - Dynamic Insights */}
          <div className="grid grid-cols-1 gap-6">
            {/* Dynamic Insights */}
            <DynamicInsights 
              holdings={mockHoldingsData}
              metrics={mockPortfolioMetrics}
              totalValue={totalPortfolioValue}
            />
          </div>
        </main>

        {/* Right Sidebar - Watchlist */}
        <aside className="hidden xl:block w-80 bg-gray-900/50 backdrop-blur-xl border-l border-gray-800 p-6">
          <div className="space-y-6">
            {/* Watchlist */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">WATCHLIST</h3>
                <button className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 p-2 rounded-lg">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { symbol: "XRP", name: "Ripple", price: "$0.52", change: "+2.1%", positive: true, color: "from-purple-500 to-pink-500" },
                  { symbol: "AVAX", name: "Avalanche", price: "$36.24", change: "-1.5%", positive: false, color: "from-red-500 to-orange-500" },
                  { symbol: "LINK", name: "Chainlink", price: "$14.83", change: "+0.8%", positive: true, color: "from-blue-500 to-cyan-500" },
                  { symbol: "UNI", name: "Uniswap", price: "$7.22", change: "-0.3%", positive: false, color: "from-pink-500 to-rose-500" }
                ].map((asset) => (
                  <div 
                    key={asset.symbol} 
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 cursor-pointer transition-all duration-200 border border-transparent hover:border-cyan-500/30 group"
                    onClick={() => {/* TODO: Navigate to asset detail */}}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 bg-gradient-to-br ${asset.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">{asset.symbol}</div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{asset.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{asset.price}</div>
                      <div className={`text-xs font-medium ${asset.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {asset.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">ALERTS & NOTIFICATIONS</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/15 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-sm font-medium text-emerald-400">Price Alert</span>
                  </div>
                  <p className="text-xs text-gray-300 group-hover:text-white transition-colors">BTC reached target of $67,800</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/15 hover:border-blue-500/40 transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-sm font-medium text-blue-400">Portfolio Alert</span>
                  </div>
                  <p className="text-xs text-gray-300 group-hover:text-white transition-colors">Portfolio gained 12% this week</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}