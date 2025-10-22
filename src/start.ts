import { env } from "../env";
import app from "./app";

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`✅ Health check: http://localhost:${env.PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${env.PORT}/auth/*`);
  console.log(`👤 User endpoints: http://localhost:${env.PORT}/users/*`);
  console.log(`🛡️  RBAC endpoints: http://localhost:${env.PORT}/rbac/*`);
});
