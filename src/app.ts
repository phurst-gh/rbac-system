import cookieParser from "cookie-parser";
import type { Express } from "express";
import express from "express";
import { errorWrapper } from "./middleware/errorWrapper";
import { router } from "./routes/index";
import { notFoundHandler } from "./shared/handlers/notFoundHandler";

const app: Express = express();

// Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies with a size limit
app.use(cookieParser()); // Parse cookies from requests

// Call routes
app.use(router);

// Handle 404 and errors
app.use(notFoundHandler);
app.use(errorWrapper);

export default app;
