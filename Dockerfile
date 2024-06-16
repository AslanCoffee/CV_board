# Строительный этап
FROM node:16-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:16-alpine AS production-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build-stage /usr/src/app/dist ./dist
COPY --from=build-stage /usr/src/app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main"]
