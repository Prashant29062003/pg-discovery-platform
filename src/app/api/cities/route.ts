import { NextResponse } from "next/server";
import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all published PGs and get unique cities with featured info
    const citiesWithFeatured = await db.query.pgs.findMany({
      where: eq(pgs.isPublished, true),
      columns: { city: true, isFeatured: true },
      orderBy: [desc(pgs.isFeatured), asc(pgs.city)],
    });
    
    // Process cities and determine if they have featured PGs
    const cityMap = new Map<string, boolean>();
    citiesWithFeatured.forEach(pg => {
      if (!cityMap.has(pg.city)) {
        cityMap.set(pg.city, pg.isFeatured);
      } else if (!cityMap.get(pg.city) && pg.isFeatured) {
        // Update to true if this city has a featured PG
        cityMap.set(pg.city, true);
      }
    });
    
    // Convert to array and sort: featured cities first, then alphabetically
    const cities = Array.from(cityMap.entries())
      .sort(([cityA, isFeaturedA], [cityB, isFeaturedB]) => {
        // Featured cities come first
        if (isFeaturedA !== isFeaturedB) {
          return isFeaturedB ? 1 : -1;
        }
        // Then alphabetical
        return cityA.localeCompare(cityB);
      })
      .map(([city, isFeatured]) => ({ city, isFeatured }));
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
