import { editor, syscall } from "@silverbulletmd/silverbullet/syscalls";
import { streamText } from "npm:ai"
import { OpenAIProvider, createOpenAI } from "npm:@ai-sdk/openai"
import { configSchema, AIConfig, defaultConfig } from "./src/configschema.ts"

await syscall("config.define", "ai", configSchema)

async function getConfig(): Promise<AIConfig> {
    return await syscall("config.get", "ai", "{}") as AIConfig
}

export async function logConfig(): Promise<void> {
    console.log(await getConfig())
}

function makeProvider(conf: AIConfig): OpenAIProvider {
    return createOpenAI({
        baseURL: conf.baseURL,
        apiKey: conf.apiKey,
        compatibility: "compatible"
    })
}

export async function promptAI(): Promise<void> {
    const pos = await editor.getCursor()
    const conf = await syscall("config.get", "ai", defaultConfig) as AIConfig

    const provider = makeProvider(conf)

    const prompt = await editor.prompt("What would you like to ask me?")
    
    const { textStream } = await streamText({
        model: provider(conf.modelName),
        prompt: prompt,
        system: conf.systemPrompt
    })

    for await (const textPart of textStream) {
        editor.insertAtPos(textPart, pos)
    }
}