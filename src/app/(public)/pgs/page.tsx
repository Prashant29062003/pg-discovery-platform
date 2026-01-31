import { db } from "@/db";
import { pgs, rooms, beds } from "@/db/schema";
import { eq, and, or, ilike, asc, count } from "drizzle-orm";
import PGGrid from "@/components/public/discovery/PGGrid";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const revalidate = 0; // Disable caching for this page

export default async function PGListingPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; gender?: string; search?: string }>;
}) {
  // Await searchParams for Next.js 15+ compatibility
  const params = await searchParams;
  const { city, gender, search } = params;

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
        ilike(pgs.locality, `%${search}%`)
      )
    );
  }

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

    const formattedResults = results.map((pg) => {
      // Calculate bed statistics
      const allBeds = pg.rooms.flatMap(room => room.beds);
      const totalBeds = allBeds.length;
      const availableBeds = allBeds.filter(bed => !bed.isOccupied).length;
      
      console.log(`🔍 Debug - PG: ${pg.name}, Total Beds: ${totalBeds}, Available: ${availableBeds}`);
      console.log(`🔍 Debug - Rooms: ${pg.rooms.length}, All beds:`, allBeds);
      
      return {
        ...pg,
        startingPrice: pg.rooms && pg.rooms.length > 0 ? pg.rooms[0].basePrice : 0,
        totalBeds,
        availableBeds,
      };
    });

    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white">
              Available Stays
            </h1>
            <p className="text-zinc-500 mt-2">
              {formattedResults.length} properties found matching your criteria.
            </p>
          </header>

          {formattedResults.length > 0 ? (
            <PGGrid pgs={formattedResults} />
          ) : (
            <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  No properties found
                </h3>
                <p className="text-zinc-500 mb-4">
                  Try adjusting your filters or search for properties in Bangalore or Gurugram.
                </p>
                <Link href="/pgs">
                  <Button variant="outline" className="rounded-full">
                    View All Properties
                  </Button>
                </Link>
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