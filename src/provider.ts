import { ConfigSchema, PlugConfig } from "./plugconfig.ts";
import { streamText, StreamTextResult, ToolSet } from "npm:ai";
import { createOpenAI, OpenAIProvider } from "npm:@ai-sdk/openai";

type ProviderType = OpenAIProvider;

export class AIProvider {
  #config: ConfigSchema = PlugConfig.defaultConf;
  #provider: ProviderType;

  constructor() {
    (async () => {
      this.#config = await PlugConfig.getConfig();

      return this;
    });
    this.#provider = createOpenAI({
      compatibility: "compatible",
      apiKey: this.#config.apiKey,
      baseURL: this.#config.baseURL,
    });
    console.debug(this);
  }

  textStream(
    prompt: string,
    context?: string,
  ): StreamTextResult<ToolSet, never> {
    let promptExtra = "";

    if (context) {
      promptExtra = " You will use the context following: " + context;
    }

    console.debug({ prompt, context });

    return streamText({
      model: this.#provider(this.#config.modelName),
      system: this.#config.systemPrompt + promptExtra,
      prompt: prompt,
    });
  }
}
