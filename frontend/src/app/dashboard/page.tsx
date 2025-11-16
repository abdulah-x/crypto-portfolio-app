"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { portfolioApi } from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/ui/MetricCard";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import PortfolioHeatmap from "@/components/dashboard/PortfolioHeatmap";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import {
  DollarSign,
  TrendingUp,
  PieChart as PieChartIcon,
  Target,
} from "lucide-react";

import {
  generateUserMockData,
  mockAllocationData,
  mockHoldingsData,
  mockPerformanceData
} from "@/data/mockData";

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");
  const { user } = useAuth();

  // Backend data states
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [backendDataLoading, setBackendDataLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Get filtered performance data based on timeframe
  const getPerformanceData = (timeframe: string) => {
    return mockPerformanceData[timeframe as keyof typeof mockPerformanceData] || mockPerformanceData['30D'];
  };

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  // Load portfolio data from backend
  useEffect(() => {
    const loadPortfolioData = async () => {
      if (!user) {
        setBackendDataLoading(false);
        return;
      }

      try {
        setBackendDataLoading(true);
        setBackendError(null);
        
        // Fetch portfolio data
        const portfolioResponse = await portfolioApi.getPortfolio();
        setPortfolioData(portfolioResponse.data);
        
        console.log('✅ Portfolio data loaded:', portfolioResponse.data);
      } catch (error: any) {
        console.warn('⚠️ Backend not available, using mock data:', error.message);
        setBackendError(error.message || 'Failed to load portfolio data');
        // Continue with mock data when backend is not available
      } finally {
        setBackendDataLoading(false);
      }
    };

    loadPortfolioData();
  }, [user]);

  // Generate user-specific mock data
  const userMockData = user ? generateUserMockData(user.id, user.email) : null;
  const mockPortfolioMetrics = userMockData?.mockPortfolioMetrics || {
    totalCapital: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    unrealizedPnL: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    realizedPnL: { value: "$0", change24h: { value: "$0", percentage: "0%", isPositive: true } },
    successRate: { percentage: "0%", profitFromWins: "0", totalTrades: 0, winningTrades: 0 }
  };

  const totalPortfolioValue = mockHoldingsData.reduce((sum, holding) => sum + holding.marketValue, 0);

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6">
          {/* Backend Status Banner */}
          {backendError && (
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <p className="text-yellow-300 text-sm">
                  Backend service unavailable - Displaying mock data for demonstration
                </p>
              </div>
            </div>
          )}

          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Capital"
              value={mockPortfolioMetrics.totalCapital.value}
              change={{
                value: mockPortfolioMetrics.totalCapital.change24h.value,
                percentage: mockPortfolioMetrics.totalCapital.change24h.percentage,
                isPositive: mockPortfolioMetrics.totalCapital.change24h.isPositive
              }}
              icon={<DollarSign className="w-5 h-5 text-cyan-500" />}
            />
            <MetricCard
              title="Unrealized P&L"
              value={mockPortfolioMetrics.unrealizedPnL.value}
              change={{
                value: mockPortfolioMetrics.unrealizedPnL.change24h.value,
                percentage: mockPortfolioMetrics.unrealizedPnL.change24h.percentage,
                isPositive: mockPortfolioMetrics.unrealizedPnL.change24h.isPositive
              }}
              icon={<TrendingUp className="w-5 h-5 text-amber-500" />}
            />
            <MetricCard
              title="Realized P&L"
              value={mockPortfolioMetrics.realizedPnL.value}
              change={{
                value: mockPortfolioMetrics.realizedPnL.change24h.value,
                percentage: mockPortfolioMetrics.realizedPnL.change24h.percentage,
                isPositive: mockPortfolioMetrics.realizedPnL.change24h.isPositive
              }}
              icon={<Target className="w-5 h-5 text-emerald-500" />}
            />
            <MetricCard
              title="Success Rate"
              value={mockPortfolioMetrics.successRate.percentage}
              change={{
                value: `${mockPortfolioMetrics.successRate.winningTrades} / ${mockPortfolioMetrics.successRate.totalTrades} trades`,
                isPositive: true
              }}
              icon={<PieChartIcon className="w-5 h-5 text-blue-500" />}
            />
          </div>

          {/* 2-Column Layout: Portfolio Growth (60%) + Portfolio Overview (40%) */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Portfolio Growth Chart - Takes up 60% (3/5) */}
            <div className="xl:col-span-3">
              <PerformanceChart
                data={getPerformanceData(selectedTimeframe)}
                timeframe={selectedTimeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            </div>
            
            {/* Portfolio Overview Donut Chart - Takes up 40% (2/5) */}
            <div className="xl:col-span-2">
              <PortfolioOverview 
                totalBalance="$3,478,000"
                allocationData={mockAllocationData}
                dayChange={{
                  value: "-$84,600",
                  percentage: "-2.4%",
                  isPositive: false
                }}
                weekChange={{
                  value: "+$156,200",
                  percentage: "+4.7%",
                  isPositive: true
                }}
              />
            </div>
          </div>

          {/* Holdings Table - Full Width */}
          <div>
            <HoldingsTable 
              holdings={mockHoldingsData}
              totalValue={totalPortfolioValue}
            />
          </div>

          {/* Portfolio Heatmap - Full Width Modern Visualization */}
          <div>
            <PortfolioHeatmap 
              holdings={mockHoldingsData}
              totalValue={totalPortfolioValue}
            />
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}