// Mock data for the crypto portfolio dashboard

// Function to generate user-specific mock data
export const generateUserMockData = (userId: string, userEmail: string) => {
  // Create consistent but user-specific data based on user ID hash
  const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const seed = hash % 100;
  
  // Base multiplier based on user (between 0.5 and 2.0)
  const multiplier = 0.5 + (seed / 100) * 1.5;
  
  return {
    userEmail,
    userId,
    generatedAt: new Date().toISOString(),
    ...getMockDataForMultiplier(multiplier)
  };
};

// Generate mock data with a multiplier for variation
export const getMockDataForMultiplier = (multiplier: number = 1) => ({
  mockPortfolioMetrics: {
    totalCapital: {
      value: `$${Math.round(1850000 * multiplier).toLocaleString()}`,
      change24h: {
        value: `$${Math.round(45000 * multiplier).toLocaleString()}`,
        percentage: "+2.5%",
        isPositive: true
      }
    },
    unrealizedPnL: {
      value: `$${Math.round(158200 * multiplier).toLocaleString()}`,
      change24h: {
        value: `-$${Math.round(8200 * multiplier).toLocaleString()}`,
        percentage: "-4.9%",
        isPositive: false
      }
    },
    realizedPnL: {
      value: `$${Math.round(324500 * multiplier).toLocaleString()}`,
      change24h: {
        value: `$${Math.round(12300 * multiplier).toLocaleString()}`,
        percentage: "+3.9%",
        isPositive: true
      }
    },
    successRate: {
      percentage: "78.5%",
      profitFromWins: Math.round(298400 * multiplier).toString(),
      totalTrades: Math.round(247 * multiplier),
      winningTrades: Math.round(194 * multiplier)
    },
    totalFees: {
      value: `$${Math.round(8420 * multiplier).toLocaleString()}`,
      change24h: {
        value: `$${Math.round(145 * multiplier).toLocaleString()}`,
        percentage: "+1.7%",
        isPositive: false // Higher fees are negative
      }
    }
  }
});

// Default mock data (fallback)
export const mockPortfolioMetrics = getMockDataForMultiplier(1).mockPortfolioMetrics;

export const mockAllocationData = [
  { asset: "BTC", value: 19800.26, percentage: 40.0, color: "#f7931a" },
  { asset: "ETH", value: 14850.20, percentage: 30.0, color: "#627eea" },
  { asset: "SOL", value: 4950.07, percentage: 10.0, color: "#00d4aa" },
  { asset: "ADA", value: 3960.05, percentage: 8.0, color: "#0033ad" },
  { asset: "DOT", value: 2970.04, percentage: 6.0, color: "#e6007a" },
  { asset: "Others", value: 2970.04, percentage: 6.0, color: "#8b5cf6" }
];

export const mockHoldingsData = [
  {
    id: "btc",
    asset: "Bitcoin",
    symbol: "BTC",
    qty: 12.5,
    avgBuyPrice: 45000,
    lastPrice: 67832,
    marketValue: 847900,
    realizedPnL: 125000,
    unrealizedPnL: 285400,
    allocation: 40.0,
    change24h: 2.5
  },
  {
    id: "eth",
    asset: "Ethereum", 
    symbol: "ETH",
    qty: 185.3,
    avgBuyPrice: 2800,
    lastPrice: 3421,
    marketValue: 634153,
    realizedPnL: 85000,
    unrealizedPnL: 115073,
    allocation: 30.0,
    change24h: -1.8
  },
  {
    id: "sol",
    asset: "Solana",
    symbol: "SOL", 
    qty: 1250,
    avgBuyPrice: 120,
    lastPrice: 148,
    marketValue: 185000,
    realizedPnL: 15000,
    unrealizedPnL: 35000,
    allocation: 10.0,
    change24h: 5.2
  },
  {
    id: "ada",
    asset: "Cardano",
    symbol: "ADA",
    qty: 50000,
    avgBuyPrice: 2.5,
    lastPrice: 2.96,
    marketValue: 148000,
    realizedPnL: 8000,
    unrealizedPnL: 23000,
    allocation: 8.0,
    change24h: -0.8
  },
  {
    id: "dot",
    asset: "Polkadot",
    symbol: "DOT",
    qty: 2500,
    avgBuyPrice: 35,
    lastPrice: 44.4,
    marketValue: 111000,
    realizedPnL: 12000,
    unrealizedPnL: 23500,
    allocation: 6.0,
    change24h: 3.1
  }
];

export const mockPerformanceData = [
  { date: "Jan", totalValue: 1200000, realizedPnL: 50000, unrealizedPnL: 25000 },
  { date: "Feb", totalValue: 1350000, realizedPnL: 75000, unrealizedPnL: 45000 },
  { date: "Mar", totalValue: 1280000, realizedPnL: 65000, unrealizedPnL: 15000 },
  { date: "Apr", totalValue: 1450000, realizedPnL: 95000, unrealizedPnL: 85000 },
  { date: "May", totalValue: 1620000, realizedPnL: 125000, unrealizedPnL: 125000 },
  { date: "Jun", totalValue: 1750000, realizedPnL: 150000, unrealizedPnL: 175000 },
  { date: "Jul", totalValue: 1850000, realizedPnL: 185000, unrealizedPnL: 215000 }
];

export const mockActiveOrders = [
  {
    id: "order1",
    pair: "BTC/USDT",
    type: "Limit Buy",
    price: 65000,
    quantity: 0.5,
    filled: 0,
    status: "Open",
    time: "2024-01-15 10:30"
  },
  {
    id: "order2", 
    pair: "ETH/USDT",
    type: "Stop Loss",
    price: 3200,
    quantity: 10,
    filled: 0,
    status: "Open",
    time: "2024-01-15 09:15"
  },
  {
    id: "order3",
    pair: "SOL/USDT", 
    type: "Limit Sell",
    price: 155,
    quantity: 100,
    filled: 25,
    status: "Partially Filled",
    time: "2024-01-14 16:45"
  }
];

export const mockWatchlist = [
  { symbol: "XRP", price: "$0.52", change: "+2.1%" },
  { symbol: "AVAX", price: "$36.24", change: "-1.5%" },
  { symbol: "LINK", price: "$14.83", change: "+0.8%" },
  { symbol: "UNI", price: "$7.22", change: "-0.3%" }
];

export const sparklineData = [45, 52, 48, 61, 55, 67, 59, 72, 68, 75, 71, 78];

export const mockRiskMetrics = {
  portfolioVolatility: "24.5%",
  sharpeRatio: "1.82",
  maxDrawdown: "-15.2%",
  beta: "1.15",
  var95: "$45,200"
};