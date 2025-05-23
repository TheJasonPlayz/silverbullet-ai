import { AIProvider } from "./provider.ts";
import {
  editor,
  space,
} from "jsr:@silverbulletmd/silverbullet@0.10.4/syscalls";

export class AIAssistant {
  #provider: AIProvider;

  constructor() {
    this.#provider = new AIProvider();
  }

  async #insertStream(
    prompt: string,
    cursorPos: number,
    context?: string,
  ): Promise<string> {
    const { textStream } = this.#provider.textStream(prompt, context);

    console.log({
      tS: textStream,
      P: prompt,
      cP: cursorPos,
    });

    let textFull = "";
    for await (const textPart of textStream) {
      textFull += textPart;
      await editor.insertAtPos(textPart, cursorPos + textFull.length);
      console.log({
        tP: textPart,
        tF: textFull,
        tS: textStream,
        P: prompt,
        cP: cursorPos,
      });
    }
    return textFull;
  }

  async prompt(): Promise<string> {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");

    console.log({ cP: cursorPos, p: prompt });

    if (prompt) {
      return await this.#insertStream(prompt, cursorPos);
    } else {
      throw Error("Prompt not found for 'prompt' function");
    }
  }

  async promptPage(): Promise<string> {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");
    const pageName = await editor.getCurrentPage();
    const pageContents = await space.readPage(pageName);

    if (prompt && pageContents) {
      return await this.#insertStream(prompt, cursorPos, pageContents);
    } else {
      throw Error(
        "Prompt or page not found for 'promptPage' function. P: " + prompt +
          " PAGE: " + pageContents,
      );
    }
  }

  async promptSelection(): Promise<string> {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");
    const selection = await editor.getSelection();

    const pageName = await editor.getCurrentPage();
    const pageContents = await space.readPage(pageName);

    const selectionContents = pageContents.substring(
      selection.from,
      selection.to,
    );

    if (prompt && selectionContents) {
      return await this.#insertStream(prompt, cursorPos, selectionContents);
    } else {
      throw Error(
        "Prompt or selection not found for 'promptSelection' function. P: " +
          prompt + " SEL: " + selectionContents,
      );
    }
  }
}
