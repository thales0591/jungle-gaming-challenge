# Base stage
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/auth-service/node_modules ./apps/auth-service/node_modules
COPY --from=dependencies /app/packages ./packages
COPY . .
WORKDIR /app/apps/auth-service
EXPOSE 3333
CMD ["pnpm", "start:dev"]

# Build stage
FROM dependencies AS build
COPY . .
WORKDIR /app/apps/auth-service
RUN pnpm build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/auth-service/node_modules ./apps/auth-service/node_modules
COPY --from=build /app/apps/auth-service/dist ./apps/auth-service/dist
COPY --from=build /app/apps/auth-service/package.json ./apps/auth-service/
WORKDIR /app/apps/auth-service
EXPOSE 3333
CMD ["node", "dist/main.js"]
