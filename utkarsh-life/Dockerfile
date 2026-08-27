# Node.js Alpine lightweight base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production assets
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built assets and server from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package*.json ./

# Expose server port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start standalone web server
CMD ["node", "server.js"]
