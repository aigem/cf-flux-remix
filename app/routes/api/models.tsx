import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { withCors } from "~/middleware/cors";
import { withAuth } from "~/middleware/auth";
import { CONFIG } from "~/config";

export const loader: LoaderFunction = withCors(withAuth(() => {
  const models = Object.keys(CONFIG.CUSTOMER_MODEL_MAP).map(id => ({ id, object: "model" }));
  return json({ data: models, object: "list" });
}));