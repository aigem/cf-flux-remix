import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { withAuth } from "../middleware/auth";
import { withCors } from "../middleware/cors";
import { createAppContext } from "../context";

export const loader: LoaderFunction = withCors(withAuth(async ({ context }) => {
  const appContext = createAppContext(context);
  const { config } = appContext;

  const models = Object.entries(config.CUSTOMER_MODEL_MAP).map(([id, path]) => ({ id, path }));

  return json({ models });
}));