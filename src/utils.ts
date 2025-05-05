import { space } from "@silverbulletmd/silverbullet/syscalls";

const contextPageName = "AI Context"

function splitAt(str: string, index: number): string[] {
    const firstPart = str.substring(0, index)
    const secondPart = str.substring(index)
    return [firstPart, secondPart]
}

async function saveContext(conversationSum: number, newContext: string): Promise<any> {
    if (!space.fileExists(contextPageName)) {
        space.writePage(contextPageName, `# ${conversationSum}\n${newContext}`)
    }

    const prevContext = await space.readPage(contextPageName)

    const conversationRegExp = RegExp(`(\# ${conversationSum}\n.+)(\n\#)`)
    const conversationMatch = prevContext.match(conversationRegExp)
    if (conversationMatch) {
        const conversation = conversationMatch[1]

        const conversationEnd = conversation.length - 1

        const [firstPart, secondPart] = splitAt(prevContext, conversationEnd)
        const context = `${firstPart}\n${newContext}\n${secondPart}`

        space.writePage(contextPageName, context)
    } else {
        space.writePage(contextPageName, `${prevContext}\n# ${conversationSum}\n${newContext}`)
    }

}

async function getContext(conversationSum: number): Promise<string> {
    if (!space.fileExists(contextPageName)) {
        throw Error("Context Page Not Found")
    }

    const context = await space.readPage(contextPageName)
    const conversationRegExp = RegExp(`(\# ${conversationSum}\n.+)(\n\#)`)
    const conversationMatch = context.match(conversationRegExp)

    if (conversationMatch) {
        const conversation = conversationMatch[1]

        const conversationStart = context.search(conversation)
        const conversationEnd = conversation.length - 1

        return context.substring(conversationStart, conversationStart + conversationEnd)
    } else {
       throw Error(`Conversation match not found for Conversation # ${conversationSum}`)
    }
}