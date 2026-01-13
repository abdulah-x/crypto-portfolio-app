"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { pnlApi } from "@/lib/api";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { mockPerformanceData } from "@/data/mockData";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30D");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await pnlApi.summary();
        setAnalyticsData(data);
      } catch (err: any) {
        // Handle backend connectivity gracefully
        if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ERR_NETWORK'))) {
          console.info('📡 Backend not running - using demo data for analytics');
        } else {
          console.warn('⚠️ API error:', err.message);
        }
        // Continue to show mock data
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading analytics...</p>
            </div>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Portfolio Analytics</h1>
              <p className="text-gray-400">
                Deep dive into your trading performance and portfolio metrics
              </p>
            </div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">Advanced portfolio analysis and insights</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Realized P&L</h3>
            <p className={`text-2xl font-bold ${
              (analyticsData?.total_realized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${analyticsData?.total_realized_pnl?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Unrealized P&L</h3>
            <p className={`text-2xl font-bold ${
              (analyticsData?.total_unrealized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ${analyticsData?.total_unrealized_pnl?.toLocaleString() || '0'}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Win Rate</h3>
            <p className="text-2xl font-bold text-cyan-400">
              {analyticsData?.win_rate?.toFixed(1) || '0'}%
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Trades</h3>
            <p className="text-2xl font-bold text-white">
              {analyticsData?.total_trades || 0}
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

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Asset Performance</h3>
            <div className="space-y-4">
              {analyticsData?.asset_performance?.map((asset: any) => (
                <div key={asset.symbol} className="flex justify-between items-center">
                  <span className="text-gray-300">{asset.symbol}</span>
                  <span className={`font-medium ${
                    (asset.pnl_percentage || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.pnl_percentage?.toFixed(2) || '0'}%
                  </span>
                </div>
              )) || (
                <div className="text-gray-400 text-center py-4">
                  No asset performance data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Trading Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Average Trade Size:</span>
                <span className="text-white font-medium">
                  ${analyticsData?.average_trade_size?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best Trade:</span>
                <span className="text-green-400 font-medium">
                  ${analyticsData?.best_trade?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Worst Trade:</span>
                <span className="text-red-400 font-medium">
                  ${analyticsData?.worst_trade?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Profit Factor:</span>
                <span className="text-cyan-400 font-medium">
                  {analyticsData?.profit_factor?.toFixed(2) || '0'}
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}