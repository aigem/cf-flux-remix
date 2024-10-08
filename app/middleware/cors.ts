import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";

export function withCors<T extends LoaderFunction | ActionFunction>(fn: T): T {
  return (async (args) => {
    const response = await fn(args);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }) as T;
}