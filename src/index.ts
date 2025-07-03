import { Container } from "@cloudflare/containers";

// Define your container class extending Container
export class MyContainer extends Container {
  defaultPort = 80; // Default port your container listens on (nginx default)
  sleepAfter = "5m";  // Sleep after 5 minutes of inactivity
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