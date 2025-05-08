import { StreamTextResult, ToolSet, streamText } from "npm:ai";
import { AIProvider } from "./provider.ts";
import { editor } from "@silverbulletmd/silverbullet/syscalls";
// import { AIContext } from "./context.ts";

export class Assistant {
    #provider: AIProvider
    #system = "You are an AI assistant for a user of the application SilverBullet. You will respond with utmost accuracy, respect, and professionalism. The documentation can for this be found [here](https://silverbullet.md). If there is any, your context for the conversation is as follows: "
    // #contexts: AIContext[] = []

    constructor() {
        this.#provider = new AIProvider()
    }

    #streamText(context: string, prompt: string): StreamTextResult<ToolSet, never> {
        return streamText({
            model: this.#provider.provider(this.#provider.model),
            prompt: prompt,
            system: this.#system + context,
        }) 
    }

    async #insertText(pos: number, context: string, prompt: string) {
        const { textStream } = this.#streamText(context, prompt)

            let fullText = ""
            for await (const textPart of textStream) {
                await editor.insertAtPos(textPart, pos + fullText.length)
                console.log({textPart: textPart, pos: pos, fullText: fullText})
                fullText = fullText.concat(textPart)
                console.log({textPart: textPart, pos: pos, fullText: fullText})
            }
    }

    logConfig(): void {
        this.#provider.logConfig()
    }

    async promptWithNothing(): Promise<void> {
        const pos = await editor.getCursor()
        const prompt = await editor.prompt("What would you like to ask me?")
        const context = ""

        if (prompt) {
            this.#insertText(pos, context, prompt)
        } else {
            Error("No prompt given!")
        }
    }

    async promptWithSelecton(): Promise<void> {
        const pos = await editor.getCursor()
        const prompt = await editor.prompt("What would you like to ask me?")

        const contextLimits = await editor.getSelection()  
        const contextPage = await editor.getCurrentPage()
        const context = contextPage.substring(contextLimits.from, contextLimits.to)

        if (prompt) {
            this.#insertText(pos, context, prompt)
        } else {
            Error("No prompt given!")
        }
    }

    async promptWithPage(): Promise<void> {
        const pos = await editor.getCursor()
        const prompt = await editor.prompt("What would you like to ask me?")
        const context = await editor.getCurrentPage()

        if (prompt) {
            this.#insertText(pos, context, prompt)
        } else {
            Error("No prompt given!")
        }
    }
}