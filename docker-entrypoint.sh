#!/bin/sh
# Prepares the database on every start: applies pending migrations and
# (idempotently) seeds the business card data, then starts the API.
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database..."
node dist-seed/seed.js

exec node dist/main.js
