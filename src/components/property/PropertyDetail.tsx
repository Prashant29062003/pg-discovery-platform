'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Phone, User, DoorOpen, Users, 
  Info, ShieldCheck, IndianRupee, ArrowLeft
} from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  basePrice: number;
  capacity?: number | null;
  isAvailable?: boolean | null;
}

interface PropertyDetailProps {
  pg: {
    id: string;
    name: string;
    description: string;
    city: string;
    locality: string;
    gender: string;
    thumbnailImage?: string | null;
    images?: string[] | null;
    managerName?: string | null;
    phoneNumber?: string | null;
    minStayDays?: number | null;
    isPublished?: boolean | null;
    isFeatured?: boolean | null;
  };
  rooms: Room[];
  isAdmin?: boolean;
  pgId?: string;
}

export function PropertyDetail({ pg, rooms, isAdmin = false, pgId }: PropertyDetailProps) {
  const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.basePrice)) : 0;
  const maxPrice = rooms.length > 0 ? Math.max(...rooms.map(r => r.basePrice)) : 0;
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const totalBeds = rooms.reduce((s, r) => s + (r.capacity || 1), 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* TOP NAVIGATION */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href={isAdmin ? '/admin/pgs' : '/pgs'} 
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>
          <div className="flex gap-2">
            <Badge variant="outline" className="rounded-full px-4">{pg.city}</Badge>
            <Badge variant={pg.isPublished ? 'default' : 'secondary'} className="rounded-full px-4">
              {pg.isPublished ? 'Live' : 'Draft'}
            </Badge>
            {isAdmin && pgId && (
              <Link href={`/admin/pgs/${pgId}/edit`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO IMAGE */}
            <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl">
              {pg.thumbnailImage ? (
                <Image src={pg.thumbnailImage} alt={pg.name} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                  <MapPin className="w-16 h-16 text-zinc-300" />
                  <p className="text-zinc-400 font-medium">No cover image available</p>
                </div>
              )}
            </div>

            {/* TITLE & LOCATION */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {pg.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-zinc-600 dark:text-zinc-400">
                <p className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-orange-500" /> {pg.locality}, {pg.city}
                </p>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none">
                  For {pg.gender}
                </Badge>
              </div>
            </div>

            {/* KEY METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Rooms', val: rooms.length, icon: DoorOpen, color: 'text-blue-500' },
                { label: 'Available', val: availableRooms, icon: ShieldCheck, color: 'text-green-500' },
                { label: 'Beds', val: totalBeds, icon: Users, color: 'text-purple-500' },
                { label: 'Min Stay', val: `${pg.minStayDays || 1}d`, icon: Info, color: 'text-zinc-500' },
              ].map((item, i) => (
                <Card key={i} className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`${item.color} bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">{item.val}</p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{item.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* DESCRIPTION */}
            {pg.description && (
              <section className="space-y-4 pt-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  About this property
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg whitespace-pre-line">
                  {pg.description}
                </p>
              </section>
            )}

            {/* ROOM LISTING */}
            <section className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Room Categories</h3>
                <span className="text-sm text-zinc-500 font-medium">{rooms.length} Total Units</span>
              </div>
              <div className="grid gap-4">
                {rooms.map((room: any) => (
                  <Card key={room.id} className="group hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                            <DoorOpen className="w-7 h-7 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold">Room {room.roomNumber}</h4>
                            <p className="text-zinc-500 flex items-center gap-1.5 capitalize">
                              {room.type} Type • <Badge variant="outline" className="text-[10px] h-5">{room.capacity || 1} Sharing</Badge>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:text-right gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-zinc-100 dark:border-zinc-800">
                          <div>
                            <p className="text-sm text-zinc-400 uppercase tracking-tighter font-bold">Monthly Rent</p>
                            <p className="text-2xl font-black text-zinc-900 dark:text-white flex items-center md:justify-end">
                              <IndianRupee className="w-4 h-4" /> {room.basePrice.toLocaleString()}
                            </p>
                          </div>
                          <Badge 
                            className={`px-4 py-1.5 rounded-full ${
                              room.isAvailable ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-zinc-100 text-zinc-500'
                            }`}
                          >
                            {room.isAvailable ? 'Ready to Move' : 'Occupied'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-8">
              <Card className="shadow-2xl border-orange-200 dark:border-orange-900/50 overflow-hidden">
                <div className="bg-orange-600 p-6 text-white text-center">
                  <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Interested in staying?</p>
                  <h4 className="text-xl font-bold">Inquire about Availability</h4>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <User className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400 font-bold uppercase tracking-tight">Manager</p>
                      <p className="font-bold text-lg">{pg.managerName || "Management Team"}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 h-12 text-lg rounded-xl">
                      <a href={`tel:${pg.phoneNumber}`}>
                        <Phone className="w-5 h-5 mr-3" /> Call {pg.phoneNumber}
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-xl text-zinc-600">
                      📧 Send Message
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Property Rules</p>
                    <div className="grid grid-cols-1 gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex justify-between"><span>Gender Allowed</span><span className="font-bold text-zinc-900 dark:text-white">{pg.gender}</span></div>
                      <div className="flex justify-between"><span>Minimum Stay</span><span className="font-bold text-zinc-900 dark:text-white">{pg.minStayDays || 1} Days</span></div>
                      <div className="flex justify-between"><span>Security Deposit</span><span className="font-bold text-zinc-900 dark:text-white">1 Month Rent</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 p-6 bg-blue-600 rounded-3xl text-white flex items-center gap-4 shadow-lg shadow-blue-500/20">
                <ShieldCheck className="w-10 h-10 opacity-50" />
                <div>
                  <p className="font-bold">Verified Listing</p>
                  <p className="text-xs text-blue-100">This property has been verified.</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
