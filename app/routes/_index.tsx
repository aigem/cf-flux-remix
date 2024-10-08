import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "../context";
import { CONFIG } from "../config";
import { AppError } from "../utils/error";
import { Link } from "@remix-run/react";

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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">CF Flux Remix</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/generate-image"
                className="block w-full text-center px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                白嫖 CF 的 Flux 生成图片
              </Link>
            </li>
            {/* 可以在这里添加更多的导航项 */}
          </ul>
        </nav>
      </div>
    </div>
  );
}
