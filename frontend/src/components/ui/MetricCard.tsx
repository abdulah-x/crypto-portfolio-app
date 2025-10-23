"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
  sparklineData?: number[];
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  sparklineData,
  subtitle,
  icon,
  className = ""
}: MetricCardProps) {
  return (
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
            change.isPositive 
              ? 'bg-emerald-500/10 text-emerald-400' 
              : 'bg-red-500/10 text-red-400'
          }`}>
            {change.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span className="text-xs font-medium">{change.percentage}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-white">{value}</div>
        
        {change && (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              change.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {change.isPositive ? '+' : ''}{change.value}
            </span>
            <span className="text-xs text-gray-500">24h</span>
          </div>
        )}

        {sparklineData && (
          <div className="h-8 flex items-end gap-0.5 mt-3">
            {sparklineData.map((value, index) => (
              <div
                key={index}
                className={`w-1 rounded-sm ${
                  value > 50 ? 'bg-emerald-500' : 'bg-red-500'
                }`}
                style={{ height: `${Math.max(4, (value / 100) * 32)}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}