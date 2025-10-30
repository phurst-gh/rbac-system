# 📒 Postgres-Specific Commands

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
| Remove specific container | `docker rm -f CONTAINER_ID` |

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
