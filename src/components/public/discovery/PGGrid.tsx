"use client"

import { motion } from "framer-motion";
import PGCard from "@/components/visitor/cards/PGCard";

type PG = {
    id: string;
    slug: string;
    name: string;
    city: string;
    locality: string;
    isFeatured: boolean;
    images?: string[] | null;
    thumbnailImage?: string | null;
    amenities?: string[];
    startingPrice?: number;
};

export default function PGGrid({ pgs }: { pgs: PG[] }) {
    if (pgs.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed rounded-[2rem] border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">No PGs available in this location yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pgs.map((pg, index) => (
                <motion.div
                    key={pg.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                    <PGCard
                        slug={pg.slug}
                        name={pg.name}
                        city={pg.city}
                        locality={pg.locality}
                        isFeatured={pg.isFeatured}
                        images={pg.images}
                        thumbnailImage={pg.thumbnailImage}
                        amenities={pg.amenities}
                        startingPrice={pg.startingPrice}
                    />
                </motion.div>
            ))}
        </div>
    );
}
