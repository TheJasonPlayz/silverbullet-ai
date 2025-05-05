import { editor, syscall } from "@silverbulletmd/silverbullet/syscalls";
import { generateText } from "npm:ai"
import { createOpenAI } from "npm:@ai-sdk/openai"
import { AIConfig } from "./src/configschema.ts"

// await syscall("config.define", "ai", configSchema)

const conf = await syscall("config.get", "ai", "{}") as AIConfig

const provider = createOpenAI({
    baseURL: conf.baseURL,
    apiKey: conf.apiKey,
    compatibility: "compatible"
})

export async function getConfig(): Promise<AIConfig> {
    return await syscall("config.get", "ai", "{}") as AIConfig
}
export async function promptAI(): Promise<void> {
    const prompt = await editor.prompt("What would you like to ask me?")
    
    const { text } = await generateText({
        model: provider(conf.modelName),
        prompt: prompt,
        system: conf.systemPrompt
    })

    return editor.insertAtCursor(text)
}