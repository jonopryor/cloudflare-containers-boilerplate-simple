import { Container } from "@cloudflare/containers";

// Define your container class extending Container
export class MyContainer extends Container {
  defaultPort = 80; // Default port your container listens on (nginx default)
  sleepAfter = "30m";  // Sleep after 30 minutes of inactivity

  // Handle incoming requests - forward them to the container
  async fetch(request: Request): Promise<Response> {
    try {
      // Forward all requests to the container on the default port (80)
      // This also automatically renews the activity timeout
      return await this.containerFetch(request);
    } catch (error) {
      console.error("Container fetch error:", error);
      return new Response(`Container error: ${error}`, { status: 500 });
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Get the Durable Object ID
      const id = env.MY_CONTAINER.idFromName("default");
      const stub = env.MY_CONTAINER.get(id);
      
      // Forward the request to the Durable Object
      return await stub.fetch(request);
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(`Worker error: ${error}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

interface Env {
  MY_CONTAINER: DurableObjectNamespace<MyContainer>;
}