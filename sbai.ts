import { AIAssistant } from "./src/assistant.ts";
import { PlugConfig } from "./src/plugconfig.ts";

const assistant = new AIAssistant();

const prompt = async () => {
  console.log(await assistant.prompt());
};
const promptWithSelection = async () => {
  console.log(await assistant.promptSelection());
};
const promptWithPage = async () => {
  console.log(await assistant.promptPage());
  i;
};

const logConfig = async () => {
  await PlugConfig.logConfig();
};

export { logConfig, prompt, promptWithPage, promptWithSelection };
