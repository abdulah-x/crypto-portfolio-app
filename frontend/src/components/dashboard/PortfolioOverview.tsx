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
          <div className="relative w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={1}
                  dataKey="value"
                  stroke="#1f2937"
                  strokeWidth={2}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-sm font-medium text-gray-400 mb-1">Total Balance</div>
              <div className="text-xl font-bold text-white">{totalBalance}</div>
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

        {/* Allocation Details */}
        <div className="space-y-4">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Asset Breakdown</h4>
            
            {/* Asset List */}
            <div className="space-y-3">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-gray-700"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-bold text-white">{item.asset}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{item.percentage}%</div>
                    <div className="text-xs text-gray-400 font-medium">${item.value.toLocaleString()}</div>
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