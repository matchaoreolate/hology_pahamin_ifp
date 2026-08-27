# ─────────────────────────────────────────────
# Stage 1: Builder
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace manifests (root level)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all package.json files first for layer caching
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install all deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared

# Generate Prisma client
RUN pnpm --filter @pahamin/api exec prisma generate

# Build NestJS
RUN pnpm --filter @pahamin/api build

# ─────────────────────────────────────────────
# Stage 2: Production Runner
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace manifests
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built output and prisma schema
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0 \
     ./node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0

WORKDIR /app/apps/api

EXPOSE 3001

# Run migrations then start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
