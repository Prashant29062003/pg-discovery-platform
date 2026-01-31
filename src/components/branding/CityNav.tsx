"use client";

import { useState, useEffect } from "react";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Map, Building2, Sparkles, ShieldCheck, Clock, Star, MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils";

const ListItem = ({ className, title, children, icon, href, ...props }: any) => {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className={cn(
          "flex items-start gap-3 select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 group",
          className
        )}
        {...props}
      >
        {icon && <div className="mt-1">{icon}</div>}
        <div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-none group-hover:text-orange-600 transition-colors">
            {title}
          </div>
          <div className="line-clamp-2 text-xs leading-snug text-zinc-500 dark:text-zinc-400 mt-1">
            {children}
          </div>
        </div>
      </Link>
    </NavigationMenuLink>
  );
};

// Define city configurations with default fallback for new cities
const cityConfigs = {
  'Gurugram': {
    icon: <Map className="w-4 h-4 text-orange-500" />,
    description: "Noble Enclave & Palam Vihar premium stays."
  },
  'Noida': {
    icon: <Building2 className="w-4 h-4 text-blue-500" />,
    description: "Sector 62 & IT Park corporate hubs."
  },
  'Bangalore': {
    icon: <Map className="w-4 h-4 text-purple-500" />,
    description: "Whitefield & Electronic City tech hubs."
  }
};

// Get city configuration with fallback for new cities
function getCityConfig(city: string) {
  // Return predefined config if exists
  if (cityConfigs[city as keyof typeof cityConfigs]) {
    return cityConfigs[city as keyof typeof cityConfigs];
  }
  
  // Generate dynamic config for new cities
  const IconComponent = Map; // Default to Map icon for new cities
  const colors = ['text-green-500', 'text-red-500', 'text-yellow-500', 'text-indigo-500', 'text-pink-500'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    icon: <IconComponent className={`w-4 h-4 ${randomColor}`} />,
    description: `Discover premium PG stays in ${city}.`
  };
}

export function CityNav() {
  const [availableCities, setAvailableCities] = useState<{ city: string; isFeatured: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch('/api/cities');
        if (response.ok) {
          const cities = await response.json();
          setAvailableCities(cities);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  // Separate featured and regular cities
  const featuredCities = availableCities.filter(item => item.isFeatured);
  const regularCities = availableCities.filter(item => !item.isFeatured);
  const allCityNames = availableCities.map(item => item.city);
  
  // Cities that are predefined but don't exist yet (for "coming soon" display)
  const comingSoonCities = Object.keys(cityConfigs).filter(city => !allCityNames.includes(city));

  if (loading) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent text-zinc-600 dark:text-zinc-300">
          Find a Stay
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[550px] grid-cols-2 p-4 bg-white dark:bg-zinc-950">
            <div className="col-span-2 text-center py-8">
              <div className="animate-pulse">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32 mx-auto mb-2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent text-zinc-600 dark:text-zinc-300">
        Find a Stay
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className={cn(
          "p-4 bg-white dark:bg-zinc-950",
          availableCities.length > 6 ? "grid-cols-3 w-[800px]" : availableCities.length > 3 ? "grid-cols-2 w-[550px]" : "grid-cols-1 w-[400px]"
        )}>
          {/* Featured Cities Section */}
          {featuredCities.length > 0 && (
            <div className={cn(
              "col-span-1 mb-4",
              regularCities.length > 0 && "border-b border-zinc-100 dark:border-zinc-800 pb-4"
            )}>
              <div className="flex items-center gap-2 mb-3 px-3">
                <Star className="w-3 h-3 text-yellow-500" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Featured Cities</p>
              </div>
              <div className="space-y-2">
                {featuredCities.map((cityItem) => {
                  const config = getCityConfig(cityItem.city);
                  return (
                    <ListItem 
                      key={cityItem.city}
                      title={cityItem.city} 
                      href={`/pgs?city=${cityItem.city.toLowerCase()}`} 
                      icon={config?.icon}
                      className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                    >
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{config?.description}</span>
                      </div>
                    </ListItem>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Cities Section */}
          {regularCities.length > 0 && (
            <div className={cn(
              featuredCities.length > 0 && regularCities.length > 3 ? "col-span-2" : 
              featuredCities.length > 0 ? "col-span-1" : 
              regularCities.length > 3 ? "col-span-2" : "col-span-1",
              comingSoonCities.length > 0 && regularCities.length > 3 ? "border-r border-zinc-100 dark:border-zinc-800 pr-4" : ""
            )}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-3">
                {featuredCities.length > 0 ? 'Available Cities' : 'Available Cities'}
              </p>
              <div className={cn(
                "grid gap-2",
                regularCities.length > 6 ? "grid-cols-2" : "grid-cols-1"
              )}>
                {regularCities.map((cityItem) => {
                  const config = getCityConfig(cityItem.city);
                  return (
                    <ListItem 
                      key={cityItem.city}
                      title={cityItem.city} 
                      href={`/pgs?city=${cityItem.city.toLowerCase()}`} 
                      icon={config?.icon}
                    >
                      {config?.description}
                    </ListItem>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Coming Soon Cities */}
          {comingSoonCities.length > 0 && (
            <div className={cn(
              "col-span-1",
              (featuredCities.length > 0 || regularCities.length > 3) ? "pl-4" : ""
            )}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-3">
                {(featuredCities.length > 0 || regularCities.length > 0) ? 'Expanding Soon' : 'Coming Soon'}
              </p>
              {comingSoonCities.map((city: string) => {
                const config = cityConfigs[city as keyof typeof cityConfigs];
                return (
                  <ListItem 
                    key={city}
                    title={city} 
                    href="#" 
                    disabled 
                    className="opacity-50 cursor-not-allowed"
                  >
                    {config?.description} (Coming soon)
                  </ListItem>
                );
              })}
            </div>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
