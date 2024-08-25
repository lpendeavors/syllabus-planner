# Stage 1: Install dependencies and build the app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the monorepo root
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the entire project to build the API
COPY . .

# Build the NestJS app
RUN npx nx build api

# Stage 2: Create production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json from the monorepo root
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --production

# Copy the pre-built NestJS app from the builder stage
COPY --from=builder /app/dist/apps/api ./dist

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable for production
ENV NODE_ENV=production

# Start the NestJS app
CMD ["node", "dist/main"]
