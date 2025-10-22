import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import { pinoHttp } from "pino-http";
import { notFoundHandler } from "./handlers/notFoundHandler";
import { logger } from "./lib/pino-logger";
import { errorWrapper } from "./middleware/errorWrapper";
import routes from "./routes/index";

const app: Express = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser()); // Parse cookies from requests

// HTTP request logging
app.use(pinoHttp({ logger }));

// Call routes
app.use(routes);

// Handle 404 and errors
app.use(notFoundHandler);
app.use(errorWrapper);

export default app;
