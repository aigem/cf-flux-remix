import { ImageGenerationService } from "./services/imageGeneration";

export function createAppContext(context: any) {
  const env = context.env as Env;
  return {
    env,
    imageGenerationService: new ImageGenerationService(env),
  };
}