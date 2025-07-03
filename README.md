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

The `wrangler.jsonc` file contains the Worker configuration. By default, it uses `nginx:latest` as the container image.

To use a different container image, you have two options:

1. **Edit wrangler.jsonc directly**: Change the `image` field in the `containers` section
2. **Use environment variable**: Set `CONTAINER_IMAGE` and run `npm run deploy:with-image`

## Development

Run the Worker locally:
```bash
npm run dev
```

## Deployment

Deploy to Cloudflare Workers:

```bash
# Deploy with default welcome-to-docker image
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

The Worker uses the `@cloudflare/containers` package to manage containers:
- Container class: `MyContainer` (extends `Container` from @cloudflare/containers)
- Durable Object binding: `MY_CONTAINER`
- Default port: 80 (nginx default)
- Sleep after: 5 minutes of inactivity
- Default image: `nginx:latest` (or any image listening on port 80)
- Observability: Enabled for container logs

**Note**: The container assumes the upstream image is listening on port 80. No modifications or extra code are needed for the upstream image.

## How It Works

The worker:
1. Receives incoming HTTP/HTTPS requests
2. Uses `getRandom()` to select a container instance (supports load balancing)
3. Forwards the request to the container on port 80
4. Returns the container's response

The container:
- Extends the `Container` class from `@cloudflare/containers`
- Is managed as a Durable Object with automatic lifecycle management
- Sleeps after 5 minutes of inactivity to save resources
- Can be scaled by adjusting `max_instances` in wrangler.toml

## Project Structure

```
├── src/
│   └── index.ts            # Main Worker code with Container class implementation
├── wrangler.jsonc          # Cloudflare Worker configuration (JSON with comments)
├── wrangler.template.jsonc # Template for dynamic image configuration
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
- The worker uses the `@cloudflare/containers` package for container management
- Containers run as Durable Objects for stateful operation
- Default configuration forwards requests to port 8080 on the container

## Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Containers Documentation](https://developers.cloudflare.com/containers/)
- [@cloudflare/containers Package](https://www.npmjs.com/package/@cloudflare/containers)

## License

ISC