# Deployment Guide for drc.orro.dev

This guide covers deploying the Debt Recycling Calculator container to Cloudflare Workers.

## Prerequisites

- Cloudflare account with access to the `orro.dev` zone
- Node.js 16+ installed
- Wrangler CLI (included in this project)

## Configuration

The project is configured to deploy to `drc.orro.dev` with the following settings:

- **Worker Name**: `drc-orro-dev`
- **Container Image**: `ghcr.io/shanehull/debtrecyclingcalc.com:latest`
- **Route**: `drc.orro.dev/*`
- **Zone**: `orro.dev`

## Deployment Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```
   This will open a browser window for OAuth authentication.

3. **Deploy the Worker**
   ```bash
   npx wrangler deploy
   ```

## Alternative: Using API Token

For CI/CD or non-interactive environments:

1. Create an API token at https://dash.cloudflare.com/profile/api-tokens
2. Set the environment variable:
   ```bash
   export CLOUDFLARE_API_TOKEN=your-api-token-here
   ```
3. Deploy:
   ```bash
   npx wrangler deploy
   ```

## Verify Deployment

After deployment, visit https://drc.orro.dev to verify the container is running correctly.

## Updating the Container

The worker automatically uses the latest container image. To update:

1. Push new container image to `ghcr.io/shanehull/debtrecyclingcalc.com:latest`
2. Redeploy the worker:
   ```bash
   npx wrangler deploy
   ```

## Troubleshooting

- **Login Issues**: If wrangler login doesn't persist, use an API token instead
- **Route Conflicts**: Ensure no other workers are using the same route pattern
- **Container Errors**: Check container logs in the Cloudflare dashboard

## Local Development

To test locally:
```bash
npm run dev
```

Note: Container functionality may be limited in local development mode.