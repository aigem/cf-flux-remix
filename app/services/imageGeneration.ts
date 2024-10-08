import { CONFIG } from '~/config';
import { AppError } from '~/utils/error';

export class ImageGenerationService {
  constructor(private env: Env) {}

  async generateImage(prompt: string, model: string): Promise<string> {
    const isFluxModel = model === CONFIG.CUSTOMER_MODEL_MAP["FLUX.1-Schnell-CF"];
    return isFluxModel ? 
      this.generateFluxImage(model, prompt) :
      this.generateStandardImage(model, prompt);
  }

  async translatePrompt(prompt: string, isFluxModel: boolean): Promise<string> {
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
    const messages = [
      { role: "system", content: "你是一个专业的提示词优化助手。请优化以下提示词，使其更适合生成高质量的图像。保持原意的同时，增加细节和描述性语言。" },
      { role: "user", content: prompt }
    ];
    const response = await this.postRequest(model, { messages });
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
  }

  private async getFluxPrompt(prompt: string, model: string): Promise<string> {
    const messages = [
      { role: "system", content: "你是一个专业的提示词优化助手。请优化以下提示词，使其更适合使用 Flux 模型生成高质量的图像。保持原意的同时，增加细节和描述性语言。" },
      { role: "user", content: prompt }
    ];
    const response = await this.postRequest(model, { messages });
    const jsonResponse = await response.json();
    return jsonResponse.result.response;
  }

  private async generateStandardImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: 20, guidance: 7.5, strength: 1, width: 1024, height: 1024 };
    const response = await this.postRequest(model, jsonBody);
    return this.storeImage(await response.arrayBuffer());
  }

  private async generateFluxImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: CONFIG.FLUX_NUM_STEPS };
    const response = await this.postRequest(model, jsonBody);
    const jsonResponse = await response.json();
    const base64ImageData = jsonResponse.result.image;
    const imageBuffer = this.base64ToArrayBuffer(base64ImageData);
    return this.storeImage(imageBuffer);
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

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}