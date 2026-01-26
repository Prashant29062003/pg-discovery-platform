import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { pgs, rooms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PropertyDetail } from '@/components/property/PropertyDetail';

interface PageProps {
  params: { slug: string };
}

export default async function PGPublicPage({ params }: PageProps) {
  const { slug } = params;

  const pgData = await db.select().from(pgs).where(eq(pgs.slug, slug)).limit(1).execute();
  if (!pgData || pgData.length === 0) return notFound();
  const pg = pgData[0];

  const roomsData = await db.select().from(rooms).where(eq(rooms.pgId, pg.id)).execute();

  return <PropertyDetail pg={pg} rooms={roomsData} isAdmin={false} pgId={pg.id} />;
}