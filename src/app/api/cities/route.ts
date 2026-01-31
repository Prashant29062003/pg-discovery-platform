import { NextResponse } from "next/server";
import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all published PGs and get unique cities
    const cities = await db.query.pgs.findMany({
      where: eq(pgs.isPublished, true),
      columns: { city: true },
      orderBy: [asc(pgs.city)],
    });
    
    // Extract unique city names manually
    const uniqueCities = cities.reduce((acc: string[], pg) => {
      if (!acc.includes(pg.city)) {
        acc.push(pg.city);
      }
      return acc;
    }, []);
    
    return NextResponse.json(uniqueCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json([], { status: 500 });
  }
}
