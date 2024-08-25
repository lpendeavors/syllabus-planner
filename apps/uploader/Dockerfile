# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG REACT_APP_API_URL

# Pass the API URL into the environment
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy the root-level package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies for the entire monorepo (including uploader)
RUN npm install

# Copy the rest of the application code
COPY . .

# Inject the API URL into the React app during build
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env

# Build the React app using Nx for production
RUN npx nx build uploader --configuration=production --skip-nx-cache

# Stage 2: Serve the pre-built React app using nginx
FROM nginx:alpine AS production

# Copy the build output from the first stage to the nginx html directory
COPY --from=builder /app/dist/apps/uploader /usr/share/nginx/html

# Expose the port Nginx will serve on
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
