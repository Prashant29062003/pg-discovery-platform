import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import * as dotenv from "dotenv";

// Load environment variables manually for the script
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const sql = neon(process.env.DATABASE_URL);
export const seedDb = drizzle(sql, { schema });