import worker from "./danmu_api/worker.js";

export async function handler(request: Request): Promise<Response> {
  return await worker.fetch(request, {
    TOKEN: Deno.env.get("TOKEN") ?? "87654321",
    ADMIN_TOKEN: Deno.env.get("ADMIN_TOKEN") ?? "",
    SOURCE_ORDER: Deno.env.get("SOURCE_ORDER") ?? "",
    PLATFORM_ORDER: Deno.env.get("PLATFORM_ORDER") ?? "",
    OTHER_SERVER: Deno.env.get("OTHER_SERVER") ?? "",
    BILIBILI_COOKIE: Deno.env.get("BILIBILI_COOKIE") ?? "",
    DOUBAN_COOKIE: Deno.env.get("DOUBAN_COOKIE") ?? "",
    VOD_SERVERS: Deno.env.get("VOD_SERVERS") ?? "",
    VOD_RETURN_MODE: Deno.env.get("VOD_RETURN_MODE") ?? "",
    VOD_REQUEST_TIMEOUT: Deno.env.get("VOD_REQUEST_TIMEOUT") ?? "",
    RATE_LIMIT_MAX_REQUESTS: Deno.env.get("RATE_LIMIT_MAX_REQUESTS") ?? "",
    UPSTASH_REDIS_REST_URL: Deno.env.get("UPSTASH_REDIS_REST_URL") ?? "",
    UPSTASH_REDIS_REST_TOKEN: Deno.env.get("UPSTASH_REDIS_REST_TOKEN") ?? "",
    UPSTASH_DISABLE_TELEMETRY: Deno.env.get("UPSTASH_DISABLE_TELEMETRY") ?? "1",

  });
}

if (import.meta.main) {
  Deno.serve(handler);
}
