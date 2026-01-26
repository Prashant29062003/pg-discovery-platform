import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { and, eq, gte } from "drizzle-orm";

export async function createEnquiry(data: any) {
  const [newEnquiry] = await db.insert(enquiries).values({
    id: crypto.randomUUID(),
    pgId: data.pgId,
    name: data.name,
    phone: data.phone,
    occupation: data.occupation, 
    roomType: data.roomType,     
    moveInDate: data.moveInDate, 
    message: data.message,
    status: 'NEW',
  }).returning();

  return newEnquiry;
}

export async function hasRecentEnquiry(params: {
  pgId: string | null | undefined;
  phone: string;
  since: Date;
}) {
  if (!params.pgId) {
    // For general inquiries without a pgId, check if user submitted any enquiry recently
    const recentEnquiry = await db.query.enquiries.findFirst({
      where: and(
        eq(enquiries.phone, params.phone),
        gte(enquiries.createdAt, params.since)
      ),
    });
    return recentEnquiry;
  }

  // For property-specific inquiries, check for duplicates to the same property
  const recentEnquiry = await db.query.enquiries.findFirst({
    where: and(
      eq(enquiries.pgId, params.pgId),
      eq(enquiries.phone, params.phone),
      gte(enquiries.createdAt, params.since)
    ),
  });

  return recentEnquiry;
}