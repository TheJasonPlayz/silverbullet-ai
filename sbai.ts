import { editor, syscall } from "@silverbulletmd/silverbullet/syscalls";
import { generateText } from "npm:ai"
import { createOpenAI } from "npm:@ai-sdk/openai"
import { configSchema, AIConfig } from "./src/configschema.ts"

const conf = await syscall("config.define", "ai", configSchema) as AIConfig


const provider = createOpenAI({
    baseURL: conf.baseURL,
    apiKey: conf.apiKey, //"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",
    compatibility: "compatible"
})

export async function promptAI(): Promise<void> {
    const prompt = await editor.prompt("What would you like to ask me?")
    
    const { text } = await generateText({
        model: provider('deepseek/deepseek-chat-v3-0324:free'),
        prompt: prompt,
        system: conf.systemPrompt
    })

    return editor.insertAtCursor(text)
}