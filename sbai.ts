import { editor, syscall } from "@silverbulletmd/silverbullet/syscalls";
import { generateText } from "ai-sdk"
import { createOpenAI } from "ai-sdk/openai"
import { configSchema, AIConfig } from "./src/configschema.ts";

const system = "You are a AI assistant for a user of Silverbullet. The SilverBullet documentation can be found [here](https://silverbullet.md)"

const conf = await syscall("config.define", "ai", configSchema) as AIConfig
const provider = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    compatibility: "compatible"
})

export async function promptAI() {
    const prompt = await editor.prompt("What would you like to ask me?")
    
    const { text } = await generateText({
        model: provider('deepseek/deepseek-chat-v3-0324:free'),
        prompt: prompt,
        system: system
    })

    editor.insertAtCursor(text)
}