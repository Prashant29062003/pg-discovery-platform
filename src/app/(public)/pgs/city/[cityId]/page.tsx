import { db } from "@/db";
import { pgs, rooms } from "@/db/schema";
import { CITIES } from "@/config";
import PGGrid from "@/components/public/discovery/PGGrid";
import PropertyFilters from "@/components/visitor/filters/PropertyFilters";
import MainLayout from "@/components/layout/MainLayout";
import { eq, and, lte, exists, asc } from "drizzle-orm";
import GenderFilter from "@/components/visitor/filters/GenderFilter";

// src/app/(public)/pgs/[cityId]/page.tsx
export default async function CityPage({ 
    params, 
    searchParams 
}: { 
    params: Promise<{ cityId: string }>,
    searchParams: Promise<{ gender?: string }> 
}) {
    const { cityId } = await params;
    const sParams = await searchParams; 
    
    const activeGender = sParams.gender?.toUpperCase() || "ALL";

    const cityData = CITIES.find((c) => c.id === cityId);
    
    // Build filters
    const filters = [];
    if (cityData?.name) filters.push(eq(pgs.city, cityData.name));
    
    // Only add gender filter if it's not "ALL"
    if (activeGender && activeGender !== "ALL") {
        filters.push(eq(pgs.gender, activeGender.toUpperCase() as any));
    }

    const pgsData = await db.query.pgs.findMany({
        where: and(...filters),
        with: { rooms: { orderBy: [asc(rooms.basePrice)] } }
    });

    const formattedPgs = pgsData.map((pg) => ({
        ...pg,
        startingPrice: pg.rooms[0]?.basePrice ?? 0
    }));

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-10 w-full">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                        PGs in {cityData?.name}
                    </h1>
                    
                    {/* Professional Gender Toggle Component */}
                    <GenderFilter currentGender={activeGender || "ALL"} />
                </header>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-64 shrink-0">
                        <PropertyFilters />
                    </aside>
                    <div className="flex-1">
                        <PGGrid pgs={formattedPgs} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}