# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client before building
RUN npx prisma generate

RUN npm run build


# ---- Production stage ----
FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN echo 'import { defineConfig } from "prisma/config"; export default defineConfig({ schema: "prisma/schema.prisma", migrations: { path: "prisma/migrations" }, datasource: { url: process.env.DATABASE_URL } });' > prisma.config.js

USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]