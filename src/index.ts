import { Container } from "@cloudflare/containers";

// Define your container class extending Container
export class MyContainer extends Container {
  defaultPort = 80; // Default port your container listens on (nginx default)
  sleepAfter = "30m";  // Sleep after 30 minutes of inactivity

  // Lifecycle method called when container starts
  override onStart(): void {
    console.log('Container successfully started!');
  }

  // Lifecycle method called when container stops
  override onStop(stopParams: any): void {
    console.log('Container stopped with exit code:', stopParams?.exitCode);
    console.log('Container stop reason:', stopParams?.reason);
  }

  // Lifecycle method called on errors
  override onError(error: unknown): any {
    console.error('Container error occurred:', error);
    throw error;
  }

  // Handle incoming requests - forward them to the container
  async fetch(request: Request): Promise<Response> {
    try {
      // Check if container is running, if not, start it and wait for port to be ready
      if (!this.ctx.container.running) {
        console.log("Container not running, starting...");
        await this.startAndWaitForPorts();
        console.log("Container started and port is ready");
      }
      
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