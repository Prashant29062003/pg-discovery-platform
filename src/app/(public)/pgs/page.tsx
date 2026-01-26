import { db } from "@/db";
import { pgs, rooms } from "@/db/schema";
import { eq, and, or, ilike, asc } from "drizzle-orm";
import PGGrid from "@/components/public/discovery/PGGrid";
import MainLayout from "@/components/layout/MainLayout";

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
  if (city) filters.push(eq(pgs.city, city));
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
          columns: { basePrice: true },
          orderBy: [asc(rooms.basePrice)],
        },
      },
    });

    const formattedResults = results.map((pg) => ({
      ...pg,
      startingPrice: pg.rooms && pg.rooms.length > 0 ? pg.rooms[0].basePrice : 0,
    }));

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
              <p className="text-zinc-500">No properties found. Try adjusting your filters.</p>
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
          <p className="text-zinc-500">Could not reach the database. Try switching to a mobile hotspot if port 5432 is blocked.</p>
        </div>
      </MainLayout>
    );
  }
}