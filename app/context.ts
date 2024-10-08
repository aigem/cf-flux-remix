import { ImageGenerationService } from "./services/imageGeneration";
import { CONFIG, Config } from "./config";

export function createAppContext(context: any) {
  return {
    env: context.env as Env,
    config: CONFIG as Config,
    imageGenerationService: new ImageGenerationService(context.env as Env, CONFIG),
  };
}