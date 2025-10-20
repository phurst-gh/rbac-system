import type { Express } from "express";
import express from "express";
import { pinoHttp } from "pino-http";
import { notFoundHandler } from "./handlers/notFoundHandler";
import { logger } from "./lib/logger";
import { errorHandler } from "./middleware/error";
import routes from "./routes/index";

const app: Express = express();

// Middleware
app.use(express.json({ limit: "10mb" }));

// HTTP request logging
app.use(pinoHttp({ logger }));

// Call routes
app.use(routes);

// Handle 404 and errors
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
