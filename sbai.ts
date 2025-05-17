import { AIAssistant } from "./src/assistant.ts";
import { PlugConfig } from "./src/plugconfig.ts";

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

const logConfig = async () => {
  await PlugConfig.logConfig();
};

export { logConfig, prompt, promptWithPage, promptWithSelection };
