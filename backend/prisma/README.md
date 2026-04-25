# Database Seed Script

This folder is used for Prisma migrations and optional seed data.

## Running Migrations

```bash
# Create and apply migrations
npx prisma migrate dev --name init

# Apply existing migrations
npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Database Management

```bash
# View database in Studio
npx prisma studio

# Generate Prisma client
npx prisma generate

# Check database connection
npx prisma db execute --stdin < /dev/null
```

## Schema Files

- `schema.prisma` - Database schema definition

## Migrations Directory

- `.gitkeep` - Placeholder for migrations directory
