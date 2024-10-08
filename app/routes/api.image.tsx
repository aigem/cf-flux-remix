import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../context";
import { handleError } from "../utils/error";
import { withAuth } from "../middleware/auth";
import { withCors } from "../middleware/cors";

export const loader: LoaderFunction = withCors(withAuth(() => {
  return json({ error: "此 API 端点仅支持 POST 请求" }, { status: 405 });
}));

export const action: ActionFunction = withCors(withAuth(async ({ request, context }) => {
  try {
    const appContext = createAppContext(context);
    const { config, imageGenerationService } = appContext;

    const data = await request.json();
    const { messages, model: requestedModel, stream } = data;
    const userMessage = messages.find((msg: any) => msg.role === "user")?.content;

    if (!userMessage) {
      return json({ error: "未找到用户消息" }, { status: 400 });
    }

    // ... 其余代码保持不变

  } catch (error) {
    return handleError(error);
  }
}));