import CITIES_DATA from "@/lib/cities-data";
import { CityCard } from "@/components/public/discovery/CityCard";

export default function CitySelection() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
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
          {CITIES_DATA.map((city) => (
            <CityCard 
              key={city.id}
              name={city.name}
              description={city.description}
              image={city.imageUrl}
              fallbackImage={city.imageUrl}
              count={city.neighborhoods.length}
              slug={city.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}