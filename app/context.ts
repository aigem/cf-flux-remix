import { ImageGenerationService } from "./services/imageGeneration";
import { createConfig } from "./config";

export function createAppContext(context: any) {
  const config = (global as any).APP_CONFIG || createConfig(context);
  return {
    env: context.env,
    config,
    imageGenerationService: new ImageGenerationService(context.env, config),
  };
}