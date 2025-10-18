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
  Loader2,
  ChevronDown,
  X,
  Wallet
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { usePortfolioSummary, useHoldings, useMarketData } from "@/lib/react-query";

// Mock data for user holdings
const mockUserHoldings = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    quantity: 0.15,
    avgBuyPrice: 45000,
    currentPrice: 67832,
    value: 10174.80,
    change24h: 2.5,
    allocation: 81.1,
    chartData: [42000, 48000, 52000, 58000, 64000, 66000, 67832],
    icon: "₿"
  },
  {
    id: 2,
    name: "Ethereum", 
    symbol: "ETH",
    quantity: 0.8,
    avgBuyPrice: 2800,
    currentPrice: 3421,
    value: 2736.80,
    change24h: 1.8,
    allocation: 21.8,
    chartData: [2600, 2800, 3000, 3200, 3300, 3380, 3421],
    icon: "Ξ"
  },
  {
    id: 3,
    name: "Cardano",
    symbol: "ADA", 
    quantity: 850,
    avgBuyPrice: 0.35,
    currentPrice: 0.40,
    value: 340.00,
    change24h: 2.15,
    allocation: 2.7,
    chartData: [0.32, 0.35, 0.37, 0.38, 0.39, 0.395, 0.40],
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
  const [activeTab, setActiveTab] = useState("My Holdings");
  const [activeFilter, setActiveFilter] = useState("All market");
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
  })) : mockUserHoldings;

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
    <div className="min-h-screen bg-[#0A0A0A] text-white flex relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-500/3 to-transparent"></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-20 right-1/4 opacity-20">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-full blur-xl animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/5 opacity-15">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl rotate-45 blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="absolute top-1/2 right-1/6 opacity-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-full blur-md animate-bounce" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Animated Light Rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent opacity-30"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-20" style={{animationDelay: '1s'}}></div>
      </div>

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
      <div className="w-64 bg-[#1A1A1A] border-r border-gray-800 flex flex-col relative z-10">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 -m-2 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">
                  {user?.firstName || "Demo"}
                </span>
                <span className="px-2 py-0.5 bg-blue-500 text-xs font-bold rounded-full">PRO</span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
              <p className="text-sm text-gray-300 font-medium">Premium User</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          {/* MENU Section */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-wider">MENU</h3>
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">Dashboard</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <PieChart className="w-4 h-4" />
                <span className="text-sm font-bold">Portfolio</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">Market</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Layers className="w-4 h-4" />
                <span className="text-sm font-semibold">Staking</span>
              </a>
            </nav>
          </div>

          {/* GENERAL Section */}
          <div className="mb-8">
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-semibold">Settings</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <Palette className="w-4 h-4" />
                <span className="text-sm font-semibold">Appearance</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Support</span>
              </a>
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* AI Friend Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span className="px-2 py-0.5 bg-purple-500 text-xs font-bold rounded-full">PRO</span>
            </div>
            <p className="text-sm font-bold mb-1 text-white">Your AI Friend</p>
            <p className="text-xs text-gray-400 font-medium">in Trade</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <div className={`bg-[#1A1A1A] border-b border-gray-800 p-6 ${
          (portfolioError || holdingsLoading === false && (!holdings || holdings.length === 0)) ? 'mt-10' : ''
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Trading Portfolio</h1>
              <p className="text-gray-400 font-medium">Welcome to Portfolio !</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Interactive Search */}
              <div className="flex items-center">
                {searchExpanded ? (
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 min-w-64">
                    <Search className="w-4 h-4 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search assets, transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-gray-400 outline-none flex-1 text-sm font-medium"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        setSearchExpanded(false);
                        setSearchQuery("");
                      }}
                      className="ml-2 p-1 hover:bg-gray-700 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setSearchExpanded(true)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
              
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              
              {/* Enhanced Deposit Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold transition-colors">
                <Plus className="w-4 h-4" />
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
                    <h3 className="font-bold text-lg text-white mb-1">Customise your Portfolio</h3>
                    <p className="text-sm text-gray-400 font-medium">Create your own portfolio with range of tools, expenses, and accomplishments.</p>
                  </div>
                  <button className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors">
                    Getting started
                  </button>
                </div>
              </div>

              {/* Assets Table */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl">
                {/* Portfolio Holdings Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-white">My Holdings</h2>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Portfolio Summary Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">Total Value</div>
                      <div className="text-lg font-black text-white font-mono">$13,251.60</div>
                      <div className="text-xs text-green-400 font-bold">+5.67%</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">Today's P&L</div>
                      <div className="text-lg font-black text-green-400 font-mono">+$712.45</div>
                      <div className="text-xs text-green-400 font-bold">+5.68%</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3">
                      <div className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-wide">Holdings</div>
                      <div className="text-lg font-black text-white font-mono">3 Assets</div>
                      <div className="text-xs text-blue-400 font-bold">Diversified</div>
                    </div>
                  </div>
                  
                  {/* View Toggle Tabs */}
                  <div className="flex gap-6">
                    {["My Holdings", "Performance", "Transactions"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-bold border-b-2 transition-colors ${
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

                {/* Holdings Table Content */}
                <div className="p-6">
                  {holdingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="ml-2 text-gray-400 font-medium">Loading your portfolio...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-800">
                        <div className="col-span-3">Asset</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Holdings Value</div>
                        <div className="col-span-2 text-right">24h Change</div>
                        <div className="col-span-2 text-center">Chart</div>
                        <div className="col-span-1 text-center">Actions</div>
                      </div>
                      
                      {/* Holdings List */}
                      {assets.map((asset: any) => (
                        <div 
                          key={asset.id} 
                          className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg transition-colors cursor-pointer ${
                            selectedAsset?.id === asset.id 
                              ? 'bg-blue-500/10 border border-blue-500/30' 
                              : 'hover:bg-gray-800/50'
                          }`}
                          onClick={() => setSelectedAsset(asset)}
                        >
                          <div className="col-span-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                              {asset.icon}
                            </div>
                            <div>
                              <p className="font-bold text-white">{asset.name}</p>
                              <p className="text-sm text-gray-400 font-medium">{asset.symbol}</p>
                              {asset.quantity && (
                                <p className="text-xs text-gray-500 font-medium">{asset.quantity} {asset.symbol}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="col-span-2 text-right">
                            <p className="font-bold text-white font-mono">${(asset.currentPrice || asset.price || 0).toFixed(2)}</p>
                            {asset.avgBuyPrice && (
                              <p className="text-xs text-gray-400 font-medium">Avg: ${asset.avgBuyPrice.toFixed(2)}</p>
                            )}
                          </div>
                          
                          <div className="col-span-2 text-right">
                            <p className="font-bold text-white font-mono">${(asset.value || (asset.quantity * asset.currentPrice) || 0).toFixed(2)}</p>
                            {asset.allocation && (
                              <p className="text-xs text-gray-400 font-medium">{asset.allocation}% of portfolio</p>
                            )}
                          </div>
                          
                          <div className="col-span-2 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              asset.change24h > 0 
                                ? "bg-green-500/20 text-green-400" 
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {asset.change24h > 0 ? "+" : ""}{asset.change24h.toFixed(2)}%
                            </span>
                          </div>
                          
                          <div className="col-span-2 flex justify-center">
                            <MiniChart data={asset.chartData} />
                          </div>
                          
                          <div className="col-span-1 flex gap-1">
                            <button className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-semibold transition-colors">
                              Buy
                            </button>
                            <button className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs font-semibold transition-colors">
                              Sell
                            </button>
                          </div>
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

            {/* Right Sidebar - Contextual */}
            <div className="w-80 space-y-6">
              {/* Chart Card - Dynamic based on selected asset */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white">
                      {selectedAsset ? `${selectedAsset.name}/USDT` : 'ETH/USDT'}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">Last 7 Days (UTC+1)</p>
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
                        {selectedAsset ? selectedAsset.change : (portfolioSummary?.dayChangePercentage?.toFixed(1) || "8.9")}
                        <span className="text-sm">%</span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">vs last Week</p>
                    <p className={`text-sm flex items-center gap-1 ${
                      (selectedAsset ? parseFloat(selectedAsset.change) : (portfolioSummary?.dayChangePercentage || 12)) > 0 
                        ? "text-green-400" 
                        : "text-red-400"
                    }`}>
                      {(selectedAsset ? parseFloat(selectedAsset.change) : (portfolioSummary?.dayChangePercentage || 12)) > 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {Math.abs(selectedAsset ? parseFloat(selectedAsset.change) : (portfolioSummary?.dayChangePercentage || 12)).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio Breakdown or Asset Details */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-4">
                  {selectedAsset ? `${selectedAsset.name} Details` : 'Portfolio Breakdown'}
                </h3>
                
                {!selectedAsset ? (
                  <>
                    {/* Filters - Only show when viewing portfolio breakdown */}
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
                    
                    {/* Asset Detail - Portfolio view */}
                    <div className="space-y-4">
                      {mockPortfolioTokens.map((token, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{token.amount} {token.symbol}</p>
                            <p className="text-sm text-gray-400 font-medium">{token.value}</p>
                          </div>
                          <button className="px-3 py-1 border border-gray-700 hover:border-gray-600 rounded text-xs font-bold transition-colors">
                            Withdraw
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Selected Asset Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Holdings</span>
                        <span className="font-bold text-white">{selectedAsset.quantity} {selectedAsset.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Current Value</span>
                        <span className="font-bold text-white">{selectedAsset.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Allocation</span>
                        <span className="font-bold text-white">{selectedAsset.allocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">24h Change</span>
                        <span className={`font-bold ${parseFloat(selectedAsset.change) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedAsset.change}%
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedAsset(null)}
                      className="w-full py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-bold transition-colors mb-4"
                    >
                      ← Back to Portfolio
                    </button>
                  </>
                )}
              </div>

              {/* Asset Actions - Trade/Transfer */}
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAsset ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      {selectedAsset ? selectedAsset.symbol.charAt(0) : 'M'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {selectedAsset ? selectedAsset.name : 'Monero Xmr'}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">Cryptocurrency</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-800 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">Price</span>
                    <span className="font-bold text-white font-mono">
                      {selectedAsset ? '$' + (parseFloat(selectedAsset.value.replace('$', '').replace(',', '')) / selectedAsset.quantity).toFixed(2) : '$152'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-medium">24h Volume</span>
                    <span className="font-bold text-white font-mono">High</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 border border-gray-700 hover:border-gray-600 rounded-lg text-sm font-bold transition-colors">
                    Transfer
                  </button>
                  <button className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-bold transition-colors">
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