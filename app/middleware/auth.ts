import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { CONFIG } from "../config";

export function withAuth(fn: LoaderFunction | ActionFunction): LoaderFunction | ActionFunction {
  return async (args) => {
    const { request } = args;
    const authHeader = request.headers.get("Authorization");
    console.log("Auth header:", authHeader);
    console.log("CONFIG.API_KEY:", CONFIG.API_KEY);
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== CONFIG.API_KEY) {
      console.warn("Unauthorized access attempt. Expected API_KEY:", CONFIG.API_KEY);
      console.warn("Received API_KEY:", authHeader ? authHeader.split(" ")[1] : "No API key provided");
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    return fn(args);
  };
}