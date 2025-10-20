import pino from "pino";
import { isDev } from "@/env";

export const logger = isDev()
  ? pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
    })
  : pino({
      level: "info",
    });
