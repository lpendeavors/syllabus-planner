# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile --prefer-offline

# Copy the rest of the application code
COPY . .

# Build the React app using Nx for production
RUN npx nx build uploader --configuration=production

# Stage 2: Serve the pre-built React app using nginx
FROM nginx:alpine AS production

# Copy the build output from the first stage to the nginx html directory
COPY --from=builder /app/dist/apps/uploader /usr/share/nginx/html

# Expose the port that Nginx will serve on
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
