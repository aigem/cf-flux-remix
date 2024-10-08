import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { CONFIG } from "~/config";

export const loader: LoaderFunction = async () => {
  const models = Object.keys(CONFIG.CUSTOMER_MODEL_MAP).map(id => ({ id, object: "model" }));
  return json({ data: models, object: "list" });
};