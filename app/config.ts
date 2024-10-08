export const CONFIG = {
  API_KEY: process.env.API_KEY || "",
  CF_TRANSLATE_MODEL: process.env.CF_TRANSLATE_MODEL || "@cf/qwen/qwen1.5-14b-chat-awq",
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
  },
  IMAGE_EXPIRATION: 60 * 30
};