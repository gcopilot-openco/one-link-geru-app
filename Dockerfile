# ---- Stage 1: Build ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev=false

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Stage 2: Production ----
FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copia os artefatos compilados
COPY --from=builder /app/dist ./dist

# Expõe a porta que o Cloud Run utiliza
EXPOSE 8080

CMD ["node", "dist/index.js"]
