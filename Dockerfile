# Stage 1: Build & Install Production Dependencies
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production Lightweight Container Environment
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Security: Run application as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY server.js ./

USER appuser
EXPOSE 3000

CMD ["node", "server.js"]
