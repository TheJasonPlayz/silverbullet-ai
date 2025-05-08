import { space } from "@silverbulletmd/silverbullet/syscalls";
import { md5 } from "npm:js-md5"

function splitAt(str: string, index: number): string[] {
    const firstPart = str.substring(0, index)
    const secondPart = str.substring(index)
    return [firstPart, secondPart]
}

export class AIContext {
    #pageName: string = "AI Context"
    #sum: string

    constructor(prompt: string) {
        this.#sum = md5(prompt)
    }

    async saveContext(newContext: string): Promise<any> {
        if (!space.fileExists(this.#pageName)) {
            space.writePage(this.#pageName, `# ${this.#sum}\n${newContext}`)
        }
    
        const prevContext = await space.readPage(this.#pageName)
    
        const conversationRegExp = RegExp(`(\# ${this.#sum}\n.+)(\n\#)`)
        const conversationMatch = prevContext.match(conversationRegExp)
        if (conversationMatch) {
            const conversation = conversationMatch[1]
    
            const conversationEnd = conversation.length - 1
    
            const [firstPart, secondPart] = splitAt(prevContext, conversationEnd)
            const context = `${firstPart}\n${newContext}\n${secondPart}`
    
            space.writePage(this.#pageName, context)
        } else {
            space.writePage(this.#pageName, `${prevContext}\n# ${this.#sum}\n${newContext}`)
        }
    
    }
    
    async getContext(): Promise<string> {
        if (!space.fileExists(this.#pageName)) {
            throw Error("Context Page Not Found")
        }
    
        const context = await space.readPage(this.#pageName)
        const conversationRegExp = RegExp(`(\# ${this.#sum}\n.+)(\n\#)`)
        const conversationMatch = context.match(conversationRegExp)
    
        if (conversationMatch) {
            const conversation = conversationMatch[1]
    
            const conversationStart = context.search(conversation)
            const conversationEnd = conversation.length - 1
    
            return context.substring(conversationStart, conversationStart + conversationEnd)
        } else {
           throw Error(`Conversation match not found for Conversation # ${this.#sum}`)
        }
    }
}



