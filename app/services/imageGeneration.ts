import { AppError } from '../utils/error';
import { Config } from '../config';

export class ImageGenerationService {
  constructor(private config: Config) {}

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
    if (!this.config.CF_IS_TRANSLATE) {
      return prompt;
    }

    try {
      const response = await this.postRequest(this.config.CF_TRANSLATE_MODEL, {
        messages: [
          {
            role: "system",
            content: `作为 Stable Diffusion Prompt 提示词专家，您将从关键词中创建提示，通常来自 Danbooru 等数据库。
请遵循以下规则：
1. 保持原始关键词的顺序。
2. 将中文关键词翻译成英文。
3. 添加相关的标签以增强图像质量和细节。
4. 使用逗号分隔关键词。
5. 保持简洁，避免重复。
6. 不要使用 "和" 或 "与" 等连接词。
7. 保留原始提示中的特殊字符，如 ()[]{}。
8. 不要添加 NSFW 内容。
9. 输出格式应为单行文本，不包含换行符。`
          },
          {
            role: "user",
            content: `请优化并翻译以下提示词：${prompt}`
          }
        ]
      });

      const jsonResponse = await response.json();
      return jsonResponse.result.response.trim();
    } catch (error) {
      console.error("翻译提示词时出错:", error);
      return prompt; // 如果翻译失败,返回原始提示词
    }
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
    if (this.config.CF_ACCOUNT_LIST.length === 0) {
      throw new AppError('No Cloudflare account configured', 500);
    }
    const cf_account = this.config.CF_ACCOUNT_LIST[Math.floor(Math.random() * this.config.CF_ACCOUNT_LIST.length)];
    const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${cf_account.account_id}/ai/run/${model}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cf_account.token}`,
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