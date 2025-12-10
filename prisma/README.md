# Prisma

## Common Commands

| Task | Command | Description |
|------|----------|-------------|
| Generate Prisma client | `npx prisma generate` | Builds the TypeScript client (use after schema changes) |
| Validate schema | `npx prisma validate` | Checks for syntax or mapping errors |
| Format schema | `npx prisma format` | Auto-formats your Prisma schema file |
| Push schema (dev only) | `npx prisma db push` | Updates DB instantly without migration files |
| Pull existing DB | `npx prisma db pull` | Imports DB structure into your schema |
| Create + apply migration | `npx prisma migrate dev --name add_users_table` | Generates migration files & syncs DB |
| Apply migrations (prod) | `npx prisma migrate deploy` | Runs all committed migrations |
| Check migration status | `npx prisma migrate status` | Shows drift or pending migrations |
| Reset dev DB | `npx prisma migrate reset` | Drops and recreates dev DB |
| Reset dev DB (force) | `npx prisma migrate reset --force` | Reset without confirmation prompt |
| Seed DB | `npx prisma db seed` | Runs your `prisma/seed.ts` |
| Open Prisma Studio | `npx prisma studio` | Visual GUI for data |

