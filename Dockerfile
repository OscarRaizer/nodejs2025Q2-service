FROM node:22.14.0-alpine AS dependencies

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npm cache clean --force

FROM node:22.14.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:22.14.0-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /usr/src/app

COPY --from=dependencies --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=dependencies --chown=nestjs:nodejs /usr/src/app/package*.json ./

COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/generated ./generated

USER nestjs

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
