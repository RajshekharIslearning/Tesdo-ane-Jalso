import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ============================
  // ADMIN USER
  // ============================
  const adminPassword = process.env.ADMIN_PASSWORD ?? "StreetEats@Admin2026";
  const hash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ahmedabadstreeteats.in" },
    update: { passwordHash: hash },
    create: {
      email: "admin@ahmedabadstreeteats.in",
      name: "Admin",
      role: "ADMIN",
      passwordHash: hash,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);

  // ============================
  // SAMPLE VENDORS
  // ============================
  const vendors = [
    {
      slug: "ramesh-pani-puri-manek-chowk",
      name: "Ramesh Pani Puri",
      speciality: "Pani Puri / Golgappa",
      locality: "Manek Chowk",
      address: "Near Manek Chowk entrance, opposite jewellery market",
      description: "Famous for spicy, tangy pani puri served since 1982. The secret green chutney recipe has been passed down through generations.",
      isVerified: true,
      isFeatured: true,
      status: "APPROVED",
      ratingSum: 43.5,
      ratingCount: 9,
    },
    {
      slug: "law-garden-dabeli-wala",
      name: "Law Garden Dabeli Wala",
      speciality: "Dabeli",
      locality: "Law Garden",
      address: "Law Garden street food stalls, stall no. 12",
      description: "The original Kutchi dabeli with generous pomegranate seeds, special masala, and the crunchiest peanuts. A Law Garden institution.",
      isVerified: true,
      isFeatured: true,
      status: "APPROVED",
      ratingSum: 44,
      ratingCount: 9,
    },
    {
      slug: "swaminarayan-fafda-jalebi-kalupur",
      name: "Swaminarayan Fafda & Jalebi",
      speciality: "Fafda & Jalebi",
      locality: "Kalupur",
      address: "Near Kalupur Swaminarayan temple, temple road",
      description: "Crispy fafda with fresh hot jalebi — the quintessential Gujarati breakfast. Open only until 11 AM. Worth the early morning!",
      isVerified: true,
      isFeatured: false,
      status: "APPROVED",
      ratingSum: 38,
      ratingCount: 8,
    },
    {
      slug: "gulbai-tekra-chai-nashta",
      name: "Bhai's Cutting Chai Corner",
      speciality: "Chai & Nashta",
      locality: "Gulbai Tekra",
      address: "Gulbai Tekra main road, near the old water tank",
      description: "Strong, creamy cutting chai with crispy toast and omelette. The morning ritual for the entire neighbourhood.",
      isVerified: false,
      isFeatured: false,
      status: "APPROVED",
      ratingSum: 22,
      ratingCount: 5,
    },
    {
      slug: "navrangpura-bhel-puri-corner",
      name: "Navrangpura Bhel Corner",
      speciality: "Bhel Puri",
      locality: "Navrangpura",
      address: "CG road, near Navrangpura petrol pump",
      description: "Award-winning bhel puri with the perfect balance of sweet, sour, and spicy. Three chutneys, extra sev on request.",
      isVerified: false,
      isFeatured: false,
      status: "APPROVED",
      ratingSum: 29.5,
      ratingCount: 6,
    },
  ];

  for (const vendor of vendors) {
    const created = await prisma.vendor.upsert({
      where: { slug: vendor.slug },
      update: {},
      create: vendor,
    });
    console.log(`✅ Vendor: ${created.name} (${created.locality})`);
  }

  // ============================
  // SITE CONTENT
  // ============================
  const contentEntries = [
    { id: "settings", title: "Site Settings", content: JSON.stringify({ siteName: "Ahmedabad Street Eats", tagline: "Discover & rate your favourite local vendors" }) },
  ];

  for (const entry of contentEntries) {
    await prisma.siteContent.upsert({
      where: { id: entry.id },
      update: { content: entry.content },
      create: entry,
    });
  }
  console.log("✅ Site content seeded");

  // ============================
  // SAMPLE NEWSLETTER SUBSCRIBERS
  // ============================
  await prisma.newsletterSubscriber.upsert({
    where: { email: "foodlover@example.com" },
    update: {},
    create: { email: "foodlover@example.com" },
  });

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Admin credentials:");
  console.log("   URL: http://localhost:3000/admin");
  console.log(`   Email: admin@ahmedabadstreeteats.in`);
  console.log(`   Password: ${adminPassword}`);
  console.log("\n⚠️  Change the admin password in production!");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
