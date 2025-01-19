import { BlockVolume, Dimension, Entity, Player, system, TicksPerSecond, Vector3, world } from "@minecraft/server";
import { Logger } from "./logger";

export function vaildateNum(n: number) {
  return n != n ? 0 : n;
}
export function forIn<T>(obj: Record<string | number, T>, iter: (v: T, k: string) => void) {
  Object.keys(obj).forEach((k) => {
    try {
      iter(obj[k], k);
    } catch (err) {
      Logger.error(err, (err as Error).stack);
    }
  });
}
export function forInAsync<T>(obj: Record<string | number, T>, iter: (v: T, k: string) => void) {
  let k = Object.keys(obj);
  return new Promise<void>((resolve) => {
    system.runJob(
      (function* () {
        for (const key of k) {
          const element = obj[key];
          try {
            iter(element, key);
          } catch (err) {
            Logger.error(err, (err as Error).stack);
          }
          yield;
        }
        resolve();
      })()
    );
  });
}
export function tick2Time(t: number) {
  let s = t / TicksPerSecond;
  let m = Math.floor(s / 60).toString();
  m = "0".repeat(2 - m.length >= 0 ? 2 - m.length : 0) + m;
  let ss = Math.floor(s % 60).toString();
  ss = "0".repeat(2 - ss.length >= 0 ? 2 - ss.length : 0) + ss;
  return m + ":" + ss;
}
export function formatTime(t: number) {
  let s = t / 1000;
  let m = Math.floor(s / 60).toString();
  m = "0".repeat(2 - m.length >= 0 ? 2 - m.length : 0) + m;
  let ss = (s % 60).toFixed(2);
  ss = "0".repeat(5 - ss.length >= 0 ? 5 - ss.length : 0) + ss;
  return m + ":" + ss;
}

export function replace(str: string, start: number, str1: string) {
  return str.substring(0, start - 1) + str1 + str.substring(str1.length + start - 1);
}

export function playerByEntity(e: Entity) {
  return e as Player;
}

export function rgb(r: number, g: number, b: number) {
  return {
    red: r / 255,
    green: g / 255,
    blue: b / 255,
  };
}

export function debounce(f: Function, t: number) {
  let timeoutId: number;

  return function (...args: any[]) {
    if (timeoutId) system.clearRun(timeoutId);
    timeoutId = system.runTimeout(() => {
      f(...args);
    }, t);
  };
}

export function playerByName(n: string) {
  return world.getPlayers({ name: n })[0];
}

let currentAreaId = 0;
export function loadArea(dim: Dimension, p: BlockVolume) {
  dim.runCommand(
    `tickingarea add ${p.from.x} ${p.from.y} ${p.from.z} ${p.to.x} ${p.to.y} ${p.to.z} temp_${currentAreaId}`
  );
  currentAreaId++;
  return currentAreaId - 1;
}
export function unloadArea(dim: Dimension, id: number) {
  dim.runCommand(`tickingarea remove temp_${id}`);
  currentAreaId--;
}
