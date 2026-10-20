FROM node:24.19.0-trixie-slim AS builder

RUN npm install -g pnpm@11.1.2

# Build context is the monorepo root (see apps/api/docker-compose.yml)
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/dto ./packages/dto
COPY apps/api/package.json ./apps/api/

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/* \
	&& pnpm install --frozen-lockfile --filter servemate-service...

COPY apps/api ./apps/api

# Собираем shared DTO, генерируем Prisma клиент и собираем API
RUN pnpm --filter @servemate/shared-dto build \
	&& pnpm --filter servemate-service exec prisma generate \
	&& pnpm --filter servemate-service build

# ===== Production stage =====
FROM node:24.19.0-trixie-slim

WORKDIR /app

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Копируем монорепо целиком: symlink-и workspace-пакета должны остаться рабочими
COPY --from=builder /app /app

WORKDIR /app/apps/api

EXPOSE 3000

# Запускаем собранное приложение
CMD ["node", "dist/main.js"]
