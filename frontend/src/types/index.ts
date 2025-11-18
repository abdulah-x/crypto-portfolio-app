// User Types (matches backend User model)
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

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  timezone?: string;
  preferred_currency?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Portfolio and Trading Types (matches backend models)
export interface Holding {
  id: number;
  userId: number;
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice?: number;
  totalValue?: number;
  lastUpdated: string;
  notes?: string;
}

export interface Trade {
  id: number;
  userId: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  executedAt: string;
  binanceOrderId?: string;
  fees?: number;
  feeAsset?: string;
  status: string;
  source: 'manual' | 'binance_api' | 'csv_import';
  notes?: string;
}

export interface Transaction {
  id: number;
  userId: number;
  type: 'deposit' | 'withdrawal' | 'trade' | 'fee' | 'staking_reward' | 'airdrop' | 'other';
  symbol: string;
  amount: number;
  price?: number;
  totalValue?: number;
  executedAt: string;
  description?: string;
  txHash?: string;
  source: 'manual' | 'binance_api' | 'csv_import';
  notes?: string;
}

// Portfolio Analytics Types
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  realizedPnl: number;
  totalPnl: number;
  totalPnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

export interface AssetPerformance {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  allocation: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// Market Data Types
export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdated: string;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export interface PortfolioHistory {
  timestamp: string;
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
}

// Settings Types
export interface UserSettings {
  timezone: string;
  preferredCurrency: string;
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  binanceApiKey?: string;
  binanceTestnet: boolean;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}