# CF Flux Remix

CF Flux Remix 是一个基于 Cloudflare Workers 和 Remix 框架的图像生成应用。它利用 Cloudflare 的 AI 模型来生成图像，并提供了一个用户友好的界面和 API 接口来与这些模型进行交互。

## 功能特点

- 使用 Cloudflare 的 AI 模型生成图像【免费】
- 支持多种图像生成模型，包括 Flux 和标准模型
- 提供 API 接口以便集成到其他应用中
- 支持提示词翻译和优化
- 一键部署
- 响应式设计，现代设计
- 图片生成不受限制(不经审查)，你懂的

## 快速开始

### 前置条件

- CloudFlare账号
- Github/Gitlab账号

## 安装 
### [视频教程](https://www.bilibili.com/video/BV1Wz2NYyEmW/)

1. 克隆（Fork）仓库：
   ```bash
   https://github.com/yourusername/cf-flux-remix
   ```

2. 完成部署：
  在CloudFlare中操作
   ```bash
   1、新建一个worker
   名称为 free-flux . 注意此名称必须与Github中的Wrangler.toml文件中的名称一致。
   
   2、worker后台设置中绑定Github仓库
   绑定Fork的本仓库
   
   3、填入构建命令等
   构建命令（可选）： pnpm i
   部署命令： pnpm run deploy

   4、触发CF Workers中部署
   随便改动一下仓库readme文件，提交后自动触发部署

   5、部署完成
   部署完成后打开相应网站来使用，API使用看下面的说明
   记得在worker后台设置环境变量，替换自己的CF账号ID及API令牌
   API令牌要有Workers AI 的读取及编辑权限。

   ```

### 开发

运行开发服务器：
```
pnpm run dev
```

### 构建和部署

1. 另一种方法部署到 Cloudflare Workers：
   ```
   pnpm run deploy
   ```
  
## 环境变量

在 `wrangler.toml` 文件中设置以下程序变量：

- `API_KEY`: API 密钥，用于身份验证
- `CF_ACCOUNT_LIST`: Cloudflare 账户列表，JSON 格式
- `CF_TRANSLATE_MODEL`: 翻译模型 ID
- `CF_IS_TRANSLATE`: 是否启用翻译功能
- `USE_EXTERNAL_API`: 是否使用外部 API
- `EXTERNAL_API`: 外部 API 地址
- `EXTERNAL_MODEL`: 外部模型 ID
- `EXTERNAL_API_KEY`: 外部 API 密钥
- `FLUX_NUM_STEPS`: Flux 模型的步数
- `CUSTOMER_MODEL_MAP`: 模型映射，JSON 格式

## API 文档

### 生成图像

- 端点：`/api/image`
- 方法：POST
- 请求头：
  - `Authorization: Bearer your_api_key_here`
  - `Content-Type: application/json`
- 请求体：
  ```json
  {
    "messages": [{"role": "user", "content": "图像描述"}],
    "model": "模型ID",
    "stream": false
  }
  ```
- 响应：
  ```json
  {
    "prompt": "原始提示词",
    "translatedPrompt": "翻译后的提示词",
    "image": "生成的图像数据（Base64编码）"
  }
  ```

### 获取可用模型

- 端点：`/api/models`
- 方法：GET
- 请求头（可选）：
  - `Authorization: Bearer your_api_key_here`
- 响应：
  ```json
  {
    "models": [
      {"id": "DS-8-CF", "name": "DreamShaper 8"},
      {"id": "SD-XL-Bash-CF", "name": "Stable Diffusion XL Base"},
      {"id": "SD-XL-Lightning-CF", "name": "Stable Diffusion XL Lightning"},
      {"id": "FLUX.1-Schnell-CF", "name": "Flux 1 Schnell"}
    ]
  }
  ```

## 使用示例

### 使用 cURL 生成图像
```
bash
curl -X POST https://your-worker-url.workers.dev/api/image \
-H "Authorization: Bearer your_api_key_here" \
-H "Content-Type: application/json" \
-d '{
"messages": [{"role": "user", "content": "一只可爱的猫咪"}],
"model": "DS-8-CF"
}'
```

### 使用 Python 请求 API
```
python
import requests
import json
url = "https://your-worker-url.workers.dev/api/image"
headers = {
"Authorization": "Bearer your_api_key_here",
"Content-Type": "application/json"
}
data = {
"messages": [{"role": "user", "content": "一只可爱的猫咪"}],
"model": "DS-8-CF"
}
response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()
print(f"原始提示词: {result['prompt']}")
print(f"翻译后的提示词: {result['translatedPrompt']}")
print(f"生成的图像数据: {result['image'][:50]}...") # 只打印前50个字符
```

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 常见问题

1. Q: 如何添加新的模型？
   A: 在 `wrangler.toml` 文件中的 `CUSTOMER_MODEL_MAP` 变量中添加新的模型 ID 和对应的 Cloudflare AI 模型路径。

2. Q: 如何禁用翻译功能？
   A: 在 `wrangler.toml` 文件中将 `CF_IS_TRANSLATE` 设置为 "false"。

3. Q: 如何调整 Flux 模型的步数？
   A: 修改 `wrangler.toml` 文件中的 `FLUX_NUM_STEPS` 值。

## 故障排除

如果遇到问题，请检查以下几点：

1. 确保所有环境变量都已正确设置。
2. 检查 Cloudflare 账户和 API 令牌是否有效。
3. 确保使用的模型 ID 在 `CUSTOMER_MODEL_MAP` 中存在。
4. 查看 Cloudflare Workers 的日志以获取更详细的错误信息。
5. The name in `wrangler.toml` must match the name of your Worker.

如果问题仍然存在，请开一个 issue 并提供详细的错误信息和复现步骤。

### [视频教程](https://www.bilibili.com/video/BV1Wz2NYyEmW/)