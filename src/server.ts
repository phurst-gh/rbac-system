import Fastify from "Fastify";

const server = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

server.get("/v1/api/health", (req, res) => {
  res.send({ status: "ok" });
});

server.post("/v1/api/login", (req, res) => {
  res.send({ status: "ok" });
});

server.post("/v1/api/register", (req, res) => {
  res.send({ status: "ok" });
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    server.log.error(err);
  }
  server.log.info(`Server listening at ${address}`);
});
