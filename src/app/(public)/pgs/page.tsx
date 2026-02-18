import { db } from "@/db";
import { pgs, rooms, beds } from "@/db/schema";
import { eq, and, or, ilike, asc, count, gte, lte, inArray } from "drizzle-orm";
import PGGrid from "@/components/public/discovery/PGGrid";
import AdvancedSearch from "@/components/public/discovery/AdvancedSearch";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Disable caching for this page

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';

export default async function PGListingPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    city?: string; 
    gender?: string; 
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
  }>;
}) {
  // Await searchParams for Next.js 15+ compatibility
  const params = await searchParams;
  const { city, gender, search, minPrice, maxPrice, amenities } = params;

  const filters = [];
  filters.push(eq(pgs.isPublished, true)); // Only show published PGs
  
  if (city) {
    filters.push(ilike(pgs.city, city)); // Use ilike for case-insensitive matching
  }
  if (gender) {
    const validGender = gender.toUpperCase() as "MALE" | "FEMALE" | "UNISEX";
    filters.push(eq(pgs.gender, validGender));
  }
  if (search) {
    filters.push(
      or(
        ilike(pgs.name, `%${search}%`),
        ilike(pgs.locality, `%${search}%`),
        ilike(pgs.city, `%${search}%`),
        ilike(pgs.fullAddress, `%${search}%`)
      )
    );
  }

  // Price filtering - will be applied after getting the data
  const minPriceNum = minPrice ? parseInt(minPrice) : 0;
  const maxPriceNum = maxPrice ? parseInt(maxPrice) : 999999;

  // Amenities filtering
  const amenitiesList = amenities ? amenities.split(',').filter(Boolean) : [];

  try {
    const results = await db.query.pgs.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      orderBy: [asc(pgs.name)],
      with: {
        rooms: {
          with: {
            beds: {
              columns: {
                isOccupied: true,
              },
            },
          },
          columns: {
            basePrice: true,
            capacity: true,
            isAvailable: true,
          },
          orderBy: [asc(rooms.basePrice)],
        },
      },
    });

    // Apply client-side filtering for price and amenities
    let filteredResults = results.filter((pg) => {
      // Filter by price range
      const startingPrice = pg.rooms && pg.rooms.length > 0 ? pg.rooms[0].basePrice : 0;
      if (startingPrice < minPriceNum || startingPrice > maxPriceNum) {
        return false;
      }

      // Filter by amenities
      if (amenitiesList.length > 0) {
        const pgAmenities = pg.amenities || [];
        const hasAllAmenities = amenitiesList.every(amenity => 
          pgAmenities.some(pgAmenity => 
            pgAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    const formattedResults = filteredResults.map((pg) => {
      // Calculate bed statistics
      const allBeds = pg.rooms.flatMap(room => room.beds);
      const totalBeds = allBeds.length;
      const availableBeds = allBeds.filter(bed => !bed.isOccupied).length;
      
      return {
        ...pg,
        state: pg.state || undefined,
        phoneNumber: pg.phoneNumber || undefined,
        thumbnailImage: pg.thumbnailImage || undefined,
        images: pg.images || undefined,
        amenities: pg.amenities || undefined,
        startingPrice: pg.rooms && pg.rooms.length > 0 ? pg.rooms[0].basePrice : 0,
        totalBeds,
        availableBeds,
      };
    });

    // Debug: Log the data being sent to the client
    console.log('🔍 PG Listing Data:', formattedResults.map(pg => ({
      id: pg.id,
      name: pg.name,
      thumbnailImage: pg.thumbnailImage,
      images: pg.images?.slice(0, 2), // First 2 images
      imageCount: pg.images?.length || 0
    })));

    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
              Find Your Perfect PG
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Discover the best paying guest accommodations across India with our advanced search and filters
            </p>
          </div>

          {/* Advanced Search Component */}
          <AdvancedSearch />

          {/* Results Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Available Stays
                </h2>
                <p className="text-zinc-500 mt-1">
                  {formattedResults.length} properties found matching your criteria.
                </p>
              </div>
              
              {/* Quick Filters */}
              <div className="flex gap-2">
                <Link href="/pgs">
                  <Button variant="outline" size="sm">
                    Clear Filters
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          {/* Results Grid */}
          {formattedResults.length > 0 ? (
            <PGGrid pgs={formattedResults} />
          ) : (
            <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  No properties found
                </h3>
                <p className="text-zinc-500 mb-4">
                  Try adjusting your filters or search for properties in other cities.
                </p>
                <div className="space-y-2">
                  <Link href="/pgs">
                    <Button variant="outline" className="rounded-full w-full">
                      View All Properties
                    </Button>
                  </Link>
                  <div className="text-sm text-zinc-400">
                    Popular cities: Bangalore, Mumbai, Delhi, Pune, Hyderabad
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    );
  } catch (error) {
    console.error("Database Error:", error);
    return (
      <MainLayout>
        <div className="py-20 text-center">
          <h2 className="text-xl font-bold text-red-600">Connection Issue</h2>
          <p className="text-zinc-500">Could not reach the database. Please try again later.</p>
        </div>
      </MainLayout>
    );
  }
}