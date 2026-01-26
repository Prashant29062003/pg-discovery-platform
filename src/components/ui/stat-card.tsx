"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: "blue" | "green" | "red" | "yellow" | "purple";
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-900 border-blue-200",
  green: "bg-green-50 text-green-900 border-green-200",
  red: "bg-red-50 text-red-900 border-red-200",
  yellow: "bg-yellow-50 text-yellow-900 border-yellow-200",
  purple: "bg-purple-50 text-purple-900 border-purple-200",
};

const iconBgClasses = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "blue",
}: StatCardProps) {
  return (
    <div
      className={`rounded-lg border p-6 ${colorClasses[color]} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {trend && (
            <div
              className={`mt-2 text-sm font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-lg ${iconBgClasses[color]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
