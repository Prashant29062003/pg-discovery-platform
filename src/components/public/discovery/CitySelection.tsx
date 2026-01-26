import { CITIES } from "@/config/site";
import { CityCard } from "./CityCard";

export default function CitySelection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">
            Find Your City
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Select a city to explore premium managed living spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CITIES.map((city) => (
            <CityCard 
              key={city.id}
              name={city.name}
              description={city.description}
              image={city.image}
              fallbackImage={city.fallbackImage}
              count={city.propertyCount}
              slug={city.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
