import { AppError } from '../utils/error';
import { Config } from '../config';

export class ImageGenerationService {
  constructor(private env: Env, private config: Config) {}

  async generateImage(prompt: string, model: string): Promise<{ prompt: string, translatedPrompt: string, image: string }> {
    const translatedPrompt = await this.translatePrompt(prompt);
    const isFluxModel = model === this.config.CUSTOMER_MODEL_MAP["FLUX.1-Schnell-CF"];
    const imageBase64 = isFluxModel ? 
      await this.generateFluxImage(model, translatedPrompt) :
      await this.generateStandardImage(model, translatedPrompt);

    return {
      prompt,
      translatedPrompt,
      image: imageBase64
    };
  }

  private async translatePrompt(prompt: string): Promise<string> {
    // 实现提示词翻译逻辑
    // 这里可以调用 Cloudflare AI 进行翻译
    // 暂时返回原始提示词
    return prompt;
  }

  private async generateStandardImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: 20, guidance: 7.5, strength: 1, width: 1024, height: 1024 };
    const response = await this.postRequest(model, jsonBody);
    const imageBuffer = await response.arrayBuffer();
    return this.arrayBufferToBase64(imageBuffer);
  }

  private async generateFluxImage(model: string, prompt: string): Promise<string> {
    const jsonBody = { prompt, num_steps: this.config.FLUX_NUM_STEPS };
    const response = await this.postRequest(model, jsonBody);
    const jsonResponse = await response.json();
    return jsonResponse.result.image;
  }

  private async postRequest(model: string, jsonBody: object): Promise<Response> {
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${this.config.CF_ACCOUNT_ID}/ai/run/${model}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.CF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonBody)
      });

      if (!response.ok) {
        throw new AppError(`Cloudflare API request failed: ${response.status}`, response.status);
      }
      return response;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to connect to Cloudflare API', 500);
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return btoa(binary);
  }

  async testCfAiConnection(): Promise<void> {
    const testModel = this.config.CF_TRANSLATE_MODEL;
    const testPrompt = "Hello, world!";
    await this.postRequest(testModel, { messages: [{ role: "user", content: testPrompt }] });
  }
}