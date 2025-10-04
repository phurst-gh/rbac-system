# rbac-auth-gateway

A minimal **full-stack prototype** showcasing authentication, refresh tokens, and **role-based access control (RBAC)** behind an API gateway.

## Tech Stack
- **Frontend:** React (prototype UI)  
- **Backend:** Node.js (Fastify/Express)  
- **Database:** PostgreSQL (users, roles, refresh tokens)  
- **Gateway:** Kong (routing, rate limiting, request control)  
- **Auth:** JWT (access & refresh tokens), cookie-based session handling  
- **RBAC:** Postgres-backed roles & permissions enforced in the API  

## Features
- Login + JWT/refresh token flow  
- Access control via roles (e.g., user, admin)  
- Protected CRUD API endpoints (example: todos)  
- API gateway enforcing a single entry point  
- Minimal Docker setup for database and gateway  - docker for dev only (for now) 
- Websockets used for instant chat between users - can this be done for free?

## Purpose
This project was built as a **prototype system** to demonstrate secure architecture patterns, combining:  
- **Edge security** (Kong gateway)  
- **Application-level RBAC** (Postgres + Node API)  
- **Modern full-stack flow** (React client → gateway → API → database)  

## Steps
- Step 1 — Tiny typescript API ✅
- Step 2 — Add postgres DB through Supabase

## Flow (simplified)

React (TS): Frontend UI code + calls to sever.<br>
↓<br>
Node (TS): API/server code.<br>
↓<br>
Prisma: schema + type-safe queries + migrations (ORM).<br>
↓<br>
Postgres: relational DB that stores data and speaks SQL.