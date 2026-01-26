import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { PGImageGallery } from "@/components/common/PGImageGallery";
import { 
    MapPin, Wifi, DoorOpen, AlertCircle, Phone, 
    Info, Wind, Coffee, ShieldCheck, Tv, Utensils 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

// --- CUSTOM COMPONENTS ---

/**
 * A professional divider with a centered diamond accent
 */
const ProfessionalSeparator = () => (
    <div className="relative py-2">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>
        <div className="relative flex justify-center">
            <span className="bg-white dark:bg-zinc-950 px-3 text-zinc-300 dark:text-zinc-700">
                <div className="h-1.5 w-1.5 rotate-45 bg-current rounded-sm" />
            </span>
        </div>
    </div>
);

const getAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (n.includes('ac') || n.includes('air')) return <Wind className="w-4 h-4" />;
    if (n.includes('food') || n.includes('meal')) return <Utensils className="w-4 h-4" />;
    if (n.includes('tv')) return <Tv className="w-4 h-4" />;
    if (n.includes('security')) return <ShieldCheck className="w-4 h-4" />;
    if (n.includes('coffee') || n.includes('tea')) return <Coffee className="w-4 h-4" />;
    return <Info className="w-4 h-4" />;
};

export default async function PGDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pg = await db.query.pgs.findFirst({
        where: eq(pgs.slug, slug),
        with: { rooms: true }
    });

    if (!pg) return notFound();

    const minPrice = pg.rooms.length > 0 ? Math.min(...pg.rooms.map(r => r.basePrice)) : 0;

    return (
        <MainLayout>
            <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    
                    {/* --- HEADER --- */}
                    <header className="mb-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                                {pg.gender} PG
                            </Badge>
                            {pg.isFeatured && (
                                <Badge className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-none px-3 py-0.5 rounded-full text-[10px] font-bold">
                                    PREMIUM
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                                    {pg.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    <span className="text-base font-medium">{pg.locality}, {pg.city}</span>
                                </div>
                            </div>

                            {minPrice > 0 && (
                                <div className="hidden md:block text-right">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Starting From</p>
                                    <div className="flex items-baseline justify-end gap-1">
                                        <span className="text-3xl font-black">₹{minPrice.toLocaleString()}</span>
                                        <span className="text-zinc-500 text-sm font-medium">/mo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    {/* --- GALLERY --- */}
                    <div className="rounded-2xl md:rounded-3xl overflow-hidden mb-8 shadow-lg border border-zinc-200 dark:border-zinc-800">
                        <PGImageGallery 
                            images={pg.images} 
                            pgName={pg.name} 
                            variant="hero" 
                            className="aspect-[16/9] md:aspect-[21/9] w-full object-cover" 
                        />
                    </div>

                    {/* --- MAIN CONTENT --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        
                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-8">
                            
                            {/* Property Overview */}
                            <section>
                                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                                    About this Property
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                                    {pg.description}
                                </p>
                            </section>

                            <ProfessionalSeparator />

                            {/* Amenities */}
                            {Array.isArray(pg.amenities) && pg.amenities.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Facilities</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {pg.amenities.map((amenity, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 group hover:border-orange-500/30 transition-colors">
                                                <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm text-orange-500">
                                                    {getAmenityIcon(amenity)}
                                                </div>
                                                <span className="font-semibold text-zinc-700 dark:text-zinc-300 text-xs sm:text-sm">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            <ProfessionalSeparator />

                            {/* Available Units */}
                            {pg.rooms && pg.rooms.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-bold mb-4">Room Options</h3>
                                    <div className="grid gap-3">
                                        {pg.rooms.map((room) => (
                                            <div key={room.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                                                    <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600">
                                                        <DoorOpen className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{room.type} Sharing</h4>
                                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Unit {room.roomNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">₹{room.basePrice.toLocaleString()}</p>
                                                        <span className={cn(
                                                            "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded text-white",
                                                            room.isAvailable ? 'bg-green-500' : 'bg-zinc-400'
                                                        )}>
                                                            {room.isAvailable ? 'Available' : 'Full'}
                                                        </span>
                                                    </div>
                                                    <Button size="sm" className="h-9 px-6 rounded-lg font-bold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">
                                                        Book
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-4">
                                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                                    <CardHeader className="py-4 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                                        <CardTitle className="text-sm font-bold">Contact Property</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-5 space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-orange-500/20">
                                                {pg.managerName?.[0] || 'M'}
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Manager</p>
                                                <p className="font-bold text-sm">{pg.managerName || "Resident Lead"}</p>
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 h-11 font-bold rounded-xl text-white">
                                                <a href={`tel:${pg.phoneNumber}`}>
                                                    <Phone className="w-4 h-4 mr-2" /> {pg.phoneNumber}
                                                </a>
                                            </Button>
                                            <Button variant="outline" className="w-full h-11 rounded-xl font-bold border-zinc-200 dark:border-zinc-700">
                                                Book a Visit
                                            </Button>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <p className="text-zinc-500 text-[9px] font-bold uppercase">Min Stay</p>
                                                <p className="font-bold">{pg.minStayDays} Days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-zinc-500 text-[9px] font-bold uppercase">Notice</p>
                                                <p className="font-bold">30 Days</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                                        <h4 className="font-bold text-[10px] uppercase tracking-wider">House Rules</h4>
                                    </div>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                        {pg.rulesAndRegulations || "Basic guidelines for a peaceful stay."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}