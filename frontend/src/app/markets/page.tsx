"use client";

import { useEffect, useState } from "react";

export default function MarketsPage() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real market data from backend API
    const mockMarketData = [
      { symbol: 'BTC', name: 'Bitcoin', price: 67500, change24h: 2.5 },
      { symbol: 'ETH', name: 'Ethereum', price: 3200, change24h: -1.2 },
      { symbol: 'ADA', name: 'Cardano', price: 0.65, change24h: 4.8 },
      { symbol: 'SOL', name: 'Solana', price: 185, change24h: 7.2 },
      { symbol: 'DOT', name: 'Polkadot', price: 8.5, change24h: -2.1 }
    ];
    
    setTimeout(() => {
      setMarketData(mockMarketData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Markets Overview</h1>
          <p className="text-gray-400">Real-time cryptocurrency market data</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-medium">Asset</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">Price</th>
                  <th className="px-6 py-4 text-right text-gray-300 font-medium">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {marketData.map((asset) => (
                  <tr key={asset.symbol} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{asset.name}</div>
                        <div className="text-gray-400 text-sm">{asset.symbol}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-medium">
                      ${asset.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${
                        asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}