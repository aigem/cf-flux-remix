import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "../context";

export const loader: LoaderFunction = async ({ context }) => {
  const appContext = createAppContext(context);
  const { env, config, imageGenerationService } = appContext;

  let cfAiStatus = "未连接";
  let kvStatus = "未连接";
  let configStatus = {
    API_KEY: config.API_KEY ? "已设置" : "未设置",
    CF_TRANSLATE_MODEL: config.CF_TRANSLATE_MODEL,
    CF_ACCOUNT_ID: config.CF_ACCOUNT_ID ? "已设置" : "未设置",
    CF_API_TOKEN: config.CF_API_TOKEN ? "已设置" : "未设置",
  };

  try {
    await imageGenerationService.testCfAiConnection();
    cfAiStatus = "已连接";
  } catch (error) {
    console.error("CF AI 连接测试失败:", error);
  }

  try {
    await env.IMAGE_KV.put("test_key", "test_value");
    await env.IMAGE_KV.delete("test_key");
    kvStatus = "已连接";
  } catch (error) {
    console.error("KV 连接测试失败:", error);
  }

  return json({ cfAiStatus, kvStatus, configStatus });
};

// ... 其余代码保持不变

export default function Index() {
  const { cfAiStatus, kvStatus, configStatus } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>欢迎使用 CF Flux Remix</h1>
      <p>CF AI 状态: {cfAiStatus}</p>
      <p>KV 状态: {kvStatus}</p>
      <h2>配置状态：</h2>
      <ul>
        <li>API_KEY: {configStatus.API_KEY}</li>
        <li>CF_TRANSLATE_MODEL: {configStatus.CF_TRANSLATE_MODEL}</li>
        <li>CF_ACCOUNT_ID: {configStatus.CF_ACCOUNT_ID}</li>
        <li>CF_API_TOKEN: {configStatus.CF_API_TOKEN}</li>
      </ul>
    </div>
  );
}
