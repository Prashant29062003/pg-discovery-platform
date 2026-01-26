import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { pgs, enquiries } from '@/db/schema';
import { count, eq, gte, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, Plus, Home, Inbox, 
  BarChart3, Edit, LayoutDashboard, 
  ArrowUpRight, Clock, CheckCircle2 
} from 'lucide-react';
import { requireOwnerAccess } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';

export default async function DashboardPage() {
  await requireOwnerAccess();
  const { userId } = await auth();
  if (!userId) return null;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pgCountResult, recentEnquiriesResult, pendingEnquiriesResult, recentPGsList] = await Promise.all([
    db.select({ count: count() }).from(pgs).execute(),
    db.select({ count: count() }).from(enquiries).where(gte(enquiries.createdAt, sevenDaysAgo)).execute(),
    db.select({ count: count() }).from(enquiries).where(eq(enquiries.status, 'NEW')).execute(),
    db.select({
      id: pgs.id,
      name: pgs.name,
      city: pgs.city,
      locality: pgs.locality,
      isFeatured: pgs.isFeatured,
    }).from(pgs).orderBy(desc(pgs.createdAt)).limit(4).execute(),
  ]);

  const pgCount = pgCountResult[0]?.count || 0;
  const recentEnquiries = recentEnquiriesResult[0]?.count || 0;
  const pendingEnquiries = pendingEnquiriesResult[0]?.count || 0;

  return (
    <div className="w-full space-y-6 pb-20">
      
      {/* --- 1. HERO HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
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
          <Card key={i} className="relative overflow-hidden border-zinc-200/60 dark:border-zinc-800 hover:shadow-md transition-shadow">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color}-500`} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-tighter">{stat.label}</p>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500 opacity-80`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-zinc-900 dark:text-white">{stat.val}</span>
                <span className="text-xs font-medium text-zinc-400">{stat.sub}</span>
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
             <Card className="p-0 border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <h2 className="font-bold text-lg">Recent Listings</h2>
                    <Link href="/admin/pgs">
                      <Button variant="ghost" size="sm" className="text-blue-600 h-8">View All</Button>
                    </Link>
                </div>
                <div className="p-6 grid gap-4 sm:grid-cols-2">
                    {recentPGsList.map((pg) => (
                        <div key={pg.id} className="group relative p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-200 dark:hover:border-orange-900 transition-colors">
                            <h3 className="font-bold text-zinc-900 dark:text-white">{pg.name}</h3>
                            <p className="text-sm text-zinc-500 mb-4">{pg.city}, {pg.locality}</p>
                            <div className="flex gap-2">
                                <Link href={`/admin/pgs/${pg.id}/edit`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full text-xs">Edit</Button>
                                </Link>
                                <Link href={`/admin/pgs/${pg.id}/preview`} className="flex-1">
                                    <Button variant="secondary" size="sm" className="w-full text-xs">Preview</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
             </Card>
        </div>

        {/* Right Column (Actions) */}
        <div className="space-y-6">
           {/* Quick Actions / Workflow */}
           <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border-none p-6 shadow-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-green-400" /> Quick Tasks
               </h3>
               <div className="space-y-3">
                  {["Review new enquiries", "Update room pricing", "Check property status"].map((task, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-white/10 cursor-pointer transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          {task}
                      </div>
                  ))}
               </div>
               <Separator className="my-4 bg-white/20" />
               <Link href="/admin/enquiries">
                 <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold">
                     View Enquiries
                 </Button>
               </Link>
           </Card>
        </div>
      </div>
    </div>
  );
}