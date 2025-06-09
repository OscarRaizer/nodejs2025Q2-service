FROM node:22.14.0-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache dumb-init

FROM base AS deps
RUN apk add --no-cache --virtual .gyp python3 make g++
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --omit=dev --frozen-lockfile
RUN npx prisma generate

RUN npm cache clean --force && \
    rm -rf /root/.npm && \
    find ./node_modules -name "*.md" -delete && \
    find ./node_modules -name "test" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find ./node_modules -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find ./node_modules -name "*.map" -delete && \
    find ./node_modules -name "*.ts" ! -name "*.d.ts" -delete
RUN apk del .gyp

FROM base AS build-deps
RUN apk add --no-cache --virtual .gyp python3 make g++
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --frozen-lockfile
RUN npx prisma generate
RUN apk del .gyp

FROM build-deps AS build
COPY . .
RUN npm run build

FROM base AS production
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs


COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package*.json ./
COPY --from=build --chown=nestjs:nodejs /usr/src/app/prisma ./prisma

USER nestjs
EXPOSE 4000
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]

FROM build-deps AS test
COPY . .
RUN npm run build
CMD ["npm", "run", "test"]
