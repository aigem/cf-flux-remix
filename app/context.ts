import { ImageGenerationService } from "./services/imageGeneration";
import { CONFIG } from "./config";

export function createAppContext(context: { env: Env }) {
  return {
    imageGenerationService: new ImageGenerationService(context.env, CONFIG),
  };
}