import type { AppLoadContext } from "@remix-run/cloudflare";
import { ImageGenerationService } from "~/services/imageGeneration";

export function createAppContext(context: AppLoadContext) {
  return {
    imageGenerationService: new ImageGenerationService(context.env),
    // 其他服务...
  };
}

export type AppContext = ReturnType<typeof createAppContext>;