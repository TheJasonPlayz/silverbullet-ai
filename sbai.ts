import { AIAssistant } from "./src/assistant.ts";

const assistant = new AIAssistant();

const prompt = assistant.prompt;
const promptWithSelection = assistant.promptSelection;
const promptWithPage = assistant.promptPage;

export { prompt, promptWithPage, promptWithSelection };
