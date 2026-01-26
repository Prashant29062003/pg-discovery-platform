import { db } from "@/db";
import { pgs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CITIES, NEIGHBOURHOODS, PROMISES_IMAGES, REVIEWS } from "@/config";

/**
 * Fetch all cities with property count from database
 * Falls back to constants if no data exists
 */
export async function getCitiesData() {
  try {
    // Fetch all PGs from database
    const allPGs = await db.select().from(pgs);
    
    if (allPGs.length === 0) {
      return CITIES; // Return default cities
    }

    // Group PGs by city and count them
    const cityMap = new Map<string, number>();
    
    allPGs.forEach(pg => {
      const city = pg.city || "Unknown";
      cityMap.set(city, (cityMap.get(city) || 0) + 1);
    });

    // Merge with CITIES constant to preserve images and descriptions
    const dynamicCities = CITIES.map(city => ({
      ...city,
      propertyCount: cityMap.get(city.name) || 0,
    }));

    return dynamicCities;
  } catch (error) {
    console.error("Error fetching cities data:", error);
    return CITIES; // Fallback to constants on error
  }
}

/**
 * Fetch all neighbourhoods with actual PG locations from database
 * Falls back to constants if no data exists
 */
export async function getNeighbourhoodsData() {
  try {
    // Fetch all PGs with location data
    const allPGs = await db.select().from(pgs);
    
    if (allPGs.length === 0) {
      return NEIGHBOURHOODS; // Return default neighbourhoods
    }

    // Group PGs by location (area/locality)
    const locationMap = new Map<string, { city: string; count: number }>();
    
    allPGs.forEach(pg => {
      const area = pg.locality || "Unknown Area";
      const city = pg.city || "Unknown";
      const existing = locationMap.get(area);
      
      locationMap.set(area, {
        city,
        count: (existing?.count || 0) + 1,
      });
    });

    // Convert to neighbourhood format
    const dynamicNeighbourhoods = Array.from(locationMap.entries()).map(([name, data], index) => ({
      name,
      city: data.city,
      count: `${data.count} Home${data.count > 1 ? 's' : ''}`,
      image: NEIGHBOURHOODS[index % NEIGHBOURHOODS.length].image, // Cycle through default images
      span: NEIGHBOURHOODS[index % NEIGHBOURHOODS.length].span,
    }));

    return dynamicNeighbourhoods.length > 0 ? dynamicNeighbourhoods : NEIGHBOURHOODS;
  } catch (error) {
    console.error("Error fetching neighbourhoods data:", error);
    return NEIGHBOURHOODS; // Fallback to constants on error
  }
}

/**
 * Fetch PG data for homepage features
 * Returns featured PGs for carousel/gallery
 */
export async function getFeaturedPGsData(limit: number = 6) {
  try {
    const featuredPGs = await db
      .select()
      .from(pgs)
      .limit(limit);

    if (featuredPGs.length === 0) {
      return [];
    }

    return featuredPGs.map(pg => ({
      id: pg.id,
      name: pg.name,
      city: pg.city,
      area: pg.locality,
      description: pg.description,
      image: pg.thumbnailImage, // Use actual uploaded image
    }));
  } catch (error) {
    console.error("Error fetching featured PGs:", error);
    return [];
  }
}

/**
 * Get promises/amenities from database PGs
 * Falls back to constants if no real data
 */
export async function getPromisesData() {
  try {
    const allPGs = await db.select().from(pgs);
    
    if (allPGs.length === 0) {
      return PROMISES_IMAGES; // Return default promises
    }

    // In production, you'd analyze PGs to determine actual amenities
    // For now, return constants as fallback
    return PROMISES_IMAGES;
  } catch (error) {
    console.error("Error fetching promises data:", error);
    return PROMISES_IMAGES;
  }
}

/**
 * Get reviews from database (if you add a reviews table later)
 * Falls back to constants for now
 */
export async function getReviewsData() {
  try {
    // TODO: Once you have a reviews table in database, fetch from there
    // For now, return mock data from constants
    return REVIEWS;
  } catch (error) {
    console.error("Error fetching reviews data:", error);
    return REVIEWS;
  }
}

/**
 * Get all data for homepage in one call
 * Optimized to reduce database queries
 */
export async function getHomepageData() {
  try {
    const [cities, neighbourhoods, featuredPGs, reviews] = await Promise.all([
      getCitiesData(),
      getNeighbourhoodsData(),
      getFeaturedPGsData(6),
      getReviewsData(),
    ]);

    return {
      cities,
      neighbourhoods,
      featuredPGs,
      reviews,
    };
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return {
      cities: CITIES,
      neighbourhoods: NEIGHBOURHOODS,
      featuredPGs: [],
      reviews: REVIEWS,
    };
  }
}
