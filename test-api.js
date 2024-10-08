const fetch = require('node-fetch');

async function testAPI() {
  const apiKey = 'your_api_key_here';
  const baseUrl = 'http://localhost:8787'; // 假设你的 API 运行在本地的 8787 端口

  // 测试获取模型列表
  const modelsResponse = await fetch(`${baseUrl}/api/models`, {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const models = await modelsResponse.json();
  console.log('Available models:', models);

  // 测试图像生成
  const imageResponse = await fetch(`${baseUrl}/api/generate-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: 'A beautiful sunset over the ocean',
      model: 'SD-XL-Lightning-CF'
    })
  });
  const imageResult = await imageResponse.json();
  console.log('Image generation result:', imageResult);
}

testAPI().catch(console.error);