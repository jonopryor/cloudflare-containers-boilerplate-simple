FROM nginx:alpine

# Copy a simple HTML file for testing
RUN echo '<!DOCTYPE html><html><head><title>Cloudflare Container</title></head><body><h1>Hello from Cloudflare Containers!</h1><p>This container is running on Cloudflare Workers.</p></body></html>' > /usr/share/nginx/html/index.html

EXPOSE 80