import { world } from "@minecraft/server";

export namespace Logger {
  export var withColor = true;
  function log(...msg: any[]) {
    console.warn(...msg);
    try {
      world.getPlayers({ tags: ["canSeeLogs"] }).forEach((p) => p.sendMessage(msg.join(" ")));
    } catch (e) {}
  }
  export function logObj(obj: any) {
    log(`${withColor ? "\u00a7f" : ""}[MCCxMineR] INFO - (Object) ${JSON.stringify(obj)}`);
  }
  export function info(...msg: any[]) {
    log(`${withColor ? "\u00a7f" : ""}[MCCxMineR] INFO - `, ...msg);
  }
  export function warn(...msg: any[]) {
    log(`${withColor ? "\u00a7g" : ""}[MCCxMineR] WARN - `, ...msg);
  }
  export function error(...msg: any[]) {
    log(`${withColor ? "\u00a7c" : ""}[MCCxMineR] ERROR - `, ...msg);
  }
  export function critical(...msg: any[]) {
    log(`${withColor ? "\u00a74" : ""}[MCCxMineR] CRITICAL - `, ...msg);
  }
  export function debug(...msg: any[]) {
    log(`${withColor ? "\u00a77" : ""}[MCCzMineR] DEBUG - `, ...msg);
  }
}
