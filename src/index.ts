import { Container, getRandom } from "@cloudflare/containers";

// Define the number of container instances for load balancing
const INSTANCE_COUNT = 1;

// Define your container class extending Container
class MyContainer extends Container {
  defaultPort = 8080; // Default port your container listens on
  sleepAfter = "5m";  // Sleep after 5 minutes of inactivity
}

export { MyContainer };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Get a random container instance for load balancing
      // In production, you might want to use more sophisticated routing
      const containerInstance = await getRandom(env.MY_CONTAINER, INSTANCE_COUNT);
      
      // Forward the request to the container
      return await containerInstance.fetch(request);
    } catch (error) {
      console.error("Container error:", error);
      return new Response(`Container error: ${error}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

interface Env {
  MY_CONTAINER: DurableObjectNamespace<MyContainer>;
}