import { json, type LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.env;
  return json({
    API_KEY: env.API_KEY || "未设置",
    CF_ACCOUNT_ID: env.CF_ACCOUNT_ID || "未设置",
  });
};

export default function GetMe() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-white mb-8 text-center">环境变量</h1>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value]) => (
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