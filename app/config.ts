import { LOCAL_CONFIG } from './localConfig';

type CustomerModelMap = {
  [key: string]: string;
};

export function createConfig(env: Env) {
  return {
    API_KEY: env.API_KEY || LOCAL_CONFIG.API_KEY,
    CF_TRANSLATE_MODEL: env.CF_TRANSLATE_MODEL || LOCAL_CONFIG.CF_TRANSLATE_MODEL,
    CF_ACCOUNT_ID: env.CF_ACCOUNT_ID || LOCAL_CONFIG.CF_ACCOUNT_ID,
    CF_API_TOKEN: env.CF_API_TOKEN || LOCAL_CONFIG.CF_API_TOKEN,
    CF_IS_TRANSLATE: true,
    USE_EXTERNAL_API: false,
    EXTERNAL_API: "",
    EXTERNAL_MODEL: "",
    EXTERNAL_API_KEY: "",
    FLUX_NUM_STEPS: 4,
    CUSTOMER_MODEL_MAP: {
      "DS-8-CF": "@cf/lykon/dreamshaper-8-lcm",
      "SD-XL-Bash-CF": "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      "SD-XL-Lightning-CF": "@cf/bytedance/stable-diffusion-xl-lightning",
      "FLUX.1-Schnell-CF": "@cf/black-forest-labs/flux-1-schnell"
    } as CustomerModelMap,
    IMAGE_EXPIRATION: 60 * 30
  };
}

export type Config = ReturnType<typeof createConfig>;