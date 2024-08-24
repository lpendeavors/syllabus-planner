# Stage 1: Serve the pre-built React app using nginx
FROM nginx:alpine AS production

# Copy the build output from dist/apps/uploader to the nginx html directory
COPY dist/apps/uploader /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
