"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      <div>
        <h3 className="font-bold text-lg mb-4">Filters</h3>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold mb-3">Gender</p>
            <div className="space-y-2">
              {["Male", "Female", "Unisex"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input 
                    type="radio" 
                    name="gender"
                    checked={searchParams.get("gender") === g.toLowerCase()}
                    onChange={() => updateFilter("gender", g)}
                    className="rounded-full border-zinc-300 text-orange-600 focus:ring-orange-500" 
                  /> 
                  {g}
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