"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  MapPin, 
  Wifi, 
  Car, 
  Dumbbell, 
  Utensils, 
  Tv,
  Wind,
  Shield,
  Droplets,
  Power,
  X,
  ChevronDown,
  Grid,
  List
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AMENITIES_OPTIONS = [
  { id: "WiFi", label: "WiFi", icon: Wifi },
  { id: "Parking", label: "Parking", icon: Car },
  { id: "Gym", label: "Gym", icon: Dumbbell },
  { id: "Food", label: "Food", icon: Utensils },
  { id: "TV", label: "TV", icon: Tv },
  { id: "AC", label: "AC", icon: Wind },
  { id: "Security", label: "Security", icon: Shield },
  { id: "Water", label: "Water", icon: Droplets },
  { id: "Power Backup", label: "Power Backup", icon: Power },
];

const POPULAR_CITIES = [
  "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad", 
  "Chennai", "Kolkata", "Gurugram", "Noida", "Jaipur"
];

interface SearchFilters {
  location: string;
  gender: string;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
}

export default function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [locationInput, setLocationInput] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState(POPULAR_CITIES);

  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams?.get("search") || "",
    gender: searchParams?.get("gender") || "",
    minPrice: 5000,
    maxPrice: 30000,
    amenities: [],
  });

  // Initialize from URL params
  useEffect(() => {
    if (searchParams) {
      const location = searchParams.get("search") || "";
      const gender = searchParams.get("gender") || "";
      setLocationInput(location);
      setFilters(prev => ({ ...prev, location, gender }));
    }
  }, [searchParams]);

  // Handle location input and suggestions
  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    setFilters(prev => ({ ...prev, location: value }));
    
    if (value.length > 0) {
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setLocationInput(city);
    setFilters(prev => ({ ...prev, location: city }));
    setShowCitySuggestions(false);
  };

  const handleGenderChange = (gender: string) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.location) params.set("search", filters.location);
    if (filters.gender) params.set("gender", filters.gender);
    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 25000) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","));

    router.push(`/pgs?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      gender: "",
      minPrice: 0,
      maxPrice: 25000,
      amenities: [],
    });
    setLocationInput("");
    router.push("/pgs");
  };

  const activeFiltersCount = [
    filters.location,
    filters.gender,
    filters.minPrice > 0 ? "price" : "",
    filters.maxPrice < 25000 ? "price" : "",
    ...filters.amenities
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Location Search */}
        <div className="relative flex-1">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <Input
              placeholder="Search by location, locality, or PG name..."
              value={locationInput}
              onChange={(e) => handleLocationChange(e.target.value)}
              onFocus={() => locationInput.length > 0 && setShowCitySuggestions(true)}
              className="pl-10 pr-4 h-12 text-base"
            />
          </div>
          
          {/* City Suggestions */}
          <AnimatePresence>
            {showCitySuggestions && filteredCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span className="text-zinc-900 dark:text-zinc-100">{city}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gender Filter */}
        <div className="flex gap-2">
          {[
            { value: "", label: "All" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "unisex", label: "Unisex" }
          ].map((option) => (
            <Button
              key={option.value}
              variant={filters.gender === option.value ? "default" : "outline"}
              onClick={() => handleGenderChange(option.value)}
              className="px-4 h-12"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="px-8 h-12 bg-orange-600 hover:bg-orange-700">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Filter className="w-4 h-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </Button>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="text-zinc-600 dark:text-zinc-400">
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  Price Range: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
                </h4>
                <Slider
                  value={[filters.minPrice, filters.maxPrice]}
                  onValueChange={([min, max]) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
                  max={30000}
                  min={5000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  <span>₹5,000</span>
                  <span>₹30,000</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {AMENITIES_OPTIONS.map((amenity) => {
                    const Icon = amenity.icon;
                    const isChecked = filters.amenities.includes(amenity.id);
                    
                    return (
                      <div
                        key={amenity.id}
                        className={`
                          flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                          ${isChecked 
                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400" 
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                          }
                        `}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        <Checkbox checked={isChecked} />
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="flex justify-end">
                <Button onClick={handleSearch} className="px-8 bg-orange-600 hover:bg-orange-700">
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
