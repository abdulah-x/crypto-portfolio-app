"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { tradesApi } from "@/lib/api";

// Mock trades data generator
const generateMockTrades = () => {
  const mockTrades = [];
  const cryptos = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'MATIC', 'LINK', 'UNI'];
  const sides = ['buy', 'sell'];
  
  for (let i = 0; i < 10; i++) {
    const symbol = cryptos[Math.floor(Math.random() * cryptos.length)];
    const side = sides[Math.floor(Math.random() * sides.length)];
    const quantity = parseFloat((Math.random() * 10).toFixed(4));
    const price = parseFloat((Math.random() * 50000 + 1000).toFixed(2));
    const total = quantity * price;
    const realized_pnl_usd = (Math.random() - 0.5) * 1000; // Random P&L
    
    mockTrades.push({
      id: i + 1,
      symbol,
      side,
      quantity,
      price,
      total,
      realized_pnl_usd: parseFloat(realized_pnl_usd.toFixed(2)),
      executed_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed'
    });
  }
  
  return mockTrades.sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime());
};

export default function TradesPage() {
  const { user } = useAuth();
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await tradesApi.getTrades({ page, limit: 20 });
        setTrades(Array.isArray(data.data) ? data.data : []);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } catch (err: any) {
        console.warn('⚠️ Backend not available, using mock trade data:', err.message);
        setError('Backend service unavailable - displaying mock data');
        // Fallback to mock data
        setTrades(generateMockTrades());
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, [user, page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading trade history...</p>
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
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trade History</h1>
          <p className="text-gray-400">Complete transaction history and trade logs</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Pair</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Side</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">Quantity</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">Price</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">Total</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {Array.isArray(trades) && trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(trade.executed_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {trade.symbol}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.side === 'BUY' 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      {trade.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      ${trade.price}
                    </td>
                    <td className="px-6 py-4 text-right text-white">
                      ${(trade.quantity * trade.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${
                        (trade.realized_pnl_usd || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.realized_pnl_usd ? `$${trade.realized_pnl_usd}` : '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!Array.isArray(trades) || trades.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      No trades found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}