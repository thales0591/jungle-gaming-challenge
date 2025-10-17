# Base stage
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/api-gateway/openapi.yaml ./apps/api-gateway/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules
COPY --from=dependencies /app/packages ./packages
COPY . .
WORKDIR /app/apps/api-gateway
EXPOSE 4000
CMD ["pnpm", "start:dev"]

# Build stage
FROM dependencies AS build
COPY . .
WORKDIR /app/apps/api-gateway
RUN pnpm build

# Production stage
FROM base AS production
ENV NODE_ENV=production
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/api-gateway/node_modules ./apps/api-gateway/node_modules
COPY --from=build /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=build /app/apps/api-gateway/openapi.yaml ./apps/api-gateway/
COPY --from=build /app/apps/api-gateway/package.json ./apps/api-gateway/
WORKDIR /app/apps/api-gateway
EXPOSE 4000
CMD ["node", "dist/main.js"]
