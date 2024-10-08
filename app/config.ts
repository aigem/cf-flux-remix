type CustomerModelMap = {
  [key: string]: string;
};

export const CONFIG = {
  API_KEY: "your_api_key_here",
  CF_TRANSLATE_MODEL: "@cf/qwen/qwen1.5-14b-chat-awq",
  CF_ACCOUNT_ID: "your_account_id_here",
  CF_API_TOKEN: "your_api_token_here",
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
  IMAGE_EXPIRATION: 60 * 30,
  KV_NAMESPACE: "IMAGE_KV",
  KV_ID: "528e12da11b1456b869cd0d43ac56bf4"
};

export type Config = typeof CONFIG;