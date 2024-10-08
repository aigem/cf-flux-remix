import { ImageGenerationService } from "./services/imageGeneration";
import { CONFIG, Config } from "./config";

export function createAppContext(context: any) {
  if (!context || !context.env) {
    throw new Error("Invalid context or missing env in context");
  }
  return {
    env: context.env as Env,
    config: CONFIG as Config,
    imageGenerationService: new ImageGenerationService(context.env as Env, CONFIG),
  };
}