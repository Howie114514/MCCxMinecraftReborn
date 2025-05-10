import { RawMessage, RawText } from "@minecraft/server";
import { LKey } from "./langfile";
import { tr } from "./lang";

export class Text implements RawText {
  rawtext: RawMessage[];
  constructor(rt: RawMessage[] | RawText = []) {
    if ((rt as RawText).rawtext) {
      this.rawtext = (rt as RawText).rawtext as RawMessage[];
      return;
    }
    this.rawtext = rt as RawMessage[];
  }
  raw(raw: RawMessage): this {
    if (raw.rawtext) {
      this.rawtext = this.rawtext.concat(raw.rawtext);
    } else {
      this.rawtext.push(raw);
    }
    return this;
  }
  txt(t: string) {
    this.rawtext.push({ text: t });
    return this;
  }
  tr<T extends string = LKey>(t: T, ...args: (RawMessage | string)[]): Text {
    this.rawtext.push(tr(t, ...args));
    return this;
  }
}
