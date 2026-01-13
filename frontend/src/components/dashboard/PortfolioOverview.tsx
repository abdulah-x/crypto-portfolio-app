import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

interface PortfolioAllocation {
  asset: string;
  value: number;
  percentage: number;
  color: string;
  [key: string]: string | number;
}

interface PortfolioOverviewProps {
  totalBalance: string;
  allocationData: PortfolioAllocation[];
  dayChange: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  weekChange: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
}

export default function PortfolioOverview({ 
  totalBalance, 
  allocationData, 
  dayChange, 
  weekChange 
}: PortfolioOverviewProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Group small allocations into "Others" (anything below 5%)
  const processedAllocationData = (() => {
    const threshold = 5;
    const mainAssets = allocationData.filter(item => item.percentage >= threshold);
    const smallAssets = allocationData.filter(item => item.percentage < threshold);
    
    if (smallAssets.length > 0) {
      const othersValue = smallAssets.reduce((sum, item) => sum + item.value, 0);
      const othersPercentage = smallAssets.reduce((sum, item) => sum + item.percentage, 0);
      
      return [
        ...mainAssets,
        {
          asset: 'Others',
          value: othersValue,
          percentage: othersPercentage,
          color: '#8b5cf6'
        }
      ];
    }
    
    return mainAssets;
  })();

  // Custom label rendering function for pie slices
  const renderCustomLabel = (entry: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, asset } = entry;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show labels for slices > 8% to avoid clutter
    if (percent < 0.08) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-bold"
        style={{ 
          fontSize: '12px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {`${asset}`}
      </text>
    );
  };

  // Enhanced custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-cyan-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
          <div className="text-white font-bold text-xl mb-2">{data.asset}</div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-cyan-400 font-semibold text-lg">{data.percentage.toFixed(1)}%</span>
            <span className="text-emerald-400 font-bold text-lg">${data.value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/60 transition-all duration-300">
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-lg font-bold text-white">PORTFOLIO OVERVIEW</h3>
      </div>

      {/* Enhanced Single Column Layout with Interactive Chart */}
      <div className="flex flex-col items-center w-full">
        {/* Interactive Donut Chart */}
        <div className="relative w-full max-w-md h-80 mb-6 flex justify-center" style={{ minHeight: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedAllocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                innerRadius={80}
                startAngle={90}
                endAngle={450}
                paddingAngle={3}
                dataKey="value"
                stroke="#1e293b"
                strokeWidth={3}
                onMouseEnter={(data) => setHoveredSlice(data.asset)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{ cursor: 'pointer' }}
              >
                {processedAllocationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    fillOpacity={hoveredSlice === null || hoveredSlice === entry.asset ? 1 : 0.6}
                    style={{
                      filter: hoveredSlice === entry.asset ? 'brightness(1.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Enhanced Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Total Balance</div>
              <div className="text-4xl font-bold text-white tracking-tight mb-1">{totalBalance}</div>
              {hoveredSlice && (
                <div className="text-sm text-cyan-400 font-medium animate-fade-in">
                  Hovering: {hoveredSlice}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Performance Summary Below Chart */}
        <div className="w-full max-w-md">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">24h Change</div>
              <div className={`text-lg font-bold ${
                dayChange.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {dayChange.value}
              </div>
              <div className={`text-sm ${
                dayChange.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {dayChange.percentage}
              </div>
            </div>
            <div className="text-center p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">7d Change</div>
              <div className={`text-lg font-bold ${
                weekChange.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {weekChange.value}
              </div>
              <div className={`text-sm ${
                weekChange.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {weekChange.percentage}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/70 text-white rounded-lg transition-all text-sm font-medium border border-gray-700 hover:border-gray-600 hover:shadow-md">
              View Details
            </button>
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-xl">
              Rebalance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}