import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { createAppContext } from "../context";
import { AppError } from "../utils/error";
import type { AppLoadContext } from "@remix-run/cloudflare";

export const loader: LoaderFunction = async ({ context }: { context: AppLoadContext }) => {
  console.log("Loader started");
  const appContext = createAppContext(context);
  const { imageGenerationService, config } = appContext;

  let cfAiStatus = "未连接";
  let configStatus = {
    API_KEY: config.API_KEY ? "已设置" : "未设置",
    CF_TRANSLATE_MODEL: config.CF_TRANSLATE_MODEL,
    CF_ACCOUNT_LIST: config.CF_ACCOUNT_LIST.length > 0 ? "已设置" : "未设置",
    CUSTOMER_MODEL_MAP: Object.keys(config.CUSTOMER_MODEL_MAP).length > 0 ? "已设置" : "未设置",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-lg w-full">
        <h1 className="text-5xl font-extrabold text-white mb-8 text-center">CF Flux Remix</h1>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/generate-image"
                className="block w-full text-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                白嫖 CF 的 Flux 生成图片
              </Link>
            </li>
            <li>
              <Link
                to="/idioms/game"
                className="block w-full text-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                看图猜成语游戏
              </Link>
            </li>
            <li>
              <Link
                to="https://github.com/aigem/cf-flux-remix"
                className="block w-full text-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                访问 Github
              </Link>
            </li>
            <li>
              <Link
                to="https://github.com/aigem/CFr2-webdav"
                className="block w-full text-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Workers+R2搭建个人免费webdav网盘
              </Link>
            </li>
            <li>
              <Link
                to="https://github.com/aigem/CFr2-webdav"
                className="block w-full text-center px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                自行搭建：全平台视频下载助手
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">系统状态</h2>
          <p>CF AI 状态: <span className={cfAiStatus === "已连接" ? "text-green-400" : "text-red-400"}>{cfAiStatus}</span></p>
          <p>API Key: <span className={configStatus.API_KEY === "已设置" ? "text-green-400" : "text-red-400"}>{configStatus.API_KEY}</span></p>
          <p>翻译模型: {configStatus.CF_TRANSLATE_MODEL}</p>
          <p>CF 账户列表: <span className={configStatus.CF_ACCOUNT_LIST === "已设置" ? "text-green-400" : "text-red-400"}>{configStatus.CF_ACCOUNT_LIST}</span></p>
          <p>自定义模型映射: <span className={configStatus.CUSTOMER_MODEL_MAP === "已设置" ? "text-green-400" : "text-red-400"}>{configStatus.CUSTOMER_MODEL_MAP}</span></p>
        </div>
      </div>
    </div>
  );
}
