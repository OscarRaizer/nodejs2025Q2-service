# Этап зависимостей
FROM node:22.14.0-alpine AS dependencies
WORKDIR /usr/src/app
RUN apk add --no-cache python3 py3-pip make g++ && ln -sf python3 /usr/bin/python
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force
RUN npx prisma generate

# Этап сборки
FROM node:22.14.0-alpine AS builder
WORKDIR /usr/src/app
RUN apk add --no-cache python3 py3-pip make g++
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Финальный образ
FROM node:22.14.0-alpine AS runtime
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
WORKDIR /usr/src/app
COPY --from=dependencies --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=dependencies --chown=nestjs:nodejs /usr/src/app/package*.json ./
COPY --from=dependencies --chown=nestjs:nodejs /usr/src/app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist
USER nestjs
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
