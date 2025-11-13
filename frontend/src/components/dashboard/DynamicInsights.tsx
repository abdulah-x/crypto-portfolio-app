import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, DollarSign } from 'lucide-react';

interface HoldingData {
  id: string;
  asset: string;
  symbol: string;
  qty: number;
  avgBuyPrice: number;
  lastPrice: number;
  marketValue: number;
  realizedPnL: number;
  unrealizedPnL: number;
  allocation: number;
  change24h: number;
}

interface PortfolioMetrics {
  totalCapital: {
    value: string;
    change24h: {
      value: string;
      percentage: string;
      isPositive: boolean;
    };
  };
  unrealizedPnL: {
    value: string;
    change24h: {
      value: string;
      percentage: string;
      isPositive: boolean;
    };
  };
  realizedPnL: {
    value: string;
    change24h: {
      value: string;
      percentage: string;
      isPositive: boolean;
    };
  };
}

interface InsightsProps {
  holdings: HoldingData[];
  metrics: PortfolioMetrics;
  totalValue: number;
}

export default function DynamicInsights({ holdings, metrics, totalValue }: InsightsProps) {
  // Calculate best and worst performers
  const bestPerformer = holdings.reduce((best, current) => 
    current.change24h > best.change24h ? current : best
  );
  
  const worstPerformer = holdings.reduce((worst, current) => 
    current.change24h < worst.change24h ? current : worst
  );

  // Calculate portfolio concentration risk
  const topThreeAllocation = holdings
    .sort((a, b) => b.allocation - a.allocation)
    .slice(0, 3)
    .reduce((sum, holding) => sum + holding.allocation, 0);

  // Generate dynamic insights based on data
  const generateInsights = () => {
    const insights = [];

    // Performance insight
    if (bestPerformer.change24h > 5) {
      insights.push({
        type: 'success' as const,
        icon: <TrendingUp className="w-4 h-4" />,
        title: 'Strong Performance',
        message: `${bestPerformer.symbol} is your best performer today (+${bestPerformer.change24h.toFixed(1)}%). Consider taking profits.`
      });
    }

    // Risk insight
    if (topThreeAllocation > 80) {
      insights.push({
        type: 'warning' as const,
        icon: <AlertTriangle className="w-4 h-4" />,
        title: 'Concentration Risk',
        message: `Your top 3 assets represent ${topThreeAllocation.toFixed(1)}% of your portfolio. Consider diversification.`
      });
    } else {
      insights.push({
        type: 'success' as const,
        icon: <CheckCircle className="w-4 h-4" />,
        title: 'Well Diversified',
        message: `Good diversification! Your top 3 assets represent ${topThreeAllocation.toFixed(1)}% of your portfolio.`
      });
    }

    // Profit insight
    const totalUnrealizedPnL = holdings.reduce((sum, holding) => sum + holding.unrealizedPnL, 0);
    const totalRealizedPnL = holdings.reduce((sum, holding) => sum + holding.realizedPnL, 0);
    
    if (totalUnrealizedPnL > totalRealizedPnL * 0.1) {
      insights.push({
        type: 'info' as const,
        icon: <DollarSign className="w-4 h-4" />,
        title: 'Profit Taking',
        message: `You have $${Math.abs(totalUnrealizedPnL).toLocaleString()} in unrealized gains. Consider realizing some profits.`
      });
    }

    return insights.slice(0, 3); // Return top 3 insights
  };

  const insights = generateInsights();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/60 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">PERFORMANCE & INSIGHTS</h3>
        <button className="text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200 p-2 rounded-lg">
          <Target className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Performance Overview */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Best Performer</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-white font-bold text-sm">{bestPerformer.symbol}</div>
              <div className="text-emerald-400 font-semibold text-lg">+{bestPerformer.change24h.toFixed(1)}%</div>
            </div>
          </div>

          <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50 hover:border-red-500/50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs uppercase tracking-wide">Worst Performer</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div className="mt-2">
              <div className="text-white font-bold text-sm">{worstPerformer.symbol}</div>
              <div className="text-red-400 font-semibold text-lg">{worstPerformer.change24h.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Dynamic Insights */}
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                insight.type === 'success' 
                  ? 'bg-emerald-900/20 border-emerald-500/30 hover:border-emerald-500/50' 
                  : insight.type === 'warning'
                  ? 'bg-amber-900/20 border-amber-500/30 hover:border-amber-500/50'
                  : 'bg-blue-900/20 border-blue-500/30 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${
                  insight.type === 'success' 
                    ? 'text-emerald-400' 
                    : insight.type === 'warning'
                    ? 'text-amber-400'
                    : 'text-blue-400'
                }`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm mb-1">{insight.title}</div>
                  <div className="text-gray-300 text-xs leading-relaxed">{insight.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-xl">
              Rebalance
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-white rounded-lg transition-all text-sm font-medium border border-gray-700 hover:border-gray-600">
              Analyze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}