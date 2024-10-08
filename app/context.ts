import { ImageGenerationService } from "./services/imageGeneration";
import { createConfig } from "./config";

export function createAppContext(context: any) {
  const env = context.env as Env;
  const config = createConfig(env);
  return {
    env,
    config,
    imageGenerationService: new ImageGenerationService(env, config),
  };
}