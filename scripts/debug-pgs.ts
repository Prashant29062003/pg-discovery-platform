import { db } from "@/db";
import { pgs } from "@/db/schema";

async function debugPGs() {
  try {
    console.log("🔍 Debugging PGs in database...\n");
    
    // Get all PGs without filters
    const allPGs = await db.query.pgs.findMany({
      columns: {
        id: true,
        name: true,
        city: true,
        isPublished: true,
        gender: true,
      },
      limit: 10,
    });
    
    console.log(`📊 Total PGs found: ${allPGs.length}\n`);
    
    allPGs.forEach((pg, index) => {
      console.log(`${index + 1}. ${pg.name}`);
      console.log(`   ID: ${pg.id}`);
      console.log(`   City: ${pg.city}`);
      console.log(`   Published: ${pg.isPublished ? '✅ Yes' : '❌ No'}`);
      console.log(`   Gender: ${pg.gender}`);
      console.log('');
    });
    
    // Check specifically for Noida and Gurugram
    const noidaPGs = await db.query.pgs.findMany({
      where: (pgs, { eq }) => eq(pgs.city, 'Noida'),
      columns: { id: true, name: true, city: true, isPublished: true },
    });
    
    const gurugramPGs = await db.query.pgs.findMany({
      where: (pgs, { eq }) => eq(pgs.city, 'Gurugram'),
      columns: { id: true, name: true, city: true, isPublished: true },
    });
    
    console.log(`🏙️  PGs in Noida: ${noidaPGs.length}`);
    noidaPGs.forEach(pg => {
      console.log(`   - ${pg.name} (Published: ${pg.isPublished})`);
    });
    
    console.log(`\n🏙️  PGs in Gurugram: ${gurugramPGs.length}`);
    gurugramPGs.forEach(pg => {
      console.log(`   - ${pg.name} (Published: ${pg.isPublished})`);
    });
    
    // Check for different city name formats
    const cityVariations = ['noida', 'Noida', 'gurugram', 'Gurugram', 'gurgaon', 'Gurgaon'];
    
    console.log('\n🔍 Checking city name variations:');
    for (const city of cityVariations) {
      const count = await db.query.pgs.findMany({
        where: (pgs, { eq }) => eq(pgs.city, city),
        columns: { id: true },
      });
      if (count.length > 0) {
        console.log(`   "${city}": ${count.length} PGs found`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error debugging PGs:", error);
  } finally {
    process.exit(0);
  }
}

debugPGs();
