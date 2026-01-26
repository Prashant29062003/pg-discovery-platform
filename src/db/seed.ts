import { seedDb } from "./seed-db";
import { pgs, rooms, safetyAudits, guests } from "./schema";

async function main() {
  console.log("Emptying existing data...");
  await seedDb.delete(guests);
  await seedDb.delete(safetyAudits);
  await seedDb.delete(rooms);
  await seedDb.delete(pgs);

  console.log("Seeding enhanced PGs...");

  // FIX: Pre-generate IDs so they can be reused for the foreign key
  const pg1Id = crypto.randomUUID().toString();
  const pg2Id = crypto.randomUUID().toString();

  // 1. Seed Elite Venue PG - Real Gurugram Property (From Google Maps)
  await seedDb.insert(pgs).values({
    id: pg1Id, 
    name: "The Elite Venue PG",
    slug: "the-elite-venue-pg",
    description: "Premium paying guest accommodation with modern amenities, located in Palam Vihar, Gurugram. Fully functional lift, 24/7 security with CCTV, and excellent facilities. Ideal for professionals and students seeking comfort and convenience. Verified Rating: 4.6 stars on Google Maps.",
    fullAddress: "Gali No. 6, Noble Enclave, Palam Vihar Extension, Gurugram, Haryana 122015",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1540932239986-a128078a6a7b?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571508601166-972cfd80c94f?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f7b04cdf?w=1200&h=675&fit=crop&q=80",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80",
    amenities: [
      "High-Speed WiFi",
      "Power Backup (24/7)",
      "Laundry Service",
      "24/7 Security with CCTV",
      "AC Rooms",
      "Kitchen Access",
      "Attached Bathroom",
      "Hot Water",
      "Fully Functional Lift",
      "Common Room",
      "Parking Available"
    ],
    rulesAndRegulations: "No smoking, No alcohol, Quiet hours 10 PM - 8 AM, Guests allowed on weekends with prior notice, Mandatory room inspection monthly",
    checkInTime: "14:00",
    checkOutTime: "11:00",
    cancellationPolicy: "30 days notice for cancellation, 2 months deposit required",
    address: "Gali No. 6, Noble Enclave, Palam Vihar",
    city: "Gurugram",
    locality: "Palam Vihar",
    lat: 28.498886,
    lng: 77.062754,
    gender: "UNISEX",
    managerName: "Rajesh Kumar",
    phoneNumber: "+91-9563826000",
    availableBeds: 12,
    minStayDays: 30,
    isFeatured: true,
    isPublished: true,
    // TODO: Add ownerId: "system" once database column is available
  });

  // 2. Seed Bangalore PG
  await seedDb.insert(pgs).values({
    id: pg2Id,
    name: "Serene Women's Stay",
    slug: "serene-womens-stay",
    description: "Safe and comfortable environment for women, offering premium facilities and excellent customer service.",
    fullAddress: "45 Lotus Lane, Koramangala, Bangalore, Karnataka 560034",
    images: [
      "https://images.unsplash.com/photo-1515221318299-c15eead455ee?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=675&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=675&fit=crop&q=80"
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1515221318299-c15eead455ee?w=400&h=300&fit=crop&q=80",
    amenities: [
      "WiFi",
      "Laundry Service",
      "24/7 Security",
      "Kitchen",
      "Hot Water",
      "CCTV Surveillance",
      "Common Area"
    ],
    address: "45 Lotus Lane",
    city: "Bangalore",
    locality: "Koramangala",
    gender: "FEMALE",
    managerName: "Priya Sharma",
    phoneNumber: "+91-9876543211",
    availableBeds: 8,
    minStayDays: 30,
    isFeatured: false,
    isPublished: true,
    // TODO: Add ownerId: "system" once database column is available
  });

  // 3. Seed Rooms - This will now succeed
  await seedDb.insert(rooms).values([
    // Elite Venue PG Rooms
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      roomNumber: "101",
      type: "SINGLE",
      basePrice: 16000,
      deposit: 32000,
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      roomNumber: "102",
      type: "SINGLE",
      basePrice: 16000,
      deposit: 32000,
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      roomNumber: "201",
      type: "DOUBLE",
      basePrice: 22000,
      deposit: 44000,
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      roomNumber: "202",
      type: "DOUBLE",
      basePrice: 22000,
      deposit: 44000,
    },
    // Serene Women's Stay Rooms
    {
      id: crypto.randomUUID().toString(),
      pgId: pg2Id,
      roomNumber: "G202",
      type: "DOUBLE",
      basePrice: 12000,
      deposit: 20000,
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg2Id,
      roomNumber: "G203",
      type: "SINGLE",
      basePrice: 10000,
      deposit: 18000,
    }
  ]);

  // Get the first room ID from Elite Venue PG for guests
  const room101 = await seedDb.query.rooms.findFirst({
    where: (rooms, { eq }) => eq(rooms.pgId, pg1Id),
  });

  // 4. Seed Safety Audits for Elite Venue PG
  await seedDb.insert(safetyAudits).values([
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      category: "Fire Safety",
      item: "Fire extinguisher installed and checked",
      status: "compliant",
      notes: "Checked on 2024-01-20",
      inspectedBy: "Safety Inspector - John Doe",
      lastChecked: new Date("2024-01-20"),
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      category: "Electrical",
      item: "Electrical wiring certified",
      status: "compliant",
      notes: "All wiring meets safety standards",
      inspectedBy: "Electrical Contractor - ABC Ltd",
      lastChecked: new Date("2024-01-15"),
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      category: "Structural",
      item: "Emergency exits clearly marked",
      status: "compliant",
      notes: "All exits have proper signage",
      inspectedBy: "Safety Inspector - John Doe",
      lastChecked: new Date("2024-01-10"),
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      category: "Health & Hygiene",
      item: "First aid kits available",
      status: "warning",
      notes: "Need to replenish supplies",
      inspectedBy: "Health Officer",
      lastChecked: new Date("2024-01-18"),
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg1Id,
      category: "Security",
      item: "CCTV cameras operational",
      status: "critical",
      notes: "Camera in hallway needs repair",
      inspectedBy: "Security Manager",
      lastChecked: new Date("2024-01-22"),
    },
  ]);

  // 5. Seed Guests for Elite Venue PG
  if (room101) {
    await seedDb.insert(guests).values([
      {
        id: crypto.randomUUID().toString(),
        pgId: pg1Id,
        roomId: room101.id,
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91-9876543210",
        checkInDate: new Date("2024-01-10"),
        checkOutDate: new Date("2024-02-10"),
        status: "active",
        numberOfOccupants: 1,
        notes: "Regular guest, professional background",
      },
      {
        id: crypto.randomUUID().toString(),
        pgId: pg1Id,
        roomId: room101.id,
        name: "Priya Singh",
        email: "priya.singh@example.com",
        phone: "+91-9876543211",
        checkInDate: new Date("2024-01-05"),
        checkOutDate: new Date("2024-02-05"),
        status: "active",
        numberOfOccupants: 1,
        notes: "Software engineer, night shifts",
      },
      {
        id: crypto.randomUUID().toString(),
        pgId: pg1Id,
        roomId: room101.id,
        name: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91-9876543212",
        checkInDate: new Date("2024-01-28"),
        checkOutDate: new Date("2024-02-28"),
        status: "upcoming",
        numberOfOccupants: 1,
        notes: "New resident, arriving next week",
      },
      {
        id: crypto.randomUUID().toString(),
        pgId: pg1Id,
        roomId: room101.id,
        name: "Neha Gupta",
        email: "neha.gupta@example.com",
        phone: "+91-9876543213",
        checkInDate: new Date("2023-12-15"),
        checkOutDate: new Date("2024-01-15"),
        status: "checked-out",
        numberOfOccupants: 1,
        notes: "Checked out on schedule",
      },
    ]);
  }

  // 6. Seed Safety Audits for Serene Women's Stay
  await seedDb.insert(safetyAudits).values([
    {
      id: crypto.randomUUID().toString(),
      pgId: pg2Id,
      category: "Fire Safety",
      item: "Emergency exits clearly marked",
      status: "compliant",
      notes: "All exits properly marked",
      inspectedBy: "Safety Inspector - Jane Smith",
      lastChecked: new Date("2024-01-19"),
    },
    {
      id: crypto.randomUUID().toString(),
      pgId: pg2Id,
      category: "Security",
      item: "Security gates functional",
      status: "compliant",
      notes: "Gates checked and working properly",
      inspectedBy: "Security Manager",
      lastChecked: new Date("2024-01-20"),
    },
  ]);

  console.log("✅ Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});