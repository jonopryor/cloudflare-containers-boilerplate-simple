# Cloudflare Container Boilerplate

A simple boilerplate for deploying containerized applications to Cloudflare Workers using Cloudflare's container runtime.

## Prerequisites

- Node.js 16+ and npm
- Cloudflare account with Workers enabled
- Wrangler CLI (installed as dev dependency)

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/jonopryor/cloudflare-containers-boilerplate-simple.git
   cd cloudflare-containers-boilerplate-simple
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Cloudflare credentials in `.env`:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `CONTAINER_IMAGE`: Your container image URL (optional)

5. Login to Cloudflare (if not using API token):
   ```bash
   npx wrangler login
   ```

## Configuration

The `wrangler.toml` file contains the Worker configuration. By default, it uses `nginx:latest` as the container image.

To use a different container image, you have two options:

1. **Edit wrangler.toml directly**: Change the `image` field in the `[[containers]]` section
2. **Use environment variable**: Set `CONTAINER_IMAGE` and run `npm run deploy:with-image`

## Development

Run the Worker locally:
```bash
npm run dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
# Deploy with default nginx:latest image
npm run deploy

# Deploy with custom container image
CONTAINER_IMAGE=your-image:tag npm run deploy:with-image
```

## Scripts

- `npm run dev` - Run the Worker locally in development mode
- `npm run deploy` - Deploy to Cloudflare Workers with default image
- `npm run deploy:with-image` - Deploy with custom container image from CONTAINER_IMAGE env var
- `npm run type-check` - Run TypeScript type checking

## Container Configuration

The Worker binds to a container with:
- Binding name: `CONTAINER`
- Class name: `MyContainer`
- Default image: `nginx:latest`

You can use any OCI-compliant container image from:
- Docker Hub (e.g., `nginx:latest`, `alpine:latest`)
- GitHub Container Registry (e.g., `ghcr.io/owner/image:tag`)
- Other registries (Quay.io, GCR, etc.)

## How It Works

The worker:
1. Receives incoming HTTP/HTTPS requests
2. Forwards the request directly to the container binding (ports 80/443)
3. Returns the container's response

The container is automatically provisioned and managed by Cloudflare.

## Project Structure

```
├── src/
│   └── index.ts            # Main Worker code (port forwarding logic)
├── wrangler.toml           # Cloudflare Worker configuration
├── wrangler.template.toml  # Template for dynamic image configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Node.js dependencies and scripts
├── .env.example            # Environment variables template
└── DEPLOYMENT.md           # Detailed deployment instructions
```

## Notes

- The container runs in Cloudflare's secure sandbox environment
- Container images are pulled and cached by Cloudflare
- Workers have specific CPU and memory limits
- Not all container features are supported (see Cloudflare docs)
- The worker automatically handles port forwarding for HTTP (80) and HTTPS (443)

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Container Runtime](https://developers.cloudflare.com/workers/runtime-apis/containers/)

## License

ISC