import { Container } from 'cloudflare:containers';

export class MyContainer extends Container {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		
		// Forward the request to our Go server running in the container
		const containerUrl = new URL(url.pathname + url.search, 'http://localhost:8080');
		
		return fetch(containerUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		// Route handling
		if (url.pathname === '/') {
			return new Response('Container Example API\n\nAvailable endpoints:\n- GET /container - Get a container instance\n- GET /random - Get a random container\n- GET /health - Check container health', {
				headers: { 'Content-Type': 'text/plain' },
			});
		}
		
		// Get a specific container instance
		if (url.pathname === '/container') {
			const id = env.MY_CONTAINER.idFromName('main-container');
			const container = env.MY_CONTAINER.get(id);
			return container.fetch(request);
		}
		
		// Get a random container instance
		if (url.pathname === '/random') {
			const id = env.MY_CONTAINER.newUniqueId();
			const container = env.MY_CONTAINER.get(id);
			return container.fetch(request);
		}
		
		// Health check endpoint
		if (url.pathname === '/health') {
			const id = env.MY_CONTAINER.idFromName('health-check');
			const container = env.MY_CONTAINER.get(id);
			return container.fetch(request);
		}
		
		// Forward all other requests to a container
		const id = env.MY_CONTAINER.idFromName('default');
		const container = env.MY_CONTAINER.get(id);
		return container.fetch(request);
	},
};