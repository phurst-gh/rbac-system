import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import { pinoHttp } from "pino-http";
import { errorWrapper } from "./middleware/errorWrapper";
import routes from "./routes/index";
import { notFoundHandler } from "./shared/handlers/notFoundHandler";
import { logger } from "./shared/lib/pino-logger";

const app: Express = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with a size limit
app.use(cookieParser()); // Parse cookies from requests

// HTTP request logging
app.use(pinoHttp({ logger }));

// Call routes
app.use(routes);

// Handle 404 and errors
app.use(notFoundHandler);
app.use(errorWrapper);

export default app;
