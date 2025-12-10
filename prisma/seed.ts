import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create roles (upsert is idempotent)
  const roleOptions = ["user", "manager", "admin"];
  for (const role of roleOptions) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
  console.log("✅ Roles seeded:", roleOptions.join(", "));

  const users = [
    {
      email: "user@example.com",
      password: "User123!",
      role: "user",
    },
    {
      email: "manager@example.com",
      password: "Manager123!",
      role: "manager",
    },
    {
      email: "admin@example.com",
      password: "Admin123!",
      role: "admin",
    },
  ];

  const roles = await prisma.role.findMany();
  const roleIdByName = new Map(roles.map((r) => [r.name, r.id]));

  for (const user of users) {
    const { email } = user;
    const passHash = await bcrypt.hash(user.password, 10);
    const roleId = roleIdByName.get(user.role);

    if (!roleId) {
      throw new Error(`Role '${user.role}' not found`);
    }

    try {
      await prisma.user.create({
        data: {
          email,
          passwordHash: passHash,
          roleId,
        },
      });
      console.log(`✅ User seeded: ${user.email} (${user.role})`);
    } catch (error) {
      console.log(`⚠️  User already exists: ${user.email}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
