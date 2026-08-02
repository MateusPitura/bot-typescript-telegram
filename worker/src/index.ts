export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/updateGroupList") {
      
    }

    return new Response("Not Found", {
      status: 404,
    });
  },
} satisfies ExportedHandler<Env>;