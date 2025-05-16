import { syscall } from "jsr:@silverbulletmd/silverbullet@0.10.4/syscalls";

export type ConfigSchema = {
  baseURL: string;
  provider: ProviderName;
  apiKey: string;
  modelName: string;
  systemPrompt: string;
};

export enum ProviderName {
  OpenAI = "openai",
}

export class PlugConfig {
  static defaultSystem =
    "You are an assistant for a user of Silverbullet. The SilverBullet documentation can be found [here](https://silverbullet.md)";

  static defaultConf: ConfigSchema = {
    baseURL: "https://openrouter.ai/api/v1",
    provider: ProviderName.OpenAI,
    apiKey: "",
    modelName: "",
    systemPrompt: PlugConfig.defaultSystem,
  };

  static async getConfig(): Promise<ConfigSchema> {
    const config = await syscall(
      "config.get",
      "ai",
      PlugConfig.defaultConf,
    ) as ConfigSchema;
    console.debug(config);
    return config;
  }
}
