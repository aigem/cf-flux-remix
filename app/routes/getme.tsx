import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { createAppContext } from "../context";

export const loader: LoaderFunction = async ({ context }) => {
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
        getme: env.getme || "未设置",  // 直接从环境变量中读取 getme
        vars_apikey: env.API_KEY || "未设置"
    };

    return json({ envVariables });
};

export default function GetMe() {
    const { envVariables } = useLoaderData<typeof loader>();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-white mb-8 text-center">Workers 环境变量</h1>
                <div className="space-y-4">
                    {Object.entries(envVariables).map(([key, value]) => (
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