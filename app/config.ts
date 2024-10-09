type CustomerModelMap = {
  [key: string]: string;
};

type CFAccount = {
  account_id: string;
  token: string;
};

export const CONFIG = {
  API_KEY: "",
  CF_ACCOUNT_LIST: [] as CFAccount[],
  CF_TRANSLATE_MODEL: "",
  CF_IS_TRANSLATE: false,
  USE_EXTERNAL_API: false,
  EXTERNAL_API: "",
  EXTERNAL_MODEL: "",
  EXTERNAL_API_KEY: "",
  FLUX_NUM_STEPS: 6,
  CUSTOMER_MODEL_MAP: {} as CustomerModelMap,
  getme: "",
};

export function initConfig(env: any) {
  CONFIG.API_KEY = env.API_KEY || "";
  CONFIG.CF_ACCOUNT_LIST = JSON.parse(env.CF_ACCOUNT_LIST || "[]");
  CONFIG.CF_TRANSLATE_MODEL = env.CF_TRANSLATE_MODEL || "";
  CONFIG.CF_IS_TRANSLATE = env.CF_IS_TRANSLATE === "true";
  CONFIG.USE_EXTERNAL_API = env.USE_EXTERNAL_API === "true";
  CONFIG.EXTERNAL_API = env.EXTERNAL_API || "";
  CONFIG.EXTERNAL_MODEL = env.EXTERNAL_MODEL || "";
  CONFIG.EXTERNAL_API_KEY = env.EXTERNAL_API_KEY || "";
  CONFIG.FLUX_NUM_STEPS = parseInt(env.FLUX_NUM_STEPS || "6", 10);
  CONFIG.CUSTOMER_MODEL_MAP = JSON.parse(env.CUSTOMER_MODEL_MAP || "{}");
  CONFIG.getme = env.getme || "";
  
  console.log("Config initialized:", JSON.stringify(CONFIG, null, 2));
}

export type Config = typeof CONFIG;