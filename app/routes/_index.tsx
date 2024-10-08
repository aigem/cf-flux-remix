import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "~/context";

export const loader: LoaderFunction = async ({ context }) => {
  const appContext = createAppContext(context);
  const { env, imageGenerationService } = appContext;

  let cfAiStatus = "未连接";
  let kvStatus = "未连接";

  try {
    // 测试 CF AI 连接
    await imageGenerationService.testCfAiConnection();
    cfAiStatus = "已连接";
  } catch (error) {
    console.error("CF AI 连接测试失败:", error);
  }

  try {
    // 测试 KV 连接
    await env.IMAGE_KV.put("test_key", "test_value");
    await env.IMAGE_KV.delete("test_key");
    kvStatus = "已连接";
  } catch (error) {
    console.error("KV 连接测试失败:", error);
  }

  return json({ cfAiStatus, kvStatus });
};

export default function Index() {
  const { cfAiStatus, kvStatus } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>欢迎使用 CF Flux Remix</h1>
      <p>CF AI 状态: {cfAiStatus}</p>
      <p>KV 状态: {kvStatus}</p>
    </div>
  );
}
