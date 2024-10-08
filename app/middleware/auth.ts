import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../context";

export function withAuth(fn: LoaderFunction | ActionFunction): LoaderFunction | ActionFunction {
  return async (args) => {
    const { context, request } = args;
    const { config } = createAppContext(context);
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== config.API_KEY) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    return fn(args);
  };
}