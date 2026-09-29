# syntax=docker/dockerfile:1

# ---- build: install all deps, generate Prisma client, compile app and seed ----
# node:alpine already ships libssl3 required by Prisma engines (linux-musl-openssl-3.0.x)
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build && npm run build:seed \
  && npm prune --omit=dev

# ---- runtime: production deps + compiled output only ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/prisma ./prisma
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/dist-seed ./dist-seed
COPY --chown=node:node docker-entrypoint.sh ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/health" || exit 1
ENTRYPOINT ["./docker-entrypoint.sh"]
