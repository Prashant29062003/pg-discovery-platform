import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import * as dotenv from "dotenv";

// Load environment variables manually for the script
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const neonSql = neon(process.env.DATABASE_URL);
export const seedDb = drizzle(neonSql, { schema });

// Room and bed seeding functions
export async function cleanRoomsAndBeds() {
  console.log('🧹 Cleaning rooms and beds...');
  
  // Delete all beds first (due to foreign key constraint)
  await seedDb.delete(schema.beds);
  console.log('✅ Deleted all beds');
  
  // Delete all rooms
  await seedDb.delete(schema.rooms);
  console.log('✅ Deleted all rooms');
}

export async function seedRoomsAndBeds() {
  console.log('🏗️  Seeding rooms and beds...');
  
  // Get existing PGs
  const pgs = await seedDb.select().from(schema.pgs);
  if (pgs.length === 0) {
    console.log('❌ No PGs found. Please create PGs first.');
    return;
  }
  
  console.log(`📋 Found ${pgs.length} PG(s)`);
  
  // Create sample rooms for each PG
  for (const pg of pgs) {
    console.log(`\n🏠 Creating rooms for PG: ${pg.name} (${pg.id})`);
    
    // Create different types of rooms with appropriate beds
    const roomConfigs = [
      { roomNumber: '101', type: 'SINGLE', bedCount: 1, basePrice: 8000 },
      { roomNumber: '102', type: 'DOUBLE', bedCount: 2, basePrice: 12000 },
      { roomNumber: '103', type: 'DOUBLE', bedCount: 2, basePrice: 12000 },
      { roomNumber: '104', type: 'TRIPLE', bedCount: 3, basePrice: 15000 },
      { roomNumber: '105', type: 'SINGLE', bedCount: 1, basePrice: 8000 },
      { roomNumber: '201', type: 'DOUBLE', bedCount: 2, basePrice: 13000 },
      { roomNumber: '202', type: 'TRIPLE', bedCount: 3, basePrice: 16000 },
      { roomNumber: '203', type: 'OTHER', bedCount: 4, basePrice: 18000 },
    ];
    
    for (const config of roomConfigs) {
      // Create room
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await seedDb.insert(schema.rooms).values({
        id: roomId,
        pgId: pg.id,
        roomNumber: config.roomNumber,
        type: config.type as any,
        basePrice: config.basePrice,
        deposit: config.basePrice * 2, // 2 months deposit
        noticePeriod: '1 Month',
        capacity: config.bedCount,
        isAvailable: true,
      });
      
      console.log(`  ✅ Created room ${config.roomNumber} (${config.type})`);
      
      // Create beds for the room
      for (let i = 1; i <= config.bedCount; i++) {
        const bedId = `bed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const bedNumber = `${config.roomNumber}-B${i.toString().padStart(2, '0')}`;
        
        await seedDb.insert(schema.beds).values({
          id: bedId,
          roomId: roomId,
          bedNumber: bedNumber,
          isOccupied: false,
        });
        
        console.log(`    ✅ Created bed ${bedNumber}`);
      }
    }
  }
  
  // Show summary
  const totalRooms = await seedDb.select().from(schema.rooms);
  const totalBeds = await seedDb.select().from(schema.beds);
  
  console.log('\n🎉 Room and bed seeding completed!');
  console.log(`📊 Total Rooms: ${totalRooms.length}`);
  console.log(`📊 Total Beds: ${totalBeds.length}`);
  
  // Show room type distribution
  const roomTypeCounts = await seedDb.select({
    type: schema.rooms.type,
    count: sql`COUNT(*)`.mapWith(Number),
  })
  .from(schema.rooms)
  .groupBy(schema.rooms.type)
  .orderBy(schema.rooms.type);
  
  console.log('\n📈 Room Type Distribution:');
  roomTypeCounts.forEach(row => {
    console.log(`   ${row.type}: ${row.count} rooms`);
  });
}

// Main seeding function
export async function seedRoomData() {
  await cleanRoomsAndBeds();
  await seedRoomsAndBeds();
}