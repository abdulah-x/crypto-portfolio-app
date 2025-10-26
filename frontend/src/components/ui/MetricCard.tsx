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
    <div className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 hover:border-gray-700 transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400 mt-1 font-medium">{subtitle}</p>}
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-3 py-2 rounded-xl ${
            change.isPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {change.isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            <span className="text-sm font-bold">{change.percentage}</span>
          </div>
        )}
      </div>

      <div className="space-y-4 text-center">
        <div className={`font-bold tracking-tight ${
          title === "Success Rate" ? "text-4xl text-white" : 
          title === "Unrealized P&L" && value.startsWith("$") && !value.startsWith("$-") ? "text-4xl text-emerald-400" :
          "text-4xl text-white"
        }`}>{value}</div>
        
        {change && (
          <div className="flex flex-col gap-2 items-center">
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${
                change.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {title === "Success Rate" ? change.value : 
                 change.isPositive ? `+${change.value}` : change.value}
              </span>
              {title !== "Success Rate" && (
                <span className="text-sm text-gray-400 font-medium bg-gray-800/50 px-2 py-1 rounded-md">24h</span>
              )}
            </div>
            {title === "Success Rate" && (
              <div className="text-sm text-gray-400 font-medium">
                {change.percentage}
              </div>
            )}
          </div>
        )}

        {sparklineData && (
          <div className="h-12 flex items-end justify-center gap-1 mt-4">
            {sparklineData.map((value, index) => (
              <div
                key={index}
                className={`w-2 rounded-lg transition-all duration-300 ${
                  value > 50 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm shadow-emerald-500/30' : 'bg-gradient-to-t from-red-600 to-red-400 shadow-sm shadow-red-500/30'
                }`}
                style={{ height: `${Math.max(6, (value / 100) * 48)}px` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}