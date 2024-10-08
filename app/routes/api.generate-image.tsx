import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../context";
import { withAuth } from "../middleware/auth";
import { withCors } from "../middleware/cors";
import { handleError } from "../utils/error";

export const action: ActionFunction = withCors(withAuth(async ({ request, context }) => {
  try {
    const appContext = createAppContext(context);
    const { imageGenerationService } = appContext;

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
}));