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

Run each command at the root.

- Database
  - `colima start`
  - `docker-compose up -d`

- App
  - `pnpm install`  
  - `pnpm run dev`
