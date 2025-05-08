import { Assistant } from "./src/assistant.ts";

const assistant = new Assistant()

const prompt = assistant.promptWithNothing
const promptWithSelection = assistant.promptWithSelecton
const promptWithPage = assistant.promptWithPage
const logConfig = assistant.logConfig

export { prompt, promptWithSelection, promptWithPage, logConfig }