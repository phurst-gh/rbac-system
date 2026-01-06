import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  const users: Array<{
    email: string;
    password: string;
    role: Role;
  }> = [
    {
      email: "user@example.com",
      password: "User123!",
      role: Role.USER,
    },
    {
      email: "admin@example.com",
      password: "Admin123!",
      role: Role.ADMIN,
    },
  ];

  for (const user of users) {
    const { email, role } = user;
    const passHash = await bcrypt.hash(user.password, 10);

    try {
      await prisma.user.create({
        data: {
          email,
          passwordHash: passHash,
          role,
        },
      });
      console.log(`✅ User seeded: ${user.email} (${role})`);
    } catch (error) {
      console.log(`⚠️  User already exists: ${user.email}`);
    }
  }
}

seedDatabase()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
