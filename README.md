# Project Architecture Overview

## 🎯 Sanbox: TestTube
...

---

## Tech Stack
- **Frontend:** React (prototype UI)  
- **Backend:** Node.js (Fastify/Express)  
- **Database:** PostgreSQL (users, roles, refresh tokens)  
- **Gateway:** Kong (routing, rate limiting, request control)  
- **Auth:** JWT (access & refresh tokens), cookie-based session handling  
- **RBAC:** Postgres-backed roles & permissions enforced in the API  

---

## Layering
- **controllers:** translate HTTP -> service calls, no business logic.
- **services:** orchestrate validation, repositories, token issuance.
- **repositories:** Prisma data access only.
- **lib/helpers:** pure functions (hashing, JWT utils).
- **constants/types:** role names, unions, permissions.

## Running

Run each command at the root.

- Database
  - `colima start` or open docker desktop
  - `docker-compose up -d`

- App
  - `pnpm install`  
  - `pnpm run dev`

## Closing

- Database
  - `colima stop` or stop in docker desktop
  - `docker-compose stop` - Stops containers but does not remove them
  - `docker-compose down` - Stops and removes containers, networks, and optionally --volumes
