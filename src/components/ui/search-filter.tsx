"use client";

import React from "react";
import { cn } from "@/utils";

interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    label: string;
    name: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
  }[];
  placeholder?: string;
  isLoading?: boolean;
}

export function SearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  placeholder = "Search...",
  isLoading,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <span className="absolute right-3 top-2.5 text-gray-400">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <div key={filter.name} className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                {filter.label}:
              </label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                disabled={isLoading}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
