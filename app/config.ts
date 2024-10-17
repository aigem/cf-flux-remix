type CustomerModelMap = {
  [key: string]: string;
};

type CFAccount = {
  account_id: string;
  token: string;
};

export type Config = {
  API_KEY: string;
  CF_ACCOUNT_LIST: { account_id: string; token: string }[];
  CF_TRANSLATE_MODEL: string;
  CF_IS_TRANSLATE: boolean;
  USE_EXTERNAL_API: boolean;
  EXTERNAL_API: string;
  EXTERNAL_MODEL: string;
  EXTERNAL_API_KEY: string;
  FLUX_NUM_STEPS: number;
  CUSTOMER_MODEL_MAP: { [key: string]: string };
  getme: string;
};

export function getConfig(env: any): Config {
  return {
    API_KEY: env.API_KEY || "",
    CF_ACCOUNT_LIST: JSON.parse(env.CF_ACCOUNT_LIST || "[]"),
    CF_TRANSLATE_MODEL: env.CF_TRANSLATE_MODEL || "",
    CF_IS_TRANSLATE: env.CF_IS_TRANSLATE === "true",
    USE_EXTERNAL_API: env.USE_EXTERNAL_API === "true",
    EXTERNAL_API: env.EXTERNAL_API || "",
    EXTERNAL_MODEL: env.EXTERNAL_MODEL || "",
    EXTERNAL_API_KEY: env.EXTERNAL_API_KEY || "",
    FLUX_NUM_STEPS: parseInt(env.FLUX_NUM_STEPS || "6", 10),
    CUSTOMER_MODEL_MAP: JSON.parse(env.CUSTOMER_MODEL_MAP || "{}"),
    getme: env.getme || "",
  };
}