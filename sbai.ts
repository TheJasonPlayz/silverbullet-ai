import { AIAssistant } from "./src/assistant.ts";

const assistant = new AIAssistant();

const prompt = async () => {
  await assistant.prompt();
};
const promptWithSelection = async () => {
  await assistant.promptSelection();
};
const promptWithPage = async () => {
  await assistant.promptPage();
};

export { prompt, promptWithPage, promptWithSelection };
