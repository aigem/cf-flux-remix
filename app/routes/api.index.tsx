import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../context";
import { withAuth } from "../middleware/auth";
import { handleError } from "../utils/error";

export const loader: LoaderFunction = withAuth(async ({ context }) => {
  try {
    const { imageGenerationService } = createAppContext(context);
    const models = Object.keys(imageGenerationService.config.CUSTOMER_MODEL_MAP).map(id => ({ id, object: "model" }));
    return json({ data: models, object: "list" });
  } catch (error) {
    return handleError(error);
  }
});

export const action: ActionFunction = withAuth(async ({ request, context }) => {
  try {
    const { imageGenerationService } = createAppContext(context);
    const data = await request.json();
    const { prompt, model } = data;

    if (!prompt || !model) {
      return json({ error: "Missing prompt or model" }, { status: 400 });
    }

    const result = await imageGenerationService.generateImage(prompt, model);
    return json(result);
  } catch (error) {
    return handleError(error);
  }
});