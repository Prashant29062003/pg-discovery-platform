"use server";
import { EnquiryCreateInput, EnquiryCreateSchema } from "./enquiry.schema";
import { createEnquiry, hasRecentEnquiry } from "./enquiry.repo";

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
    
    return enquiry;
  } catch (error: any) {
    console.error("[Enquiry Service] Error creating enquiry:", error);
    throw new Error(`Failed to create enquiry: ${error.message}`);
  }
}