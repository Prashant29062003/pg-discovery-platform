export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertEnquirySchema } from "@/db/schema";
import { submitEnquiry } from "@/modules/enquiries/enquiry.service";
import crypto from "crypto";

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, number[]>();

function checkRateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => now - ts < windowMs);
  
  if (recentTimestamps.length >= limit) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  
  // Clean up old entries
  if (rateLimitMap.size > 1000) {
    const oldestIp = Array.from(rateLimitMap.keys())[0];
    rateLimitMap.delete(oldestIp);
  }
  
  return true;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "unknown";
  return ip;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // Rate limiting check
    if (!checkRateLimit(clientIp, 5, 60000)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Too many requests. Please try again later." 
        },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    const body = await req.json();

    // Validate pgId if provided - must be a real PG from database
    let pgId = body.pgId?.trim();
    
    // Filter out placeholder pgIds (from floating form, navbar modal, etc)
    if (pgId && ['floating-drawer', 'navbar-modal', 'elite-hub', 'general-inquiry'].includes(pgId)) {
      pgId = null;
    }

    // Sanitize and validate input
    const parsed = insertEnquirySchema.parse({
      pgId: pgId || null, // Allow null for general inquiries
      name: body.name?.trim(),
      phone: body.phone?.trim().replace(/\D/g, ""), // Remove non-digits
      email: body.email?.trim().toLowerCase(),
      occupation: body.occupation?.trim() || "Student/Professional",
      roomType: (body.roomSharing || body.roomType || "SINGLE")?.trim(), // Support both field names
      moveInDate: body.moveInDate || new Date().toISOString(),
      message: body.message?.trim() || undefined,
      id: body.id || crypto.randomUUID(),
    });

    // Pass to service with validated data
    const enquiry = await submitEnquiry(parsed);

    return NextResponse.json(
      { 
        success: true, 
        enquiryId: enquiry.id,
        message: "Enquiry submitted successfully"
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Enquiry API] Error:", {
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    });

    // Handle Zod Validation Errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Please check your input and try again", 
          errors: error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    // Handle Database Foreign Key errors
    if (error.code === "23503") {
      return NextResponse.json(
        { 
          success: false, 
          message: "The selected PG is no longer available. Please choose another." 
        },
        { status: 400 }
      );
    }

    // Handle Duplicate/Spam errors
    if (error.message?.includes("duplicate") || error.message?.includes("recent")) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You already submitted an enquiry for this PG recently. Please wait 24 hours before submitting again.",
          code: "DUPLICATE_ENQUIRY"
        },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        success: false, 
        message: "We encountered an issue processing your request. Please try again later.",
        code: "SERVER_ERROR"
      },
      { status: 500 }
    );
  }
}