export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Get the Durable Object stub
      const id = env.MY_CONTAINER.idFromName("container");
      const stub = env.MY_CONTAINER.get(id);
      
      // Forward the request to the Durable Object
      return await stub.fetch(request);
    } catch (error) {
      return new Response(`Container error: ${error}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

export class MyContainer extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async fetch(request: Request): Promise<Response> {
    try {
      // Forward the request to the container
      return await this.env.CONTAINER.fetch(request);
    } catch (error) {
      return new Response(`Container error: ${error}`, { status: 500 });
    }
  }
}

interface Env {
  MY_CONTAINER: DurableObjectNamespace;
  CONTAINER: Fetcher;
}