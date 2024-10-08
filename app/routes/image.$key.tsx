import type { LoaderFunction } from "@remix-run/cloudflare";
import { createAppContext } from "~/context";

export const loader: LoaderFunction = async ({ params, context }) => {
  const { key } = params;
  const appContext = createAppContext(context);
  const { env } = appContext;

  const imageData = await env.IMAGE_KV.get(key, 'arrayBuffer');
  if (!imageData) {
    return new Response('Image not found', { status: 404 });
  }

  const metadata = await env.IMAGE_KV.getWithMetadata(key);
  const contentType = metadata.metadata?.contentType || 'image/png';

  return new Response(imageData, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000',
    },
  });
};