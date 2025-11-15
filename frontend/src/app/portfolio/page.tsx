"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { portfolioApi } from "@/lib/api";
import HoldingsTable from "@/components/dashboard/HoldingsTable";
import PortfolioOverview from "@/components/dashboard/PortfolioOverview";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { mockPerformanceData } from "@/data/mockData";

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await portfolioApi.getPortfolio();
        setPortfolioData(data);
        setError(null);
      } catch (err: any) {
        console.warn('⚠️ Backend not available, using mock data:', err.message);
        setError('Backend service unavailable - displaying mock data');
        // Continue to show mock data even when backend is not available
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Status Banner */}
        {error && (
          <div className="mb-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-yellow-300 text-sm">
                {error} - Showing demonstration data
              </p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Detailed portfolio management and analysis</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Value</h3>
            <p className="text-2xl font-bold text-white">
              ${portfolioData?.total_portfolio_value_usd?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total P&L</h3>
            <p className={`text-2xl font-bold ${
              (portfolioData?.total_unrealized_pnl_usd || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${portfolioData?.total_unrealized_pnl_usd?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Assets Count</h3>
            <p className="text-2xl font-bold text-white">
              {portfolioData?.asset_count || 0}
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart
            data={mockPerformanceData[selectedTimeframe as keyof typeof mockPerformanceData] || mockPerformanceData['30D']}
            timeframe={selectedTimeframe}
            onTimeframeChange={setSelectedTimeframe}
          />
        </div>

        {/* Portfolio Allocation */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div>
            <PortfolioOverview 
              totalBalance={portfolioData?.total_portfolio_value_usd ? `$${portfolioData.total_portfolio_value_usd.toLocaleString()}` : "$0"}
              allocationData={portfolioData?.holdings?.map((h: any) => ({
                name: h.asset_symbol,
                value: h.current_value_usd || 0,
                percentage: h.portfolio_percentage || 0,
                change24h: h.unrealized_pnl_percentage || 0
              })) || []}
              dayChange={{
                value: portfolioData?.total_unrealized_pnl_usd ? `$${portfolioData.total_unrealized_pnl_usd.toLocaleString()}` : "$0",
                percentage: portfolioData?.total_unrealized_pnl_percentage ? `${portfolioData.total_unrealized_pnl_percentage.toFixed(2)}%` : "0%",
                isPositive: (portfolioData?.total_unrealized_pnl_usd || 0) >= 0
              }}
              weekChange={{
                value: portfolioData?.total_unrealized_pnl_usd ? `$${portfolioData.total_unrealized_pnl_usd.toLocaleString()}` : "$0",
                percentage: portfolioData?.total_unrealized_pnl_percentage ? `${portfolioData.total_unrealized_pnl_percentage.toFixed(2)}%` : "0%",
                isPositive: (portfolioData?.total_unrealized_pnl_usd || 0) >= 0
              }}
            />
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Portfolio Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Cost:</span>
                <span className="text-white font-medium">
                  ${portfolioData?.total_cost_usd?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">P&L Percentage:</span>
                <span className={`font-medium ${
                  (portfolioData?.total_unrealized_pnl_percentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {portfolioData?.total_unrealized_pnl_percentage?.toFixed(2) || '0'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-white font-medium">
                  {portfolioData?.last_updated 
                    ? new Date(portfolioData.last_updated).toLocaleString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div>
          <HoldingsTable 
            holdings={portfolioData?.holdings || []} 
            totalValue={portfolioData?.total_portfolio_value_usd || 0}
          />
        </div>
      </div>
    </div>
  );
}