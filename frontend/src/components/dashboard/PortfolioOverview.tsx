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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Donut Chart */}
        <div className="relative">
          <div className="w-48 h-48 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="none"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-sm font-medium text-gray-400">Total Balance</div>
            <div className="text-lg font-bold text-white">{totalBalance}</div>
          </div>
        </div>

        {/* Allocation Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-400">24h Change</span>
            <div className={`flex items-center gap-1 ${
              dayChange.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <span className="font-medium">{dayChange.value}</span>
              <span className="text-xs">({dayChange.percentage})</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-gray-400">7d Change</span>
            <div className={`flex items-center gap-1 ${
              weekChange.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <span className="font-medium">{weekChange.value}</span>
              <span className="text-xs">({weekChange.percentage})</span>
            </div>
          </div>

          {/* Asset Breakdown */}
          <div className="space-y-3">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-white">{item.asset}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{item.percentage}%</div>
                  <div className="text-xs text-gray-500">${item.value.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
              View Details
            </button>
            <button className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium">
              Rebalance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}