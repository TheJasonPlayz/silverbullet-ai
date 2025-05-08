import { OpenAIProvider, createOpenAI } from "npm:@ai-sdk/openai";
import { OllamaProvider, createOllama } from "npm:ollama-ai-provider"
import { GoogleGenerativeAIProvider, createGoogleGenerativeAI } from "npm:@ai-sdk/google"
import { PlugConfig } from "./plugconfig.ts";

enum ProviderType {
    "openai",
    "ollama",
    "gemini",
}

type ProviderClass = OpenAIProvider | OllamaProvider | GoogleGenerativeAIProvider

export class AIProvider {
    #type: ProviderType
    #config: PlugConfig
    provider: ProviderClass
    model: string

    constructor() {
        this.#config = new PlugConfig()
        this.#config.getConfig()

        this.model = this.#config.config.modelName

        this.#type = this.#setType(this.#config.config.provider)

        this.provider = this.#makeProvider()
    }

    #setType(str: string): ProviderType {
        switch (str) {
            case "openai":
                return ProviderType.openai
            case "ollama":
                return ProviderType.ollama
            case "gemini":
                return ProviderType.gemini
            default:
                throw Error("Provider Type is unknown. Must be one of " + ProviderType)
        }
    }

    #makeProvider(): ProviderClass {
        switch (this.#type) {
            case ProviderType.openai:
                return createOpenAI({
                    apiKey: this.#config.config.apiKey,
                    baseURL: this.#config.config.baseURL,
                    compatibility: "compatible",
                })
            case ProviderType.ollama:
                return createOllama({
                    baseURL: this.#config.config.baseURL
                })
            case ProviderType.gemini:
                return createGoogleGenerativeAI({
                    apiKey: this.#config.config.apiKey,
                    baseURL: this.#config.config.baseURL
                })
        }
    }

    logConfig(): void {
        console.log(this.#config.config)
    }
}