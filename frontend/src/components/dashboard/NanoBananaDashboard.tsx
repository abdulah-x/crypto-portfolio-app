"use client";

import { useState } from "react";
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
  X
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

import MetricCard from "@/components/ui/MetricCard";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import PerformanceChart from "@/components/dashboard/PerformanceChart";

import {
  mockPortfolioMetrics,
  mockAllocationData,
  mockHoldingsData,
  mockPerformanceData,
  sparklineData
} from "@/data/mockData";

export default function NanoBananaDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();

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
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
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
              <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt="Profile" 
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xs">{getInitials()}</span>
                  )}
                </div>
                <span className="text-white font-medium text-sm hidden md:block">{getDisplayName()}</span>
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
                { name: "Active Orders", icon: Target },
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
              value={mockPortfolioMetrics.totalCapital}
              change={mockPortfolioMetrics.portfolioChange}
              sparklineData={sparklineData}
              icon={<DollarSign className="w-5 h-5 text-cyan-500" />}
            />
            <MetricCard
              title="Portfolio Value Change"
              value={mockPortfolioMetrics.portfolioChange.value}
              change={{
                value: mockPortfolioMetrics.portfolioChange.value,
                percentage: mockPortfolioMetrics.portfolioChange.percentage,
                isPositive: mockPortfolioMetrics.portfolioChange.isPositive
              }}
              subtitle="24h Change"
              icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            />
            <MetricCard
              title="Unrealized P&L"
              value={mockPortfolioMetrics.unrealizedPnL.value}
              change={{
                value: mockPortfolioMetrics.unrealizedPnL.value,
                percentage: mockPortfolioMetrics.unrealizedPnL.percentage,
                isPositive: mockPortfolioMetrics.unrealizedPnL.isPositive
              }}
              subtitle="Open Positions"
              icon={<Target className="w-5 h-5 text-amber-500" />}
            />
            <MetricCard
              title="Total Rate"
              value={mockPortfolioMetrics.totalRate.value}
              change={{
                value: mockPortfolioMetrics.totalRate.value,
                percentage: mockPortfolioMetrics.totalRate.percentage,
                isPositive: mockPortfolioMetrics.totalRate.isPositive
              }}
              subtitle="Success Rate"
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

          {/* Bottom Row - Active Orders and Additional Components */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Active Orders Placeholder */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">ACTIVE ORDERS (4)</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No active orders</p>
                <p className="text-sm text-gray-500 mt-2">Your pending orders will appear here</p>
              </div>
            </div>

            {/* Risk & Exposure Placeholder */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">PERFORMANCE & INSIGHTS</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Best Performer</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-medium">SOL/USDT (+5.2%)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Worst Performer</span>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 font-medium">ETH/USDT (-1.8%)</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-4">
                    Your portfolio volatility is reverse-similar to Consider rebalancing for optimal risk management.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Transfer
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Trade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Watchlist */}
        <aside className="hidden xl:block w-80 bg-gray-900/50 backdrop-blur-xl border-l border-gray-800 p-6">
          <div className="space-y-6">
            {/* Watchlist */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">WATCHLIST</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { symbol: "XRP", price: "$0.52", change: "+2.1%", positive: true },
                  { symbol: "AVAX", price: "$36.24", change: "-1.5%", positive: false },
                  { symbol: "LINK", price: "$14.83", change: "+0.8%", positive: true },
                  { symbol: "UNI", price: "$7.22", change: "-0.3%", positive: false }
                ].map((asset) => (
                  <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{asset.symbol[0]}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{asset.symbol}</div>
                        <div className="text-xs text-gray-400">{asset.price}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${asset.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {asset.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Notifications */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">ALERTS & NOTIFICATIONS</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-400">Price Alert</span>
                  </div>
                  <p className="text-xs text-gray-300">BTC reached $67,800</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-400">Portfolio Alert</span>
                  </div>
                  <p className="text-xs text-gray-300">Portfolio up 12% this week</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}