# Cloudflare Container Boilerplate

A minimal boilerplate for deploying containers on Cloudflare Workers with automatic port forwarding for HTTP/HTTPS traffic.

**Current Configuration**: Set up for deploying https://github.com/shanehull/debtrecyclingcalc.com to drc.orro.dev

## Features

- Minimal TypeScript worker that forwards ports 80/443 to containers
- Container sourced from public GitHub repository via environment variable
- Simple deployment with latest Wrangler CLI
- Reusable and flexible architecture

## Prerequisites

- Node.js 16+ and npm
- Cloudflare account
- Wrangler CLI (included as dev dependency)

## Quick Start

1. Clone this repository:
```bash
git clone <your-repo-url>
cd cloudflare-container-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Login to Cloudflare (interactive):
```bash
npx wrangler login
```

4. Deploy to Cloudflare:
```bash
npx wrangler deploy
```

The worker will be deployed to https://drc.orro.dev

## Customizing for Your Container

To use a different container:

1. Update `wrangler.toml`:
   - Change `name` to your worker name
   - Update `image` to your container image URL
   - Modify `pattern` and `zone_name` for your domain

2. Update the `GITHUB_REPO_URL` environment variable

## Configuration

### Environment Variables

- `GITHUB_REPO_URL`: The public GitHub repository URL containing your container code

### wrangler.toml

The configuration file includes:
- Worker name and entry point
- Container binding configuration
- Default environment variable setup

## Development

Run the worker locally:
```bash
npm run dev
```

Type check the code:
```bash
npm run type-check
```

## How It Works

The worker:
1. Receives incoming HTTP/HTTPS requests
2. Forwards the request directly to the container binding
3. Returns the container's response

The container is defined in `wrangler.toml` and automatically provisioned by Cloudflare.

## Deployment

Deploy to production:
```bash
npm run deploy
```

For environment-specific deployments:
```bash
wrangler deploy --env production
```

## Architecture

```
src/index.ts      # Minimal worker that handles port forwarding
wrangler.toml     # Cloudflare configuration
tsconfig.json     # TypeScript configuration
package.json      # Project dependencies and scripts
```

## License

ISC# cloudflare-containers-boilerplate-simple
