import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  // Custom label rendering function for pie slices
  const renderCustomLabel = (entry: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, asset } = entry;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show labels for slices > 5% to avoid clutter
    if (percent < 0.05) return null;

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

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">PORTFOLIO OVERVIEW</h3>
        <button className="text-gray-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Donut Chart */}
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={140}
                  innerRadius={85}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#1e293b"
                  strokeWidth={2}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Perfectly Centered Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Total Balance</div>
                <div className="text-3xl font-bold text-white tracking-tight">{totalBalance}</div>
              </div>
            </div>
          </div>
          
          {/* Change Summary Below Chart */}
          <div className="mt-4 space-y-2 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-400">24h Change</div>
                <div className={`text-sm font-bold ${
                  dayChange.isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {dayChange.value} ({dayChange.percentage})
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">7d Change</div>
                <div className={`text-sm font-bold ${
                  weekChange.isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {weekChange.value} ({weekChange.percentage})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Asset Summary */}
        <div className="space-y-4">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Detailed Summary</h4>
            
            {/* Enhanced Asset List with more details */}
            <div className="space-y-3">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-5 h-5 rounded-full border-2 border-gray-600 shadow-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">{item.asset}</span>
                      <span className="text-xs text-gray-400">Allocation</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{item.percentage}%</div>
                    <div className="text-sm text-gray-300 font-medium">${item.value.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-bold border border-gray-700 hover:border-gray-600">
              View Details
            </button>
            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-bold shadow-lg">
              Rebalance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}