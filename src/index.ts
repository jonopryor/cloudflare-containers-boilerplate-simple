import { Container } from "@cloudflare/containers";

// Define your container class extending Container
export class MyContainer extends Container {
  defaultPort = 80; // Default port your container listens on (nginx default)
  sleepAfter = "5m";  // Sleep after 5 minutes of inactivity

  async fetch(request: Request): Promise<Response> {
    try {
      // Ensure the container is started
      const isRunning = await this.isRunning();
      if (!isRunning) {
        await this.start();
        
        // Wait a moment for the container to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Forward the request to the container
      const url = new URL(request.url);
      url.port = String(this.defaultPort);
      
      return await fetch(url, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        // @ts-ignore
        duplex: 'half',
      });
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