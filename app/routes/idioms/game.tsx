import { useLoaderData, useActionData, Form, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/cloudflare";
import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { useState, useEffect } from "react";
import { createAppContext } from "../../context";
import type { AppLoadContext } from "@remix-run/cloudflare";

type GameData = {
  "成语": string;
  "成语解释": string;
  "混淆成语1": string;
  "混淆成语2": string;
  "图1": string;
  "图2": string;
  "图3": string;
  "图4": string;
};

export const loader: LoaderFunction = async ({ request, context }: { request: Request; context: AppLoadContext }) => {
  const url = new URL(request.url);
  const isNewGame = url.searchParams.get("new") === "true";

  if (isNewGame) {
    const appContext = createAppContext(context);
    const { config } = appContext;
    const webhookUrl = config.CHENGYU_WEBHOOK_URL || "https://aigenai-aiflow.hf.space/webhook/chengyu";

    try {
      const response = await fetch(webhookUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gameData: GameData = await response.json();
      return json(gameData);
    } catch (error) {
      console.error("获取成语数据失败:", error);
      return json({ error: "获取成语数据失败,请稍后再试。" }, { status: 500 });
    }
  }

  return json({});
};

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const selectedIdiom = formData.get("selectedIdiom");
  const correctIdiom = formData.get("correctIdiom");

  if (selectedIdiom === correctIdiom) {
    return json({ result: "正确" });
  } else {
    return json({ result: "错误" });
  }
};

export default function Game() {
  const loaderData = useLoaderData<GameData | { error?: string }>();
  const actionData = useActionData();
  const [currentImage, setCurrentImage] = useState(0);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const submit = useSubmit();

  const images = gameData ? [gameData["图1"], gameData["图2"], gameData["图3"], gameData["图4"]] : [];

  useEffect(() => {
    if ('成语' in loaderData) {
      setGameData(loaderData as GameData);
      setGameStarted(true);
      setRound((prev) => prev + 1);
    }
  }, [loaderData]);

  useEffect(() => {
    if (gameStarted && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 2000); // 增加到2秒，让用户有更多时间观察图片
      return () => clearInterval(interval);
    }
  }, [gameStarted, images.length]);

  useEffect(() => {
    if (actionData?.result) {
      setShowContinueButton(true);
      if (actionData.result === "正确") {
        setScore((prev) => prev + 1);
      }
    }
  }, [actionData]);

  const startNewGame = () => {
    submit({ new: "true" }, { method: "get" });
    setShowContinueButton(false);
  };

  if ('error' in loaderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">出错了</h1>
          <p className="text-center text-white">{loaderData.error}</p>
          <button
            onClick={startNewGame}
            className="mt-8 w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-white mb-8 text-center">看图猜成语</h1>
          <p className="text-white text-center mb-8">准备好挑战你的成语知识了吗？</p>
          <button
            onClick={startNewGame}
            className="w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            开始游戏
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">看图猜成语</h1>
        <div className="text-white text-center mb-4">
          <p className="text-xl">得分: <span className="font-bold">{score}</span></p>
          <p className="text-xl">回合: <span className="font-bold">{round}</span></p>
        </div>
        {gameData && (
          <>
            <div className="mb-8 relative">
              <img
                src={`data:image/jpeg;base64,${images[currentImage]}`}
                alt={`成语图${currentImage + 1}`}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {currentImage + 1} / 4
              </div>
            </div>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="correctIdiom" value={gameData["成语"]} />
              <div className="grid grid-cols-1 gap-4">
                {[gameData["成语"], gameData["混淆成语1"], gameData["混淆成语2"]].sort(() => Math.random() - 0.5).map((idiom, index) => (
                  <button
                    key={index}
                    type="submit"
                    name="selectedIdiom"
                    value={idiom}
                    className="w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
                    disabled={showContinueButton}
                  >
                    {idiom}
                  </button>
                ))}
              </div>
            </Form>
          </>
        )}
        {actionData?.result && (
          <div className={`mt-6 text-center text-2xl font-bold ${actionData.result === "正确" ? "text-green-400" : "text-red-400"}`}>
            {actionData.result === "正确" ? "恭喜你，答对了！" : "很遗憾，答错了！"}
          </div>
        )}
        {actionData?.result === "错误" && (
          <div className="mt-2 text-center text-white">
            正确答案: <span className="font-bold">{gameData?.["成语"]}</span>
          </div>
        )}
        {gameData && (
          <div className="mt-6 text-center text-white">
            <h2 className="text-xl font-bold mb-2">成语解释:</h2>
            <p className="text-lg">{gameData["成语解释"]}</p>
          </div>
        )}
        {showContinueButton && (
          <button
            onClick={startNewGame}
            className="mt-6 w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-xl transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            继续游戏
          </button>
        )}
      </div>
    </div>
  );
}
