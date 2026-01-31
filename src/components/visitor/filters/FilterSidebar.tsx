"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Star, Home, TrendingUp } from "lucide-react";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [featuredCount, setFeaturedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch PG counts on component mount
  useEffect(() => {
    const fetchPGCounts = async () => {
      try {
        const response = await fetch('/api/pgs/stats');
        if (response.ok) {
          const data = await response.json();
          setFeaturedCount(data.featuredCount || 0);
          setTotalCount(data.totalCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch PG counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGCounts();
  }, []);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value.toLowerCase());
    } else {
      params.delete(key);
    }
    router.push(`/pgs?${params.toString()}`);
  };

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* Stats Cards */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 border border-orange-200/50 dark:border-orange-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Star className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Featured Properties</p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                {loading ? (
                  <div className="h-5 w-12 bg-orange-200 dark:bg-orange-800 rounded animate-pulse"></div>
                ) : (
                  featuredCount.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Properties</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {loading ? (
                  <div className="h-5 w-12 bg-blue-200 dark:bg-blue-800 rounded animate-pulse"></div>
                ) : (
                  totalCount.toLocaleString()
                )}
              </p>
            </div>
          </div>
        </div>

        {featuredCount > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Premium Selection</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {Math.round((featuredCount / totalCount) * 100)}% Featured
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>Filters</span>
          {!loading && totalCount > 0 && (
            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
              ({totalCount.toLocaleString()} properties)
            </span>
          )}
        </h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-3">Gender</p>
            <div className="space-y-2">
              {["Male", "Female", "Unisex"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input 
                    type="radio" 
                    name="gender"
                    checked={searchParams.get("gender") === g.toLowerCase()}
                    onChange={() => updateFilter("gender", g)}
                    className="rounded-full border-zinc-300 text-orange-600 focus:ring-orange-500 group-hover:border-orange-400 transition-colors" 
                  /> 
                  <span className="group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{g}</span>
                </label>
              ))}
            </div>
          </div>
          {/* Add Price Slider here that debounces URL updates */}
        </div>
      </div>
    </aside>
  );
}