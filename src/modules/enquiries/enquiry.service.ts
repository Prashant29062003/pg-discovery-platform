"use server";
import { EnquiryCreateInput, EnquiryCreateSchema } from "./enquiry.schema";
import { createEnquiry, hasRecentEnquiry } from "./enquiry.repo";
import { EmailService } from "@/lib/email/emailService";
import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq } from "drizzle-orm";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function submitEnquiry(input: EnquiryCreateInput) {
  // 1. Validate input with Zod
  const validated = EnquiryCreateSchema.parse(input);

  const since = new Date(Date.now() - ONE_DAY_MS);

  // 2. Check for duplicate/recent enquiries (spam prevention)
  const existing = await hasRecentEnquiry({
    pgId: validated.pgId,
    phone: validated.phone,
    since,
  });

  if (existing) {
    throw new Error(
      "You have already submitted an enquiry for this PG in the last 24 hours. Please wait before submitting again."
    );
  }

  try {
    // 3. Create record
    const enquiry = await createEnquiry(validated);
    
    console.log(`[Enquiry Service] New enquiry created:`, {
      enquiryId: enquiry.id,
      pgId: enquiry.pgId,
      phone: enquiry.phone,
      createdAt: enquiry.createdAt,
    });

    // 4. Send email notifications (async, don't block)
    if (enquiry.pgId) {
      // Get PG details for email
      const pgDetails = await db
        .select()
        .from(pgs)
        .where(eq(pgs.id, enquiry.pgId))
        .limit(1);

      if (pgDetails.length > 0) {
        const pg = pgDetails[0];
        
        // Send notification to PG owner (async)
        EmailService.sendEnquiryNotification({
          to: pg.email || 'admin@pgdiscovery.com', // Fallback to admin
          pgName: pg.name,
          visitorName: enquiry.name,
          visitorEmail: enquiry.email || '', // Convert undefined to empty string
          visitorPhone: enquiry.phone,
          message: enquiry.message || '',
          occupation: enquiry.occupation || undefined,
          roomType: enquiry.roomType || undefined,
          moveInDate: enquiry.moveInDate?.toISOString(),
        }).catch(error => {
          console.error('[Enquiry Service] Failed to send notification email:', error);
        });

        // Send confirmation to visitor (async)
        if (enquiry.email) {
          EmailService.sendEnquiryConfirmation({
            to: enquiry.email,
            visitorName: enquiry.name,
            pgName: pg.name,
            contactInfo: {
              phone: pg.phoneNumber || undefined,
              email: pg.email || undefined,
            },
          }).catch(error => {
            console.error('[Enquiry Service] Failed to send confirmation email:', error);
          });
        }
      }
    }
    
    return enquiry;
  } catch (error: any) {
    console.error("[Enquiry Service] Error creating enquiry:", error);
    throw new Error(`Failed to create enquiry: ${error.message}`);
  }
}