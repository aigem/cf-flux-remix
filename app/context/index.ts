import type { AppLoadContext } from "@remix-run/cloudflare";
import { ImageGenerationService } from "../services/imageGeneration";
import { CONFIG } from "../config";

export function createAppContext(context: AppLoadContext) {
  return {
    imageGenerationService: new ImageGenerationService(CONFIG),
    // 其他服务...
  };
}

export type AppContext = ReturnType<typeof createAppContext>;