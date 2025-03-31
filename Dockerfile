FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies only (using --frozen-lockfile for reproducible installs)
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Next.js collects anonymous telemetry data - disable it
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN pnpm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner

WORKDIR /app

# Install pnpm in the runner stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set environment to production
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from build stage
COPY --from=base /app/next.config.ts ./
COPY --from=base /app/package.json ./
COPY --from=base /app/pnpm-lock.yaml ./
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/src/fonts ./src/fonts

# Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]