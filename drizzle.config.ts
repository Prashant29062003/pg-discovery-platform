import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Path to your schema file we created earlier
  schema: "./src/db/schema.ts",
  // Where drizzle-kit will store migration snippets
  out: "./drizzle",
  // The database dialect
  dialect: "postgresql",
  dbCredentials: {
    // This pulls from your .env file
    url: process.env.DATABASE_URL!,
  },
});