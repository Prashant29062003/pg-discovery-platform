"use client";

import { motion } from "framer-motion";
import EnhancedPGCard from "@/components/public/discovery/EnhancedPGCard";
import { useEffect, useState } from "react";

type PG = {
    id: string;
    slug: string;
    name: string;
    city: string;
    locality: string;
    state?: string;
    isFeatured: boolean;
    images?: string[] | null;
    thumbnailImage?: string | null;
    amenities?: string[];
    startingPrice?: number;
    totalBeds?: number;
    availableBeds?: number;
    rating?: number;
    reviews?: number;
    description?: string;
    gender?: string;
    phoneNumber?: string;
};

export default function PGGrid({ pgs }: { pgs: PG[] }) {
    const [refreshKey, setRefreshKey] = useState(0);
    
    // Force refresh every 30 seconds to get latest data
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 30000); // Refresh every 30 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    // Force refresh when component mounts
    useEffect(() => {
        setRefreshKey(1);
    }, []);

    if (pgs.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed rounded-[2rem] border-zinc-200 dark:border-zinc-800">
                <p className="text-zinc-500">No PGs available in this location yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pgs.map((pg, index) => (
                <motion.div
                    key={`${pg.id}-${refreshKey}`} // Force re-render when refreshKey changes
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                    <EnhancedPGCard
                        key={`${pg.id}-${refreshKey}`} // Force re-render of child components
                        slug={pg.slug}
                        name={pg.name}
                        city={pg.city}
                        locality={pg.locality}
                        state={pg.state}
                        isFeatured={pg.isFeatured}
                        images={pg.images}
                        thumbnailImage={pg.thumbnailImage}
                        amenities={pg.amenities}
                        startingPrice={pg.startingPrice}
                        totalBeds={pg.totalBeds}
                        availableBeds={pg.availableBeds}
                        rating={pg.rating}
                        reviews={pg.reviews}
                        description={pg.description}
                        gender={pg.gender}
                        phoneNumber={pg.phoneNumber}
                    />
                </motion.div>
            ))}
        </div>
    );
}
