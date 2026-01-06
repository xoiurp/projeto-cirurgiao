# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL for Prisma runtime
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package files and install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

# Generate Prisma client in production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy firebase service account
COPY firebase-service-account.json ./firebase-service-account.json

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 8080

# Start the application
ENV NODE_ENV=production

CMD ["node", "dist/main"]
