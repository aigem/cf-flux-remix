import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { CONFIG } from "~/config";

export function withAuth<T extends LoaderFunction | ActionFunction>(fn: T): T {
  return (async (args) => {
    const request = args.request;
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== CONFIG.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    return fn(args);
  }) as T;
}