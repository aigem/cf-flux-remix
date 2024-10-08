import { CONFIG } from '~/config';
import { AppError } from '~/utils/error';

export class ImageGenerationService {
  constructor(private env: Env) {}

  async generateImage(prompt: string, model: string): Promise<string> {
    const isFluxModel = model === CONFIG.CUSTOMER_MODEL_MAP["FLUX.1-Schnell-CF"];
    const translatedPrompt = await this.translatePrompt(prompt, isFluxModel);
    return isFluxModel ? 
      this.generateFluxImage(model, translatedPrompt) :
      this.generateStandardImage(model, translatedPrompt);
  }

  private async translatePrompt(prompt: string, isFluxModel: boolean): Promise<string> {
    if (!CONFIG.CF_IS_TRANSLATE) return prompt;
    const promptModel = this.determinePromptModel();
    return isFluxModel ? 
      await this.getFluxPrompt(prompt, promptModel) :
      await this.getPrompt(prompt, promptModel);
  }

  private determinePromptModel(): string {
    return (CONFIG.USE_EXTERNAL_API && CONFIG.EXTERNAL_API && CONFIG.EXTERNAL_MODEL && CONFIG.EXTERNAL_API_KEY) ?
      CONFIG.EXTERNAL_MODEL : CONFIG.CF_TRANSLATE_MODEL;
  }

  private async getPrompt(prompt: string, model: string): Promise<string> {
    // 实现 getPrompt 逻辑
  }

  private async getFluxPrompt(prompt: string, model: string): Promise<string> {
    // 实现 getFluxPrompt 逻辑
  }

  private async generateStandardImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: 20, guidance: 7.5, strength: 1, width: 1024, height: 1024 };
    const response = await this.postRequest(model, jsonBody);
    return this.storeImage(await response.arrayBuffer());
  }

  private async generateFluxImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: CONFIG.FLUX_NUM_STEPS };
    const response = await this.postRequest(model, jsonBody);
    return this.storeImage(await response.arrayBuffer());
  }

  private async postRequest(model: string, jsonBody: object): Promise<Response> {
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.env.CF_ACCOUNT_ID}/ai/run/${model}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.CF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
    });

    if (!response.ok) {
      throw new AppError('Cloudflare API request failed: ' + response.status, response.status);
    }
    return response;
  }

  private async storeImage(imageBuffer: ArrayBuffer): Promise<string> {
    const key = `image_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await this.env.IMAGE_KV.put(key, imageBuffer, {
      expirationTtl: CONFIG.IMAGE_EXPIRATION,
      metadata: { contentType: 'image/png' }
    });
    return `/image/${key}`;
  }
}