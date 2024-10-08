import type { LoaderFunction } from "@remix-run/cloudflare";
import { createAppContext } from "~/context";

export const loader: LoaderFunction = async ({ params, context }) => {
  const { imageGenerationService } = createAppContext(context);
  const key = params.key;

  if (!key) {
    return new Response('Image key not provided', { status: 400 });
  }

  const imageData = await context.env.IMAGE_KV.get(key, 'arrayBuffer');
  if (!imageData) {
    return new Response('Image not found', { status: 404 });
  }

  return new Response(imageData, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800',
    },
  });
};