import { db } from "@/db";
import PGGrid from "@/components/public/discovery/PGGrid";
import MainLayout from "@/components/layout/MainLayout";
import { ilike, or, asc } from "drizzle-orm";
import { pgs, rooms } from "@/db/schema";

export default async function PGSPage({
    searchParams,
}: {
    searchParams: { search?: string };
}) {

    // 1. Fetch data using Drizzle Relational API
    // This is the cleanest way to replace Prisma's "include"
    const query = searchParams.search || "";

    const pgsData = await db.query.pgs.findMany({
        where: query
            ? or(ilike(pgs.name, `%${query}%`), ilike(pgs.city, `%${query}%`))
            : undefined,
        with: {
            rooms: {
                columns: { basePrice: true },
                orderBy: [asc(rooms.basePrice)], // Ensure we get the actual lowest price
                limit: 1,
            }
        }
    });

    // 2. Format the data for your component
    const formattedPgs = pgsData.map((pg) => ({
        ...pg,
        startingPrice: pg.rooms[0]?.basePrice ?? 0
    }));

    return (
        <MainLayout>
            <div className="p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight dark:text-white">
                        Discover PGs
                    </h1>
                    <p className="text-zinc-500 mt-1 dark:text-zinc-400">
                        {pgsData.length > 0
                            ? `Showing ${pgsData.length} properties in your area`
                            : "No properties found matching your search"}
                    </p>
                </header>

                <div className="mt-4">
                    <PGGrid pgs={formattedPgs} />
                </div>
            </div>
        </MainLayout>
    );
}