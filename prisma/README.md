# Prisma

## Common Commands

| Task | Command | Description |
|------|----------|-------------|
| Generate Prisma client | `npx prisma generate` | Builds the TypeScript client (use after schema changes) |
| Validate schema | `npx prisma validate` | Checks for syntax or mapping errors |
| Format schema | `npx prisma format` | Auto-formats your Prisma schema file |
| Push schema (dev only) | `npx prisma db push` | Updates DB instantly without migration files |
| Pull existing DB | `npx prisma db pull` | Imports DB structure into your schema |
| Create + apply migration | `npx prisma migrate dev --name <description>` | Generates migration files & syncs DB |
| Apply migrations (prod) | `npx prisma migrate deploy` | Runs all committed migrations |
| Check migration status | `npx prisma migrate status` | Shows drift or pending migrations |
| Reset dev DB | `npx prisma migrate reset` | Drops and recreates dev DB |
| Reset dev DB (force) | `npx prisma migrate reset --force` | Reset without confirmation prompt |
| Seed DB | `npx prisma db seed` | Runs your `prisma/seed.ts` |
| Open Prisma Studio | `npx prisma studio` | Visual GUI for data |

## Helpful Tips
### Close down and wipe everythign to start again
- Step 1: Stop everything
  - docker-compose down
- Step 2: Delete the old database volume (this removes all data)
  - docker volume rm rbac-system_data_postgres_dev
- Step 3: Delete the entire migrations directory
  - rm -rf prisma/migrations
- Step 4: Create new migrations file based on schema and apply to database
  - npx prisma migrate dev --name some_name_here_eg_innit
- Step 5: Start fresh containers with new database
  - docker-compose up -d
- Step 6: Wait a few seconds, then apply migrations
  - sleep 3 && npx prisma migrate deploy
- Step 7: Seed test data
  - npx prisma db seed
- Step 8: Verify it worked
  - npx prisma studio