export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Forward the request directly to the container
      return await env.MYCONTAINER.fetch(request);
    } catch (error) {
      return new Response(`Container error: ${error}`, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;

interface Env {
  MYCONTAINER: Fetcher;
}