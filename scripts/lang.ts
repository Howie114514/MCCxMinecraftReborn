import { RawMessage } from "@minecraft/server";
import { LKey } from "./langfile";

export default (k: LKey | string, ...w: (RawMessage | string)[]) => {
  return { rawtext: [{ translate: k, with: w }] } as RawMessage;
};

export function tr(k: LKey, ...w: (RawMessage | string)[]): RawMessage;
export function tr(k: string, ...w: (RawMessage | string)[]): RawMessage;
export function tr(k: LKey | string, ...w: (RawMessage | string)[]) {
  return { rawtext: [{ translate: k, with: w }] } as RawMessage;
}

export function itemName(id: string) {
  return { rawtext: [{ translate: `item.${id.replace(/minecraft:/, "")}.name` }] } as RawMessage;
}
