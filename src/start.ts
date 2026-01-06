import { PrismaClient } from "@prisma/client";
import { env } from "../env";
import app from "./app";

const prisma = new PrismaClient();
const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`✅ Health check: http://localhost:${env.PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${env.PORT}/auth/*`);
  console.log(`👤 User endpoints: http://localhost:${env.PORT}/users/*`);
  console.log(`🛡️  RBAC endpoints: http://localhost:${env.PORT}/rbac/*`);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
