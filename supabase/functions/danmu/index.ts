import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { handler } from "../../../main.ts";

function withCors(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set(
    "access-control-allow-headers",
    "authorization, x-client-info, apikey, content-type",
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function rewriteRequestForDanmu(req: Request): Request {
  const url = new URL(req.url);

  const originalPath = url.pathname;

  url.pathname =
    url.pathname
      .replace(/^\/functions\/v1\/danmu(?=\/|$)/, "")
      .replace(/^\/danmu(?=\/|$)/, "") || "/";

  console.log("rewrite path:", originalPath, "=>", url.pathname);

  return new Request(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
    redirect: req.redirect,
  });
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const rewrittenReq = rewriteRequestForDanmu(req);
  const response = await handler(rewrittenReq);

  return withCors(response);
});
