# Base stage
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/task-service/package.json ./apps/task-service/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/task-service/node_modules ./apps/task-service/node_modules
COPY --from=dependencies /app/packages ./packages
COPY . .
WORKDIR /app/apps/task-service
EXPOSE 3334
CMD ["pnpm", "start:dev"]

# Build stage
FROM dependencies AS build
COPY . .
WORKDIR /app/apps/task-service
RUN pnpm build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/task-service/node_modules ./apps/task-service/node_modules
COPY --from=build /app/apps/task-service/dist ./apps/task-service/dist
COPY --from=build /app/apps/task-service/package.json ./apps/task-service/
WORKDIR /app/apps/task-service
EXPOSE 3334
CMD ["node", "dist/main.js"]
