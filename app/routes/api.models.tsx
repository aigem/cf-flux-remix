import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../context";
import { withAuth } from "../middleware/auth";
import { withCors } from "../middleware/cors";
import { CONFIG } from "../config";

export const loader: LoaderFunction = withCors(withAuth(async ({ context }) => {
  console.log("Models route accessed");
  try {
    const models = Object.keys(CONFIG.CUSTOMER_MODEL_MAP).map(id => ({ id, object: "model" }));
    console.log("Available models:", models);
    return json({ data: models, object: "list" });
  } catch (error) {
    console.error("Error in models loader:", error);
    return json({ error: "Failed to fetch models" }, { status: 500 });
  }
}));