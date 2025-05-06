const defaultSystemPrompt = "You are a AI assistant for a user of Silverbullet. The SilverBullet documentation can be found [here](https://silverbullet.md)"

export const configSchema = `{
  type = "object",
  properties = {
    baseURL = {
      type = "string",
      default = "https://openrouter.ai/api/v1"
    },
    apiKey = {
      type = "string",
      default = ""
    },
    modelName = {
      type = "string",
      default = ""
    },
    systemPrompt = {
      type = "string",
      default = ${defaultSystemPrompt}
    }
  } 
}`
      

export type AIConfig = {
    baseURL: string;
    apiKey: string;
    modelName: string;
    systemPrompt: string;
}