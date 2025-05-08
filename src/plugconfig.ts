import { syscall } from "@silverbulletmd/silverbullet/syscalls";
import { defaultConfig } from "jsr:@silverbulletmd/silverbullet@^0.9.0/type/config";

type ConfigSchema = {
  provider: string,
  baseURL: string;
  apiKey: string;
  modelName: string;
  systemPrompt: string;
}

export class PlugConfig {

  static defaultConfig: ConfigSchema = {
    provider: "openai",
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "",
    modelName: "",
    systemPrompt: ""
  }

  config: ConfigSchema

  constructor() {
    this.config = PlugConfig.defaultConfig
  }

  async getConfig() {
    return await syscall("config.get", "ai", PlugConfig.defaultConfig) as ConfigSchema
  }

  async logConfig() {
    console.log(await this.getConfig())
  }
}