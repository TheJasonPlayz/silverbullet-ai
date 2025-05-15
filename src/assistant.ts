import { AIProvider } from "./provider.ts";
import {
  editor,
  space,
} from "jsr:@silverbulletmd/silverbullet@0.10.4/syscalls";

export class AIAssistant {
  private provider: AIProvider;

  constructor() {
    this.provider = new AIProvider();
  }

  private async insertStream(
    textStream: AsyncIterable<string>,
    cursorPos: number,
  ) {
    let textFull = "";
    for await (const textPart of textStream) {
      textFull += textPart;
      await editor.insertAtPos(textPart, cursorPos + textFull.length);
    }
  }

  public async prompt() {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");

    if (prompt) {
      const { textStream } = this.provider.textStream(prompt);
      await this.insertStream(textStream, cursorPos);
    }
  }

  public async promptPage() {
    const cursorPos = await editor.getCursor();
    const prompt = await editor.prompt("What would you like to ask me?");
    const pageName = await editor.getCurrentPage();
    const pageContents = await space.readPage(pageName);

    if (prompt && pageContents) {
      const { textStream } = this.provider.textStream(prompt, pageContents);
      await this.insertStream(textStream, cursorPos);
    }
  }

  public async promptSelection() {
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
      const { textStream } = this.provider.textStream(
        prompt,
        selectionContents,
      );
      await this.insertStream(textStream, cursorPos);
    }
  }
}
