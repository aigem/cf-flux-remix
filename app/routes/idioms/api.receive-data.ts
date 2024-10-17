import { json } from "@remix-run/cloudflare";
import type { ActionFunction } from "@remix-run/cloudflare";

export const action: ActionFunction = async ({ request }: { request: Request }) => {
  const data = await request.json();
  
  // 验证数据格式
  if (!data["成语"] || !data["成语解释"] || !data["混淆成语1"] || !data["混淆成语2"] || 
      !data["图1"] || !data["图2"] || !data["图3"] || !data["图4"]) {
    return json({ error: "数据格式不正确。" }, { status: 400 });
  }

  // 这里你可以处理数据,例如存储到数据库
  // 为了简单起见,我们直接返回接收到的数据
  return json({ message: "数据接收成功", data });
};
