import { Container } from "@cloudflare/containers";

// Define your container class extending Container
export class MyContainer extends Container {
  defaultPort = 80; // Default port your container listens on (nginx default)
  sleepAfter = "30m";  // Sleep after 30 minutes of inactivity
  
  // Use manual start to have more control over container startup
  // This helps avoid blockConcurrencyWhile timeouts
  manualStart = true;

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
      // Check if container is running, if not, start it WITHOUT waiting for ports
      // This avoids the blockConcurrencyWhile timeout issue
      if (!this.ctx.container.running) {
        console.log("Container not running, starting...");
        await this.start(); // Just start, don't wait for ports
        
        // Give the container a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Try to forward the request to the container
      // If the port isn't ready yet, we'll catch the error and retry
      try {
        return await this.containerFetch(request);
      } catch (error: any) {
        // If container isn't ready yet, wait a bit and retry once
        if (error.message?.includes('not ready') || error.message?.includes('Connection refused')) {
          console.log("Container not ready, waiting and retrying...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await this.containerFetch(request);
        }
        throw error;
      }
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