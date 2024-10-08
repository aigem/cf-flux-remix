import { ImageGenerationService } from "./services/imageGeneration";
import { CONFIG } from "./config";

export function createAppContext(context: any) {
  const imageGenerationService = new ImageGenerationService(context.env, CONFIG);
  return { imageGenerationService };
}