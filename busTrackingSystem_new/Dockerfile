# ---------- Builder Stage ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install -D drizzle-kit@latest

# Install all dependencies (dev + prod) for build
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build
RUN npx drizzle-kit generate

# ---------- Production Stage ----------
FROM node:18-alpine AS production

# Install dumb-init and netcat for DB wait
RUN apk add --no-cache dumb-init netcat-openbsd

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nestjs:nodejs /app/drizzle.config.ts ./ 

# Create uploads directory
RUN mkdir -p uploads/CommentImages && chown -R nestjs:nodejs uploads

# Switch to non-root user
USER nestjs

# Expose app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

COPY start-prod.sh ./start-prod.sh
ENTRYPOINT ["sh", "./start-prod.sh"]

