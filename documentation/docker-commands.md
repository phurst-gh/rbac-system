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
| List all volumes | `docker volume ls` |
| Inspect volume | `docker volume inspect VOLUME_NAME` |
| Remove volume | `docker volume rm VOLUME_NAME` |
| List all containers (including stopped) | `docker ps -a` |
| View logs for a container | `docker logs <container-name>` |
| Follow logs live (stream output) | `docker logs -f <container-name>` |
| Access a running container’s shell | `docker exec -it <container-name> bash` |
| Run a one-off command inside container | `docker exec -it <container-name> <command>` |
