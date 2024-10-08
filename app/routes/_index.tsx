import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "../context";
import { CONFIG } from "../config";
import { AppError } from "../utils/error";

export const loader: LoaderFunction = async ({ context }) => {
  console.log("Loader started");
  let appContext;
  try {
    appContext = createAppContext(context);
    console.log("App context created");
  } catch (error) {
    console.error("Error creating app context:", error);
    return json({ error: "Failed to create app context" }, { status: 500 });
  }

  const { imageGenerationService } = appContext;

  let cfAiStatus = "未连接";
  let configStatus = {
    API_KEY: CONFIG.API_KEY ? "已设置" : "未设置",
    CF_TRANSLATE_MODEL: CONFIG.CF_TRANSLATE_MODEL,
    CF_ACCOUNT_ID: CONFIG.CF_ACCOUNT_ID ? "已设置" : "未设置",
    CF_API_TOKEN: CONFIG.CF_API_TOKEN ? "已设置" : "未设置",
  };

  try {
    await imageGenerationService.testCfAiConnection();
    cfAiStatus = "已连接";
  } catch (error) {
    console.error("CF AI 连接测试失败:", error);
    cfAiStatus = error instanceof AppError ? `连接失败: ${error.message}` : "连接失败: 未知错误";
  }

  console.log("Loader completed");
  return json({ cfAiStatus, configStatus });
};

export default function Index() {
  const { cfAiStatus, configStatus } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>欢迎使用 CF Flux Remix</h1>
      <p>CF AI 状态: {cfAiStatus}</p>
      <h2>配置状态：</h2>
      <ul>
        {Object.entries(configStatus).map(([key, value]) => (
          <li key={key}>{key}: {value}</li>
        ))}
      </ul>
    </div>
  );
}
