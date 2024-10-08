import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../../context";

export const loader: LoaderFunction = async ({ context }) => {
  console.log("Models route accessed");
  const { config } = createAppContext(context);
  const models = Object.keys(config.CUSTOMER_MODEL_MAP).map(id => ({ id, object: "model" }));
  console.log("Available models:", models);
  return json({ data: models, object: "list" });
};