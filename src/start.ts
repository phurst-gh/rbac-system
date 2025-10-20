import { env } from "../env";
import app from "./app";

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.error(err);
  }

  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log(`📋 Health check: http://localhost:${env.PORT}/health`);
});
