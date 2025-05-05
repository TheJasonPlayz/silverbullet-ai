const defaultUserPrompt = `You are an assistant to the user of the personal knowledge management system Silverbullet. You can find the docs on this website: [SilverBullet](https://silverbullet.md/)`

export const configSchema = {
    description: "SilverBullet-AI Plug Config",
    type: "object",
    properties: {
      "baseURL": {
        "type": "string"
      },
      "apiKey": {
        "type": "string"
      },
      "modelName": {
        "type": "string"
      },
      "userPrompt": {
        "type": "string",
        "default": defaultUserPrompt
      }
    }
  }

export type AIConfig = {
    baseURL: string;
    apiKey: string;
    modelName: string;
    userPrompt: string;
}