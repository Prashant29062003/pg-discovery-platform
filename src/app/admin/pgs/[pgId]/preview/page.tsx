import { requireOwnerAccess } from '@/lib/auth';
import { getPGWithRooms } from '@/modules/pg/pg.actions';
import { PreviewGallery } from '@/components/admin/PreviewGallery';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Phone, User, DoorOpen, Users, 
  Wifi, Zap, Home, ArrowLeft, Clock, 
  ShieldCheck, Info, Calendar, ExternalLink,
  IndianRupee, CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

interface PreviewPGPageProps {
  params: Promise<{
    pgId: string;
  }>;
}

export default async function PreviewPGPage({ params: paramsPromise }: PreviewPGPageProps) {
  await requireOwnerAccess();
  
  const { pgId } = await paramsPromise;
  const pgData = await getPGWithRooms(pgId);
  const { pg, rooms } = pgData;

  // Logic for price range display
  const prices = rooms.map(r => r.basePrice);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP UTILITY NAV */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/admin/pgs" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to PGs</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/admin/pgs/${pgId}/edit`}>
              <Button variant="outline" size="sm" className="hidden sm:flex border-zinc-300">Edit</Button>
            </Link>
            <Badge className={pg.isPublished ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}>
              {pg.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        
        {/* 2. HEADER & PRICING SPLIT */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              {pg.name}
            </h1>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="text-base">{pg.locality}, {pg.city}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Starting from</p>
            <div className="flex items-baseline gap-1 text-4xl font-black text-blue-600">
              <IndianRupee className="w-6 h-6" />
              <span>₹{minPrice.toLocaleString()}</span>
              {maxPrice > minPrice && <span className="text-xl font-medium text-zinc-500">/month</span>}
            </div>
          </div>
        </div>

        {/* 3. HERO GALLERY GRID */}
        <div className="mb-10">
          <PreviewGallery 
            images={pg.images || []} 
            imageNames={pg.imageNames}
            pgName={pg.name}
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <Card className="p-4 text-center border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Gender</p>
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {pg.gender === 'MALE' ? '👨 Male' : pg.gender === 'FEMALE' ? '👩 Female' : '🏳️ Unisex'}
            </p>
          </Card>
          <Card className="p-4 text-center border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Available Beds</p>
            <p className="text-lg font-bold text-emerald-600">{pg.availableBeds || 0}</p>
          </Card>
          <Card className="p-4 text-center border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Room Types</p>
            <p className="text-lg font-bold text-blue-600">{rooms.length}</p>
          </Card>
          <Card className="p-4 text-center border-zinc-200 dark:border-zinc-800">
            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Amenities</p>
            <p className="text-lg font-bold text-orange-600">{pg.amenities?.length || 0}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* 4. MAIN CONTENT (COL-8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Overview Chips */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Users, label: pg.gender },
                { icon: Clock, label: `Check-in: ${pg.checkInTime || 'Flexible'}` },
                pg.checkOutTime ? { icon: Clock, label: `Check-out: ${pg.checkOutTime}` } : null,
                { icon: Calendar, label: `${pg.minStayDays || 1}+ Days Min.` },
                { icon: CheckCircle2, label: 'Verified' }
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item && (
                    <>
                      <item.icon className="w-4 h-4 text-blue-600" />
                      {item.label}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Description */}
            {pg.description && (
              <section>
                <h3 className="text-xl font-bold mb-3">About this Property</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
                  {pg.description}
                </p>
              </section>
            )}

            {/* Amenities */}
            {pg.amenities && pg.amenities.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {pg.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                      <Wifi className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Room Categories */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Room Options</h3>
                <span className="text-sm font-medium text-zinc-500">{rooms.length} available</span>
              </div>
              <div className="grid gap-3">
                {rooms.map((room) => (
                  <Card key={room.id} className="p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-lg font-bold">{room.type} Sharing</h4>
                          <Badge variant="outline" className="text-xs">#{room.roomNumber}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                          <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Deposit</p>
                            <p className="font-bold">₹{room.deposit?.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Status</p>
                            <p className={room.isAvailable ? "text-emerald-600 font-bold text-sm" : "text-red-600 font-bold text-sm"}>
                              {room.isAvailable ? '✓ Available' : 'Occupied'}
                            </p>
                          </div>
                        </div>
                        {room.amenities && room.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.map((a, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 md:w-56 p-5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800">
                        <p className="text-3xl font-bold text-blue-600">₹{room.basePrice.toLocaleString()}</p>
                        <p className="text-xs font-medium text-zinc-500">per month</p>
                        <Button className="mt-3 w-full text-sm font-semibold bg-blue-600 hover:bg-blue-700">Select</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* 5. SIDEBAR (COL-4) */}
          <aside className="lg:col-span-4 space-y-4">
            
            {/* Manager Card */}
            <Card className="sticky top-24 p-6 border-2 border-blue-600/20 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-900/10">
              <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-500 uppercase">Manager</p>
                      <p className="font-bold text-sm truncate">{pg.managerName || 'Manager'}</p>
                    </div>
                  </div>
                  <Separator className="bg-zinc-200 dark:bg-zinc-700" />
                  <div className="flex items-center gap-2 text-blue-600 font-bold">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{pg.phoneNumber}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700">
                    Schedule Visit
                  </Button>
                  <Button variant="outline" className="w-full h-10 text-sm border-zinc-300 dark:border-zinc-700">
                    WhatsApp
                  </Button>
                </div>

                <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
                  Response time: 2 hours
                </p>
              </div>
            </Card>

            {/* Policies Card */}
            {(pg.rulesAndRegulations || pg.cancellationPolicy) && (
              <Card className="p-5 space-y-4 dark:bg-zinc-900/50">
                <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Policy Info</h4>
                <div className="space-y-3 text-sm">
                  {pg.rulesAndRegulations && (
                    <div className="flex gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                        {pg.rulesAndRegulations}
                      </p>
                    </div>
                  )}
                  {pg.cancellationPolicy && (
                    <div className="flex gap-3">
                      <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
                        {pg.cancellationPolicy}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Location Card with Google Maps */}
            {(pg.fullAddress || pg.address || (pg.lat && pg.lng)) && (
              <>
                <Card className="p-5 dark:bg-zinc-900/50">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-600 dark:text-zinc-400 mb-3">Location</h4>
                  {pg.fullAddress || pg.address ? (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2 leading-relaxed flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                      {pg.fullAddress || pg.address}
                    </p>
                  ) : null}
                  {pg.lat && pg.lng && (
                    <Button 
                      variant="link" 
                      asChild
                      className="px-0 h-auto text-blue-600 text-xs gap-1"
                    >
                      <a 
                        href={`https://www.google.com/maps?q=${pg.lat},${pg.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Google Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </Card>

                {/* Google Maps Embed */}
                {pg.lat && pg.lng && (
                  <Card className="p-0 overflow-hidden dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <iframe
                      title="Property Location Map"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=***REMOVED***&q=${pg.lat},${pg.lng}`}
                    />
                  </Card>
                )}
              </>
            )}
          </aside>
        </div>
      </main>

      {/* MOBILE CTA FIXED */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 z-[100] flex gap-2">
        <Button className="flex-1 h-11 bg-blue-600 font-semibold text-sm">Call</Button>
        <Button variant="outline" className="flex-1 h-11 border-zinc-300 font-semibold text-sm">Visit</Button>
      </div>
    </div>
  );
}