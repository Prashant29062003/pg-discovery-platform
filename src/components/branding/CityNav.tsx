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
          <p className="line-clamp-2 text-xs leading-snug text-zinc-500 dark:text-zinc-400 mt-1">
            {children}
          </p>
        </div>
      </Link>
    </NavigationMenuLink>
  );
};

// Define city configurations
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

export function CityNav() {
  const [availableCities, setAvailableCities] = useState<string[]>([]);
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

  // Cities that exist in database
  const activeCities = availableCities.filter(city => cityConfigs[city as keyof typeof cityConfigs]);
  
  // Cities that don't exist yet but we want to show as coming soon
  const comingSoonCities = Object.keys(cityConfigs).filter(city => !availableCities.includes(city));

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
        <div className="grid w-[550px] grid-cols-2 p-4 bg-white dark:bg-zinc-950">
          {activeCities.length > 0 && (
            <div className="col-span-1 border-r border-zinc-100 dark:border-zinc-800 pr-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-3">Active Cities</p>
              {activeCities.map((city) => {
                const config = cityConfigs[city as keyof typeof cityConfigs];
                return (
                  <ListItem 
                    key={city}
                    title={city} 
                    href={`/pgs?city=${city.toLowerCase()}`} 
                    icon={config?.icon}
                  >
                    {config?.description}
                  </ListItem>
                );
              })}
            </div>
          )}
          
          {comingSoonCities.length > 0 && (
            <div className={`col-span-1 ${activeCities.length > 0 ? 'pl-4' : ''}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-3">
                {activeCities.length > 0 ? 'Expanding Soon' : 'Coming Soon'}
              </p>
              {comingSoonCities.map((city) => {
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
