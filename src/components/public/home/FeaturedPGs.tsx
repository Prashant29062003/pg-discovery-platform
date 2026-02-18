import { db } from "@/db";
import { pgs as pgsTable, rooms, beds } from "@/db/schema";
import PGGrid from "@/components/public/discovery/PGGrid";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { eq, asc } from "drizzle-orm";

export default async function FeaturedPGs() {
    // 1. Fetch featured properties with their cheapest room price
    const featuredData = await db.query.pgs.findMany({
        where: eq(pgsTable.isFeatured, true),
        limit: 3,
        with: {
            rooms: {
                with: {
                    beds: {
                        columns: {
                            isOccupied: true,
                        },
                    },
                },
                columns: { basePrice: true },
                orderBy: [asc(rooms.basePrice)],
                limit: 1
            }
        }
    });

    // 2. Format data to include startingPrice and bed counts
    const pgs = featuredData.map((pg) => {
        // Calculate bed statistics
        const allBeds = pg.rooms.flatMap(room => room.beds);
        const totalBeds = allBeds.length;
        const availableBeds = allBeds.filter(bed => !bed.isOccupied).length;
        
        return {
            ...pg,
            state: pg.state || undefined, // Convert null to undefined
            phoneNumber: pg.phoneNumber || undefined, // Convert null to undefined
            thumbnailImage: pg.thumbnailImage || undefined, // Convert null to undefined
            images: pg.images || undefined, // Convert null to undefined
            amenities: pg.amenities || undefined, // Convert null to undefined
            startingPrice: pg.rooms[0]?.basePrice ?? 0,
            totalBeds,
            availableBeds,
        };
    });

    if (pgs.length === 0) return null;

    return (
        <section className="py-20">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        Handpicked <span className="text-orange-600">Stays</span>
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-lg text-lg">
                        Our most premium, highly-rated living spaces with top-tier amenities and prime locations.
                    </p>
                </div>
                
                <Link 
                    href="/pgs" 
                    className="group flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                    View All Properties
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <PGGrid pgs={pgs} />
        </section>
    );
}
