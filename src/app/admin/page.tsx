import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { pgs, enquiries, rooms, beds } from '@/db/schema';
import { count, eq, gte, desc, sum } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, Plus, Home, Inbox, 
  BarChart3, Edit, LayoutDashboard, 
  ArrowUpRight, Clock, CheckCircle2, Bed, MapPin, Star, Image
} from 'lucide-react';
import { requireOwnerAccess } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import { PGImageThumbnail } from '@/components/common/PGImageGallery';

// Type definitions for the query result
type RoomWithBeds = {
  basePrice: number;
  isAvailable: boolean;
  beds: {
    isOccupied: boolean;
  }[];
};

type PGWithRooms = {
  id: string;
  name: string;
  city: string;
  locality: string;
  isFeatured: boolean;
  thumbnailImage: string | null;
  images: string[];
  rooms: RoomWithBeds[];
};

export default async function DashboardPage() {
  await requireOwnerAccess();
  const { userId } = await auth();
  if (!userId) return null;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pgCountResult, recentEnquiriesResult, pendingEnquiriesResult, recentPGsList] = await Promise.all([
    db.select({ count: count() }).from(pgs).execute(),
    db.select({ count: count() }).from(enquiries).where(gte(enquiries.createdAt, sevenDaysAgo)).execute(),
    db.select({ count: count() }).from(enquiries).where(eq(enquiries.status, 'NEW')).execute(),
    db.query.pgs.findMany({
      columns: {
        id: true,
        name: true,
        city: true,
        locality: true,
        isFeatured: true,
        thumbnailImage: true,
        images: true,
      },
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
            isAvailable: true,
          },
        },
      },
      orderBy: [desc(pgs.createdAt)],
      limit: 4,
    }),
  ]);

  const pgCount = pgCountResult[0]?.count || 0;
  const recentEnquiries = recentEnquiriesResult[0]?.count || 0;
  const pendingEnquiries = pendingEnquiriesResult[0]?.count || 0;

  return (
    <div className="w-full space-y-6">
      
      {/* --- 1. HERO HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-2">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of your properties and performance.
          </p>
        </div>
        <Link href="/admin/pgs/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* --- 2. SEMANTIC METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[
          { label: 'Portfolio Size', val: pgCount, sub: 'Active Properties', icon: Home, color: 'blue' },
          { label: 'Urgent Leads', val: pendingEnquiries, sub: 'Needs Immediate Response', icon: Inbox, color: 'orange' },
          { label: 'Weekly Growth', val: recentEnquiries, sub: 'New Leads (7d)', icon: BarChart3, color: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="relative overflow-hidden border-border hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-tighter">{stat.label}</p>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500 opacity-80`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-foreground">{stat.val}</span>
                <span className="text-xs font-medium text-muted-foreground">{stat.sub}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* --- 3. MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Lists) */}
        <div className="xl:col-span-2 space-y-8">
             {/* Recent Listings Card */}
             <Card className="p-0 border-border overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
                    <h2 className="font-bold text-lg text-foreground">Recent Listings</h2>
                    <Link href="/admin/pgs">
                      <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-500 h-8">View All</Button>
                    </Link>
                </div>
                <div className="p-6 grid gap-4 sm:grid-cols-2">
                    {recentPGsList.map((pg: PGWithRooms) => {
                        // Calculate statistics
                        const allBeds = pg.rooms.flatMap((room: RoomWithBeds) => room.beds);
                        const totalBeds = allBeds.length;
                        const availableBeds = allBeds.filter(bed => !bed.isOccupied).length;
                        const startingPrice = pg.rooms.length > 0 ? Math.min(...pg.rooms.map(room => room.basePrice)) : 0;
                        const displayImage = pg.thumbnailImage || (pg.images && pg.images.length > 0 ? pg.images[0] : null);

                        return (
                            <div key={pg.id} className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-orange-200 dark:hover:border-orange-800 transition-all hover:shadow-lg">
                                {/* Image Section */}
                                <div className="relative h-32 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                    <PGImageThumbnail
                                        src={displayImage}
                                        alt={pg.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Featured Badge */}
                                    {pg.isFeatured && (
                                        <div className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-2 py-1 text-xs font-semibold text-white shadow-lg">
                                            <Star className="w-3 h-3" />
                                            Featured
                                        </div>
                                    )}
                                    
                                    {/* Image Count */}
                                    {pg.images && pg.images.length > 1 && (
                                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm">
                                            <Image className="w-3 h-3 inline mr-1" />
                                            {pg.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-4 space-y-3">
                                    {/* Title and Location */}
                                    <div>
                                        <h3 className="font-bold text-foreground group-hover:text-orange-600 transition-colors">{pg.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {pg.city}, {pg.locality}
                                        </div>
                                    </div>

                                    {/* Key Metrics */}
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                                                <Bed className="w-4 h-4" />
                                                <span className="font-medium">{availableBeds}/{totalBeds}</span>
                                            </div>
                                            {startingPrice > 0 && (
                                                <div className="text-orange-600 dark:text-orange-500 font-semibold">
                                                    ₹{startingPrice.toLocaleString()}/mo
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/admin/pgs/${pg.id}/edit`} className="flex-1">
                                            <Button variant="outline" size="sm" className="w-full text-xs">
                                                <Edit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/pgs/${pg.id}/preview`} className="flex-1">
                                            <Button variant="secondary" size="sm" className="w-full text-xs">
                                                <ArrowRight className="w-3 h-3 mr-1" />
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
             </Card>
        </div>

        {/* Right Column (Actions) */}
        <div className="space-y-6">
           {/* Quick Actions / Workflow */}
           <Card className="dark:bg-gradient-to-br dark:from-card dark:to-muted bg-muted/50 border-border p-6 shadow-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="text-green-500" /> Quick Tasks
               </h3>
               <div className="space-y-3">
                  {["Review new enquiries", "Update room pricing", "Check property status"].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-accent cursor-pointer transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span className="text-foreground">{task}</span>
                      </div>
                  ))}
               </div>
               <Separator className="my-4 bg-border" />
               <Link href="/admin/enquiries">
                 <Button className="w-full bg-card hover:bg-accent text-foreground font-bold border-border">
                     View Enquiries
                 </Button>
               </Link>
           </Card>
        </div>
      </div>
    </div>
  );
}