# Project Architecture Overview

## 🎯 Project
A **minimal, modern, service-oriented backend** that demonstrates how independent services can be securely linked and containerized in a real-world environment.

This API will help build tha tinfrastructure.

---

## Tech Stack
- **Frontend:** React (prototype UI)  
- **Backend:** Node.js (Fastify/Express)  
- **Database:** PostgreSQL (users, roles, refresh tokens)  
- **Gateway:** Kong (routing, rate limiting, request control)  
- **Auth:** JWT (access & refresh tokens), cookie-based session handling  
- **RBAC:** Postgres-backed roles & permissions enforced in the API  

---

## Running the App

- `colima start` at root.
- `docker-compose up -d` at root.

---

## 🧩 Components

### **Gateway (Edge Layer)**
- Routes requests to the right service.
- Handles rate limiting and basic routing (`/auth/*` → auth-service, `/app/*` → app-service).

### **Auth Service**
- Handles user registration, login, and token refresh.
- Owns `users` and `tokens` tables.
- Responsible for issuing and validating JWTs.

### **App Service**
- Handles protected business logic endpoints.
- Validates incoming JWTs.
- Enforces roles and permissions (based on token claims).

### **PostgreSQL**
- Single database instance.
- Uses separate **schemas** for each service (`auth`, `app`) to maintain logical separation.
- Each service connects only to its schema.

## 🧭 Principles

- **Service boundaries from day one** — each service owns its logic and schema.
- **Independent deployability** — each has its own Dockerfile.
- **HTTP-only communication** — no direct cross-service calls or shared code.
- **Observability basics** — health checks, structured logging.
- **Simple container orchestration** — all run via one `docker-compose.yml`.

## Steps
- **Step 1:** Tiny typescript API ✅
- **Step 2:** Add postgres DB with Prisma ✅
- **Step 3:** Seed default users ✅
- **Step 4:** Add minimal auth service layer (login and register endpoints with JWT)  

## Architecture

- Gateway (edge): routes /auth/* → auth-service, /app/* → app-service; adds rate limits.
- Auth-service: issues/refreshes tokens; owns users, tokens tables.
- App-service: business endpoints (e.g., todos); enforces roles from token claims.
- PostgreSQL: one DB with separate schemas (auth, app) to avoid tight coupling.
- Shared nothing at runtime: services talk via HTTP only (no shared code, no direct cross-DB queries).
- Observability basics: request logging + health checks.
- Docker Compose: one file to run gateway, auth-service, app-service, db.

---

# 🐋 Docker Command Reference

Quick reference for managing containers, volumes, and images in this project.

---

## Container Lifecycle

| Purpose | Command |
|----------|----------|
| Start all services from `docker-compose.yml` | `docker-compose up -d` |
| Stop all running containers | `docker-compose down` |
| Start a specific service | `docker-compose up -d db` |
| Stop a specific service | `docker-compose stop db` |
| Restart a service | `docker-compose restart db` |
| List all running containers | `docker ps` |
| List all containers (including stopped) | `docker ps -a` |
| View logs for a container | `docker logs <container-name>` |
| Follow logs live (stream output) | `docker logs -f <container-name>` |
| Access a running container’s shell | `docker exec -it <container-name> bash` |
| Run a one-off command inside container | `docker exec -it <container-name> <command>` |

---

## Postgres-Specific Commands

| Purpose | Command |
|----------|----------|
| **Health check — verify DB is responding** | `docker exec -it <container_name> psql -U <username> -d <database_name> -c "SELECT 1;"` <br>Example<br> `docker exec -it container_postgres_dev psql -U postgres -d db_postgress_dev -c "SELECT 1;"` |
| Connect to Postgres via psql inside container | `docker exec -it <container-name> psql -U postgres -d <database-name>` |
| List all databases | `\l` *(inside psql)* |
| List tables | `\dt` *(inside psql)* |
| Quit psql | `\q` |

---

## Volumes & Data

| Purpose | Command |
|----------|----------|
| List all Docker volumes | `docker volume ls` |
| Inspect a specific volume | `docker volume inspect <volume-name>` |
| Remove a volume (deletes DB data!) | `docker volume rm <volume-name>` |

---

## Images & Cleanup

| Purpose | Command |
|----------|----------|
| List all images | `docker images` |
| Remove an image | `docker rmi <image-id>` |
| Remove all stopped containers & unused resources | `docker system prune` |

---

## Troubleshooting

| Purpose | Command |
|----------|----------|
| Check logs when DB won’t start | `docker logs <postgres-container-name>` |
| Verify your current Docker context (e.g., colima) | `docker context ls` |
| Switch to a context | `docker context use <context-name>` |
| View compose project status | `docker-compose ps` |

---

**Tips**
- Use `-d` to run containers *detached* (in the background).  
- Always confirm your Postgres container is running and healthy with the `SELECT 1;` command before debugging deeper.

