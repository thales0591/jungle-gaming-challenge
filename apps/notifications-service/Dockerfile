# Base stage
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/notifications-service/package.json ./apps/notifications-service/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/notifications-service/node_modules ./apps/notifications-service/node_modules
COPY --from=dependencies /app/packages ./packages
COPY . .
WORKDIR /app/apps/notifications-service
EXPOSE 3335
CMD ["pnpm", "start:dev"]

# Build stage
FROM dependencies AS build
COPY . .
WORKDIR /app/apps/notifications-service
RUN pnpm build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/notifications-service/node_modules ./apps/notifications-service/node_modules
COPY --from=build /app/apps/notifications-service/dist ./apps/notifications-service/dist
COPY --from=build /app/apps/notifications-service/package.json ./apps/notifications-service/
WORKDIR /app/apps/notifications-service
EXPOSE 3335
CMD ["node", "dist/main.js"]
