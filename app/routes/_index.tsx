import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "../context";
import { CONFIG } from "../config";
import { AppError } from "../utils/error";

export const loader: LoaderFunction = async ({ context }) => {
  const appContext = createAppContext(context);
  const { env, imageGenerationService } = appContext;

  let cfAiStatus = "未连接";
  let kvStatus = "未连接";
  let configStatus = {
    API_KEY: CONFIG.API_KEY ? "已设置" : "未设置",
    CF_TRANSLATE_MODEL: CONFIG.CF_TRANSLATE_MODEL,
    CF_ACCOUNT_ID: CONFIG.CF_ACCOUNT_ID ? "已设置" : "未设置",
    CF_API_TOKEN: CONFIG.CF_API_TOKEN ? "已设置" : "未设置",
    KV_NAMESPACE: CONFIG.KV_NAMESPACE,
    KV_ID: CONFIG.KV_ID,
  };

  console.log("Environment keys:", Object.keys(env));
  console.log("KV_NAMESPACE value:", CONFIG.KV_NAMESPACE);

  try {
    await imageGenerationService.testCfAiConnection();
    cfAiStatus = "已连接";
  } catch (error) {
    console.error("CF AI 连接测试失败:", error);
    if (error instanceof AppError) {
      cfAiStatus = `连接失败: ${error.message}`;
    } else {
      cfAiStatus = "连接失败: 未知错误";
    }
  }

  try {
    if (env.IMAGE_KV) {
      const testKey = `test_key_${Date.now()}`;
      await env.IMAGE_KV.put(testKey, "test_value");
      const testValue = await env.IMAGE_KV.get(testKey);
      await env.IMAGE_KV.delete(testKey);

      if (testValue === "test_value") {
        kvStatus = "已连接";
      } else {
        kvStatus = "连接异常：无法正确读写数据";
      }
    } else {
      console.error("IMAGE_KV not found in env");
      kvStatus = "未找到 IMAGE_KV";
    }
  } catch (error) {
    console.error("KV 连接测试失败:", error);
    kvStatus = "连接失败: " + (error instanceof Error ? error.message : "未知错误");
  }

  return json({ cfAiStatus, kvStatus, configStatus });
};

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
        <li>KV_NAMESPACE: {configStatus.KV_NAMESPACE}</li>
        <li>KV_ID: {configStatus.KV_ID}</li>
      </ul>
    </div>
  );
}
