import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "../../context";
import { handleError } from "../../utils/error";

export const loader: LoaderFunction = () => {
  return json({ error: "此 API 端点仅支持 POST 请求" }, { status: 405 });
};

export const action: ActionFunction = async ({ request, context }) => {
  try {
    const appContext = createAppContext(context);
    const { config, imageGenerationService } = appContext;

    const data = await request.json();
    const { messages, model: requestedModel, stream } = data as { messages: any[], model: string, stream: boolean };
    const userMessage = messages.find(msg => msg.role === "user")?.content;

    if (!userMessage) {
      return json({ error: "未找到用户消息" }, { status: 400 });
    }

    const isTranslate = extractTranslate(userMessage);
    const originalPrompt = cleanPromptString(userMessage);
    const model = config.CUSTOMER_MODEL_MAP[requestedModel] || config.CUSTOMER_MODEL_MAP["SD-XL-Lightning-CF"];

    const translatedPrompt = isTranslate ? 
      await imageGenerationService.translatePrompt(originalPrompt, model === config.CUSTOMER_MODEL_MAP["FLUX.1-Schnell-CF"]) : 
      originalPrompt;

    const imageUrl = await imageGenerationService.generateImage(translatedPrompt, model);

    const responseContent = generateResponseContent(originalPrompt, translatedPrompt, imageUrl, model);

    return stream ? 
      handleStreamResponse(responseContent, model) : 
      json({
        id: `chatcmpl-${Date.now()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{ index: 0, message: { role: "assistant", content: responseContent }, finish_reason: "stop" }],
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      });
  } catch (error) {
    return handleError(error);
  }
};

// ... 其余函数保持不变