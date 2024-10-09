import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { CONFIG } from "../config";

export const loader: LoaderFunction = async ({ context }) => {
	const env = context.cloudflare.env;
	
	const envVariables = {
		API_KEY: CONFIG.API_KEY ? "已设置" : "未设置",
		CF_ACCOUNT_LIST: CONFIG.CF_ACCOUNT_LIST.length > 0 ? "已设置" : "未设置",
		CF_TRANSLATE_MODEL: CONFIG.CF_TRANSLATE_MODEL,
		CF_IS_TRANSLATE: CONFIG.CF_IS_TRANSLATE ? "true" : "false",
		USE_EXTERNAL_API: CONFIG.USE_EXTERNAL_API ? "true" : "false",
		EXTERNAL_API: CONFIG.EXTERNAL_API,
		EXTERNAL_MODEL: CONFIG.EXTERNAL_MODEL,
		EXTERNAL_API_KEY: CONFIG.EXTERNAL_API_KEY ? "已设置" : "未设置",
		FLUX_NUM_STEPS: CONFIG.FLUX_NUM_STEPS.toString(),
		CUSTOMER_MODEL_MAP: Object.keys(CONFIG.CUSTOMER_MODEL_MAP).length > 0 ? "已设置" : "未设置",
		getme: env.getme || "未设置"  // 直接从环境变量中读取 getme
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