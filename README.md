# Home Library Service

A RESTful service for managing a music library, built with **NestJS**, **Prisma**, and **PostgreSQL**, and containerized using **Docker**. The application supports managing users, artists, albums, tracks, and favorites, with a Swagger UI for API documentation.

## Prerequisites

- [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads) for cloning the repository
- (Optional) [Node.js](https://nodejs.org/en/download/) (v22.14.0 or higher) for local development or running tests outside Docker

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/OscarRaizer/nodejs2025Q2-service/tree/Containerization_and_Database
   ```

2. **Create `.env` file**:
   Copy the example environment file and adjust as needed:

   ```bash
   cp .env.example .env
   ```

   Example `.env` content (see `.env.example` for all variables):

   ```env
   PORT=4000
   NODE_ENV=production
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=backend
   DATABASE_URL=postgresql://postgres:postgres@db:5432/backend

   CRYPT_SALT=10
   JWT_SECRET_KEY=secret123123
   JWT_SECRET_REFRESH_KEY=secret123123
   TOKEN_EXPIRE_TIME=1h
   TOKEN_REFRESH_EXPIRE_TIME=24h
   ```

3. **Build and run with Docker**:
   Start the application and database:
   ```bash
   docker compose up --build
   ```
   - The application will be available at `http://localhost:4000`.
   - Swagger API documentation is accessible at `http://localhost:4000/doc`.

## Development Mode

To enable hot reloading for development, use the `dev` profile:

```bash
docker compose --profile dev up --build
```

- This uses `Dockerfile.dev` and mounts `./src` and `./prisma` for live code updates.
- The development server runs at `http://localhost:4000`.

## Testing

### Running Tests in Docker

Run tests in a container using the `test` profile:

```bash
docker compose --profile test up --build
```

This builds the `test` stage from `Dockerfile` and executes `npm run test`.

Alternatively, run tests in an existing dev container:

```bash
docker compose --profile dev up
```

```bash
docker ps
```

```bash
docker exec -it CONTAINER ID HERE sh
```

```bash
npm run test
```

```bash
npm run lint
```
