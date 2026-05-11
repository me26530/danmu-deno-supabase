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
function rewriteRequestForDanmu(req: Request): Request {
  const url = new URL(req.url);

  const originalPath = url.pathname;

  url.pathname =
    url.pathname
      .replace(/^\/functions\/v1\/danmu(?=\/|$)/, "")
      .replace(/^\/danmu(?=\/|$)/, "") || "/";

  // 兼容播放器手动搜索可能使用的不同路径
  if (
    url.pathname.includes("/api/v2/search/episodes") ||
    url.pathname.match(/\/api\/v2\/search\/?$/)
  ) {
    url.pathname = url.pathname
      .replace("/api/v2/search/episodes", "/api/v2/search/anime")
      .replace(/\/api\/v2\/search\/?$/, "/api/v2/search/anime");
  }

  // 兼容不同播放器的搜索参数名
  if (url.pathname.includes("/api/v2/search/anime")) {
    const keyword =
      url.searchParams.get("keyword") ||
      url.searchParams.get("anime") ||
      url.searchParams.get("q") ||
      url.searchParams.get("query") ||
      url.searchParams.get("title") ||
      url.searchParams.get("name");

    if (keyword && !url.searchParams.get("keyword")) {
      url.searchParams.set("keyword", keyword);
    }
  }

  console.log(
    "rewrite path:",
    originalPath,
    "=>",
    url.pathname,
    url.search,
  );

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
