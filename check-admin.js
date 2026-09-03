const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in Neon DB:");
    users.forEach(u => console.log(`- ${u.email} (Role: ${u.role})`));
  } catch (e) {
    console.error("Database connection error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
