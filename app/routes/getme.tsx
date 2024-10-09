import { json, type LoaderFunction, type ActionFunction } from "@remix-run/cloudflare";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { createAppContext } from "../context";
import { withAuth } from "../middleware/auth";
import { useState, useEffect } from "react";

export const loader: LoaderFunction = withAuth(async ({ context }) => {
    const appContext = createAppContext(context);
    const { config } = appContext;
    const env = context.cloudflare.env;

    const envVariables = {
        API_KEY: config.API_KEY ? config.API_KEY : "未设置",
        CF_ACCOUNT_LIST: config.CF_ACCOUNT_LIST.length > 0 ? "已设置" : "未设置",
        CF_TRANSLATE_MODEL: config.CF_TRANSLATE_MODEL,
        CF_IS_TRANSLATE: config.CF_IS_TRANSLATE ? "true" : "false",
        USE_EXTERNAL_API: config.USE_EXTERNAL_API ? "true" : "false",
        EXTERNAL_API: config.EXTERNAL_API,
        EXTERNAL_MODEL: config.EXTERNAL_MODEL,
        EXTERNAL_API_KEY: config.EXTERNAL_API_KEY ? "已设置" : "未设置",
        FLUX_NUM_STEPS: config.FLUX_NUM_STEPS.toString(),
        CUSTOMER_MODEL_MAP: Object.keys(config.CUSTOMER_MODEL_MAP).length > 0 ? "已设置" : "未设置",
        getme: env.getme || "未设置",
        vars_apikey: env.API_KEY
    };

    return json({ envVariables, apiKey: config.API_KEY });
});

export const action: ActionFunction = withAuth(async ({ request, context }) => {
    const formData = await request.formData();
    const apiKey = formData.get("apiKey") as string;
    const config = createAppContext(context).config;

    if (apiKey === config.API_KEY) {
        return json({ success: true });
    } else {
        return json({ error: "API 密钥不正确" }, { status: 401 });
    }
});

export default function GetMe() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (actionData?.success) {
            setIsAuthenticated(true);
        }
    }, [actionData]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
                    <h1 className="text-4xl font-extrabold text-white mb-8 text-center">验证 API 密钥</h1>
                    <Form method="post" className="space-y-4">
                        <input
                            type="password"
                            name="apiKey"
                            placeholder="输入 API 密钥"
                            className="w-full px-5 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full px-5 py-3 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            验证
                        </button>
                    </Form>
                    {actionData?.error && (
                        <p className="mt-4 text-red-300 text-center">{actionData.error}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Workers 环境变量</h1>
                <div className="space-y-4">
                    {Object.entries(loaderData.envVariables).map(([key, value]) => (
                        <div key={key} className="text-center">
                            <p className="text-xl font-semibold text-white">{key}:</p>
                            <p className="text-lg text-white break-all">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}