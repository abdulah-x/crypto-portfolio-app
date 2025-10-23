import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PerformanceData {
  date: string;
  totalValue: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export default function PerformanceChart({ 
  data, 
  timeframe, 
  onTimeframeChange 
}: PerformanceChartProps) {
  const timeframes = ['7D', '30D', '90D', '1Y', 'ALL'];

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">PORTFOLIO GROWTH OVER TIME</h3>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                timeframe === tf
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="totalValueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
            />
            <Area
              type="monotone"
              dataKey="totalValue"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#totalValueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and Stats */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full" />
            <span className="text-sm text-gray-400">Total Value</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-sm text-gray-400">Realized PnL</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-sm text-gray-400">Unrealized PnL</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400">Period Growth</div>
          <div className="text-lg font-bold text-emerald-400">+24.8%</div>
        </div>
      </div>
    </div>
  );
}