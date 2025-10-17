"use client";

import { useState } from "react";
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Home,
  PieChart,
  TrendingUp,
  Layers,
  FileText,
  CreditCard,
  Eye,
  Palette,
  HelpCircle,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  LogOut,
  Loader2
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { usePortfolioSummary, useHoldings, useMarketData } from "@/lib/react-query";

// Mock data for the dashboard
const mockAssets = [
  {
    id: 1,
    name: "Stellar",
    symbol: "XLM",
    price: 10.31,
    change24h: 11.94,
    volume: "507.2M",
    chartData: [20, 35, 28, 45, 38, 52, 48],
    icon: "🌟"
  },
  {
    id: 2,
    name: "Hedera",
    symbol: "HBAR",
    price: 523.47,
    change24h: -6.18,
    volume: "37.2M",
    chartData: [45, 42, 38, 35, 40, 38, 35],
    icon: "⚡"
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA",
    price: 0.40,
    change24h: 2.15,
    volume: "14.6M",
    chartData: [15, 18, 22, 20, 25, 23, 28],
    icon: "🔷"
  }
];

const mockPortfolioTokens = [
  { symbol: "XRP", amount: "7,500", value: "$17,900.65" },
  { symbol: "USDT", amount: "4,377", value: "$4,377.00" },
  { symbol: "BNB", amount: "2,200", value: "$2,200.00" }
];

const chartData = [
  { day: "Sun", value: 65 },
  { day: "Mon", value: 45 },
  { day: "Tue", value: 80 },
  { day: "Wed", value: 70 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 55 },
  { day: "Sat", value: 75 }
];

// Helper function to get asset icons
const getAssetIcon = (symbol: string): string => {
  const iconMap: Record<string, string> = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'XLM': '🌟',
    'HBAR': '⚡',
    'ADA': '🔷',
    'XRP': '🌊',
    'BNB': '🔶',
    'USDT': '💵',
    'XMR': '🔒',
  };
  return iconMap[symbol.toUpperCase()] || '🪙';
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("My assets");
  const [activeFilter, setActiveFilter] = useState("All market");

  // Fetch real data with React Query
  const { data: portfolioSummary, isLoading: portfolioLoading, error: portfolioError } = usePortfolioSummary();
  const { data: holdings, isLoading: holdingsLoading } = useHoldings();
  const { data: marketData, isLoading: marketLoading } = useMarketData();

  // Use real data if available, otherwise fall back to mock data
  const assets = holdings && holdings.length > 0 ? holdings.map(holding => ({
    id: holding.id,
    name: holding.symbol,
    symbol: holding.symbol,
    price: holding.currentPrice || 0,
    change24h: Math.random() * 20 - 10, // TODO: Get real 24h change from market data
    volume: `${(Math.random() * 1000).toFixed(1)}M`,
    chartData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10),
    icon: getAssetIcon(holding.symbol)
  })) : mockAssets;

  // Mini Sparkline Component
  const MiniChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="w-20 h-8 flex items-end justify-between">
        {data.map((value, index) => {
          const height = range > 0 ? ((value - min) / range) * 100 : 50;
          return (
            <div
              key={index}
              className="w-1 bg-gradient-to-t from-blue-500/50 to-blue-400 rounded-sm"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
    );
  };

  // Bar Chart Component
  const BarChart = ({ data }: { data: typeof chartData }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <div className="flex items-end justify-between h-32 px-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className="w-6 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-gray-400">{item.day}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Development Banner */}
      {(portfolioError || holdingsLoading === false && (!holdings || holdings.length === 0)) && (
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-b border-yellow-500/30 p-2 z-50">
          <div className="text-center text-sm">
            <span className="text-yellow-400 font-medium">Development Mode:</span>
            <span className="text-gray-300 ml-2">
              {portfolioError ? "Backend unavailable - showing mock data" : "No real portfolio data - showing sample data"}
            </span>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {user?.firstName || "MansonObad"}
                </span>
                <span className="px-2 py-0.5 bg-blue-500 text-xs rounded-full">PRO</span>
              </div>
              <p className="text-xs text-gray-400">Premium User</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          {/* MENU Section */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">MENU</h3>
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <PieChart className="w-4 h-4" />
                <span className="text-sm">Portfolio</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Market</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Layers className="w-4 h-4" />
                <span className="text-sm">Staking</span>
              </a>
            </nav>
          </div>

          {/* MORTGAGE Section */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider">MORTGAGE</h3>
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                <span className="text-sm">All files</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">My loans</span>
              </a>
            </nav>
          </div>

          {/* GENERAL Section */}
          <div className="mb-8">
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Palette className="w-4 h-4" />
                <span className="text-sm">Appearance</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Support</span>
              </a>
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* AI Friend Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="px-2 py-0.5 bg-purple-500 text-xs rounded-full">PRO</span>
            </div>
            <p className="text-sm font-medium mb-1">Your AI Friend</p>
            <p className="text-xs text-gray-400">in Trade</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`bg-[#1A1A1A] border-b border-gray-800 p-6 ${
          (portfolioError || holdingsLoading === false && (!holdings || holdings.length === 0)) ? 'mt-10' : ''
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Trading Portfolio</h1>
              <p className="text-gray-400">Welcome to Portfolio !</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors">
                Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-6 h-full">
            {/* Central Content */}
            <div className="flex-1 space-y-6">
              {/* Customization Card */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Customise your Portfolio</h3>
                    <p className="text-sm text-gray-400">Create your own portfolio with range of tools, expenses, and accomplishments.</p>
                  </div>
                  <button className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Getting started
                  </button>
                </div>
              </div>

              {/* Assets Table */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl">
                {/* Assets Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Assets</h2>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="flex gap-6">
                    {["My assets", "Categories", "Hot", "New listed"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab
                            ? "text-white border-blue-500"
                            : "text-gray-400 border-transparent hover:text-gray-300"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assets Table Content */}
                <div className="p-6">
                  {holdingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-400">Loading assets...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assets.map((asset) => (
                        <div key={asset.id} className="flex items-center gap-4 p-4 hover:bg-gray-800/50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
                              {asset.icon}
                            </div>
                            <div>
                              <p className="font-medium">{asset.name}</p>
                              <p className="text-sm text-gray-400">{asset.symbol}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">${asset.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              asset.change24h > 0 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {asset.change24h > 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                            </span>
                          </div>
                          
                          <div className="text-right text-gray-400">
                            {asset.volume}
                          </div>
                          
                          <div className="flex justify-center">
                            <MiniChart data={asset.chartData} />
                          </div>
                          
                          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                            Trade
                          </button>
                        </div>
                      ))}
                      
                      {assets.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p>No assets found. Start by adding some trades to your portfolio.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-6">
              {/* ETH/USDT Chart Card */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">ETH/USDT</h3>
                    <p className="text-xs text-gray-400">Last 7 Days (UTC+1)</p>
                  </div>
                  <button className="p-1 hover:bg-gray-800 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <BarChart data={chartData} />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {portfolioLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        {portfolioSummary?.dayChangePercentage?.toFixed(1) || "8.9"}
                        <span className="text-sm">%</span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">vs last Week</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      (portfolioSummary?.dayChangePercentage || 12) > 0 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {(portfolioSummary?.dayChangePercentage || 12) > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(portfolioSummary?.dayChangePercentage || 12).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Tokens */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Type of tokens in my portfolio</h3>
                
                {/* Filters */}
                <div className="flex gap-2 mb-6">
                  {["All market", "Crypto", "USDT", "BNB"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        activeFilter === filter
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                
                {/* Token List */}
                <div className="space-y-4">
                  {mockPortfolioTokens.map((token, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{token.amount} {token.symbol}</p>
                        <p className="text-sm text-gray-400">{token.value}</p>
                      </div>
                      <button className="px-3 py-1 border border-gray-700 hover:border-gray-600 rounded text-xs transition-colors">
                        Withdraw
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monero Asset Detail */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                      M
                    </div>
                    <div>
                      <h3 className="font-semibold">Monero Xmr</h3>
                      <p className="text-xs text-gray-400">Cryptocurrency</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-800 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="font-medium">$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="font-medium">24h</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-sm transition-colors">
                    Transfer
                  </button>
                  <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors">
                    Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}