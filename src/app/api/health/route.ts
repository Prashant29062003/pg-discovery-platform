import { NextResponse } from 'next/server';
import { db } from '@/db';
import { pgs } from '@/db/schema';

/**
 * Health Check Endpoint
 * 
 * Verifies:
 * - API is responding
 * - Database connectivity
 * - Basic system health
 * 
 * Returns: { status: 'ok' | 'error', timestamp, database: { connected, latency } }
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Test database connectivity by running a simple query
    await db.select().from(pgs).limit(1);
    
    const dbLatency = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          latency: `${dbLatency}ms`,
        },
        version: '0.1.0',
      },
      { status: 200 }
    );
  } catch (error) {
    const dbLatency = Date.now() - startTime;

    console.error('[Health Check] Database connection failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          latency: `${dbLatency}ms`,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        version: '0.1.0',
      },
      { status: 503 }
    );
  }
}
