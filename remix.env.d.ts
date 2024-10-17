/// <reference types="@remix-run/cloudflare" />
/// <reference types="vite/client" />

import type { AppLoadContext } from "@remix-run/cloudflare";

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: {
      env: {
        [key: string]: string;
      };
    };
  }
}
