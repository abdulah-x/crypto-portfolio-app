import { useState, useMemo } from 'react';
import { Treemap, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface HeatmapData {
  name: string;
  value: number;
  allocation: number;
  change24h: number;
  price: number;
  color: string;
  [key: string]: any; // Add index signature for Treemap compatibility
}

interface PortfolioHeatmapProps {
  holdings: Array<{
    asset: string;
    symbol: string;
    marketValue: number;
    allocation: number;
    change24h: number;
    lastPrice: number;
  }>;
  totalValue: number;
}

export default function PortfolioHeatmap({ holdings, totalValue }: PortfolioHeatmapProps) {
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  // Enhanced mock data with more coins and mixed performance
  const enhancedHeatmapData: HeatmapData[] = useMemo(() => {
    // Determine color based on performance
    const getPerformanceColor = (change: number) => {
      if (change > 10) return '#059669'; // dark green
      if (change > 5) return '#10b981'; // bright green
      if (change > 2) return '#22c55e'; // green
      if (change > 0) return '#84cc16'; // light green
      if (change > -2) return '#eab308'; // yellow
      if (change > -5) return '#f97316'; // orange
      if (change > -10) return '#ef4444'; // red
      return '#dc2626'; // dark red
    };

    // Add more diverse crypto data with both positive and negative changes
    const additionalCoins = [
      { name: 'AVAX', value: 85000, allocation: 4.2, change24h: -8.5, price: 28.50 },
      { name: 'NEAR', value: 62000, allocation: 3.1, change24h: 12.3, price: 3.80 },
      { name: 'ATOM', value: 48000, allocation: 2.4, change24h: -3.2, price: 9.20 },
      { name: 'FTM', value: 35000, allocation: 1.7, change24h: 15.7, price: 0.42 },
      { name: 'ALGO', value: 28000, allocation: 1.4, change24h: -12.1, price: 0.18 },
      { name: 'HBAR', value: 22000, allocation: 1.1, change24h: 6.8, price: 0.08 },
      { name: 'XLM', value: 18000, allocation: 0.9, change24h: -4.5, price: 0.12 },
      { name: 'VET', value: 15000, allocation: 0.7, change24h: 8.2, price: 0.025 },
      { name: 'FLOW', value: 12000, allocation: 0.6, change24h: -18.4, price: 0.85 },
      { name: 'ICP', value: 10000, allocation: 0.5, change24h: 22.1, price: 5.60 }
    ];

    // Convert original holdings
    const originalData = holdings.map(holding => ({
      name: holding.symbol,
      value: holding.marketValue,
      allocation: holding.allocation,
      change24h: holding.change24h,
      price: holding.lastPrice,
      color: getPerformanceColor(holding.change24h)
    }));

    // Add additional coins with performance colors
    const additionalData = additionalCoins.map(coin => ({
      ...coin,
      color: getPerformanceColor(coin.change24h)
    }));

    return [...originalData, ...additionalData].sort((a, b) => b.value - a.value);
  }, [holdings]);

  // Custom content renderer for treemap cells
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, value, allocation, change24h } = props;
    
    // Only show content for leaf nodes and if cell is large enough
    if (depth !== 1 || width < 60 || height < 40) return null;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: props.color,
            stroke: '#1f2937',
            strokeWidth: 2,
            opacity: hoveredAsset === name ? 1 : 0.9,
            cursor: 'pointer'
          }}
          onMouseEnter={() => setHoveredAsset(name)}
          onMouseLeave={() => setHoveredAsset(null)}
        />
        
        {/* Asset symbol */}
        {width > 80 && height > 60 && (
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="white"
            fontSize={Math.min(width / 4, height / 4, 16)}
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {name}
          </text>
        )}
        
        {/* Allocation percentage */}
        {width > 100 && height > 80 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 8}
            textAnchor="middle"
            fill="white"
            fontSize={Math.min(width / 6, height / 6, 12)}
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {allocation.toFixed(1)}%
          </text>
        )}
        
        {/* Change percentage */}
        {width > 120 && height > 100 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 24}
            textAnchor="middle"
            fill="white"
            fontSize={Math.min(width / 8, height / 8, 10)}
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
          </text>
        )}
      </g>
    );
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-cyan-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <div className="text-white font-bold text-lg mb-2">{data.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Allocation:</span>
              <span className="text-cyan-400 font-semibold">{data.allocation.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Value:</span>
              <span className="text-white font-semibold">${data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">24h Change:</span>
              <span className={`font-semibold ${data.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Price:</span>
              <span className="text-white">${data.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">PORTFOLIO HEATMAP</h3>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            <span>Negative</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Size = Allocation • Color = 24h Performance
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={enhancedHeatmapData}
            dataKey="value"
            aspectRatio={4/3}
            stroke="none"
            content={<CustomizedContent />}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="text-gray-400">
          {enhancedHeatmapData.filter((d: HeatmapData) => d.change24h > 0).length} assets up • {enhancedHeatmapData.filter((d: HeatmapData) => d.change24h <= 0).length} assets down
        </div>
        <div className="text-gray-300">
          Largest holding: {enhancedHeatmapData[0]?.name} ({enhancedHeatmapData[0]?.allocation.toFixed(1)}%)
        </div>
      </div>
    </div>
  );
}