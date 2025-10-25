import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState } from 'react';

interface PerformanceData {
  date: string;
  totalValue: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  timeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export default function PerformanceChart({ 
  data, 
  timeframe: propTimeframe, 
  onTimeframeChange 
}: PerformanceChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState(propTimeframe || '30D');
  const timeframes = ['7D', '30D', '90D', '1Y', 'ALL'];
  
  const currentTimeframe = propTimeframe || selectedTimeframe;

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const handleTimeframeChange = (tf: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(tf);
    } else {
      setSelectedTimeframe(tf);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Portfolio Growth Over Time</h3>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1 border border-gray-700">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                currentTimeframe === tf
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <defs>
              <linearGradient id="totalValueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="1 1" 
              stroke="#374151" 
              strokeOpacity={0.3}
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dx={-10}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#22d3ee"
              strokeWidth={3}
              fill="url(#totalValueGradient)"
              dot={false}
              activeDot={{ 
                r: 6, 
                stroke: '#22d3ee', 
                strokeWidth: 2, 
                fill: '#0f172a'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and Stats */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-sm" />
            <span className="text-sm font-medium text-gray-300">Total Value</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-sm" />
            <span className="text-sm font-medium text-gray-300">Realized PnL</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-amber-400 rounded-full shadow-sm" />
            <span className="text-sm font-medium text-gray-300">Unrealized PnL</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium text-gray-400 mb-1">Period Growth</div>
          <div className="text-xl font-bold text-cyan-400 tracking-tight">+24.8%</div>
        </div>
      </div>
    </div>
  );
}