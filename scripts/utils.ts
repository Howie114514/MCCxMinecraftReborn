import {
  BlockFillOptions,
  BlockPermutation,
  BlockType,
  BlockVolume,
  Dimension,
  Entity,
  EntityComponentTypes,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  Vector3,
  world,
} from "@minecraft/server";
import { Logger } from "./logger";
import { Text } from "./text";
import { BasicGame } from "./game";
import { sound } from "./sound";

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
  try {
    return world.getPlayers({ name: n })[0];
  } catch (e) {
    return;
  }
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

export namespace random {
  export function randint(from: number, to: number) {
    return Math.min(from, to) + Math.floor(Math.random() * (Math.max(from, to) - Math.min(from, to)));
  }
  export function choice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export type EntityPropertyProxy = { entity: Entity; [x: string]: string | number | boolean | Entity | undefined };
export function createEntityPropertyProxy(e: Entity) {
  return new Proxy<EntityPropertyProxy>(
    { entity: e },
    {
      get(target, p, receiver) {
        return target.entity.getProperty(p as string);
      },
      set(target, p, newValue, receiver) {
        target.entity.setProperty(p as string, newValue);
        return true;
      },
    }
  );
}

export function useItem(p: Player) {
  let slot = p.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Mainhand);
  slot?.setItem(slot.amount == 1 ? undefined : new ItemStack(slot.getItem()?.typeId ?? "", slot.amount - 1));
}

export interface BlockVolumeArguments {
  from: Vector3;
  to: Vector3;
}
export function createBlockVolumeArgs(from: Vector3, to: Vector3): BlockVolumeArguments {
  return { from, to };
}
export function initializeBlockVolume({ from, to }: BlockVolumeArguments) {
  return new BlockVolume(from, to);
}
export function fill(bv: BlockVolumeArguments, b: BlockPermutation | BlockType | string, opt?: BlockFillOptions) {
  world.getDimension("overworld").fillBlocks(initializeBlockVolume(bv), b, opt);
}

export function runAfterStartup(cb: Function) {
  system.beforeEvents.startup.subscribe(() => {
    system.run(() => {
      cb();
    });
  });
}

export function getHat(p: Player) {
  return p.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Head);
}

export function asPlayer(e?: Entity): Player | false {
  return e?.typeId == "minecraft:player" ? (e as Player) : false;
}

export function give(p: Player, item: ItemStack) {
  p.getComponent(EntityComponentTypes.Inventory)?.container.addItem(item);
}

export function choice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function setFog(p: Player, fog: string) {
  try {
    p.runCommand(`fog @s remove mccr_current`);
  } catch (e) {}
  p.runCommand(`fog @s push ${fog} mccr_current`);
}

export function giveArmor(p: Player) {
  let component = p.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  component.setEquipment(EquipmentSlot.Chest, new ItemStack("minecraft:iron_chestplate"));
  component.setEquipment(EquipmentSlot.Legs, new ItemStack("minecraft:iron_leggings"));
  component.setEquipment(EquipmentSlot.Feet, new ItemStack("minecraft:iron_boots"));
}

export function removeArmor(p: Player) {
  let component = p.getComponent(EntityComponentTypes.Equippable) as EntityEquippableComponent;
  component.setEquipment(EquipmentSlot.Chest, undefined);
  component.setEquipment(EquipmentSlot.Legs, undefined);
  component.setEquipment(EquipmentSlot.Feet, undefined);
}
