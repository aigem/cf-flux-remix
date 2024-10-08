import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createAppContext } from "~/context";
import { handleError } from "~/utils/error";
import { CONFIG } from "~/config";

export const loader: LoaderFunction = () => {
  return json({ error: "此 API 端点仅支持 POST 请求" }, { status: 405 });
};

export const action: ActionFunction = async ({ request, context }) => {
  try {
    // ... 其余代码保持不变
  } catch (error) {
    return handleError(error);
  }
};

// ... 其余函数保持不变