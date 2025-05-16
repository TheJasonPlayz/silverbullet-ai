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
    textStream: AsyncIterable<string>,
    cursorPos: number,
  ): Promise<void> {
    let textFull = "";
    for await (const textPart of textStream) {
      textFull += textPart;
      await editor.insertAtPos(textPart, cursorPos + textFull.length);
      console.debug({ textFull, textPart });
    }
  }

  async prompt(): Promise<void> {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");

    console.debug({ cursorPos, prompt });

    if (prompt) {
      const { textStream } = this.#provider.textStream(prompt);
      console.debug(textStream);
      await this.#insertStream(textStream, cursorPos);
    } else {
      throw Error("Prompt not found for 'prompt' function");
    }
  }

  async promptPage(): Promise<void> {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");
    const pageName = await editor.getCurrentPage();
    const pageContents = await space.readPage(pageName);

    if (prompt && pageContents) {
      const { textStream } = this.#provider.textStream(prompt, pageContents);
      await this.#insertStream(textStream, cursorPos);
    } else {
      throw Error(
        "Prompt or page not found for 'promptPage' function. P: " + prompt +
          " PAGE: " + pageContents,
      );
    }
  }

  async promptSelection(): Promise<void> {
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
      const { textStream } = this.#provider.textStream(
        prompt,
        selectionContents,
      );
      await this.#insertStream(textStream, cursorPos);
    } else {
      throw Error(
        "Prompt or selection not found for 'promptSelection' function. P: " +
          prompt + " SEL: " + selectionContents,
      );
    }
  }
}
