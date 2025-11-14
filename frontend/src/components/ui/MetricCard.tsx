"use client";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    percentage?: string;
    isPositive: boolean;
  };
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon,
  className = ""
}: MetricCardProps) {
  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 ${className}`}>
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
      </div>

      {/* Main Value */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-white tracking-tight">
          {value}
        </div>
      </div>

      {/* 24h Change */}
      {change && (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${
            change.isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {change.value}
          </span>
          {change.percentage && (
            <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
              {change.percentage}
            </span>
          )}
        </div>
      )}
    </div>
  );
}