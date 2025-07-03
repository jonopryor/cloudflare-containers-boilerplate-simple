FROM nginx:latest

# Basic nginx configuration for Cloudflare container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (nginx default)
EXPOSE 80

# Nginx runs in foreground by default, which is what we want
CMD ["nginx", "-g", "daemon off;"]