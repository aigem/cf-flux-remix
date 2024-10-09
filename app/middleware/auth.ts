import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getConfig } from "../config";

export function withAuth(fn: LoaderFunction | ActionFunction): LoaderFunction | ActionFunction {
  return async (args) => {
    const { request, context } = args;
    const config = getConfig(context.cloudflare.env);
    
    // 如果是 GET 请求，不进行身份验证
    if (request.method === "GET") {
      return fn(args);
    }

    const authHeader = request.headers.get("Authorization");
    console.log("Auth header:", authHeader);
    console.log("config.API_KEY:", config.API_KEY);
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== config.API_KEY) {
      console.warn("Unauthorized access attempt. Expected API_KEY:", config.API_KEY);
      console.warn("Received API_KEY:", authHeader ? authHeader.split(" ")[1] : "No API key provided");
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    return fn(args);
  };
}