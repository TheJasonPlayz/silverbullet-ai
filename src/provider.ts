import { ConfigSchema, PlugConfig } from "./plugconfig.ts";
import { streamText, StreamTextResult, ToolSet } from "npm:ai";
import { createOpenAI, OpenAIProvider } from "npm:@ai-sdk/openai";

type ProviderType = OpenAIProvider;

export class AIProvider {
  private config: ConfigSchema = PlugConfig.defaultConf;
  private provider: ProviderType;

  constructor() {
    (async () => {
      this.config = await PlugConfig.getConfig();

      return this;
    });
    this.provider = createOpenAI({
      compatibility: "compatible",
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
    });
  }

  public textStream(
    prompt: string,
    context?: string,
  ): StreamTextResult<ToolSet, never> {
    let promptExtra = "";

    if (context) {
      promptExtra = " You will use the context following: " + context;
    }

    return streamText({
      model: this.provider(this.config.modelName),
      system: this.config.systemPrompt + promptExtra,
      prompt: prompt,
    });
  }
}
