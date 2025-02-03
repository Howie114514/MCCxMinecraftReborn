import { Entity, Player, system, Vector3, world } from "@minecraft/server";
import EventEmitter from "eventemitter3";
import { overworld } from "./constants";
import environment, { envTypes } from "./environment";

export type SpawnEntityPacketSentEvent = {
  typeId: string;
  player: string;
  entityPos: Vector3;
};

class NetworkEventEmitter extends EventEmitter<"spawnEntityPacketSent"> {
  on(event: "spawnEntityPacketSent", fn: (ev: SpawnEntityPacketSentEvent) => void, context?: any): this;
  on<T extends "spawnEntityPacketSent">(event: T, fn: (...args: any[]) => void, context?: any): this {
    return super.on(event, fn, context);
  }
  constructor() {
    super();
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.network:ev_spawnEntityPacketSent") {
        this.emit("spawnEntityPacketSent", JSON.parse(ev.message) as SpawnEntityPacketSentEvent);
      }
    });
  }
}
/**
 * 适配插件
 * https://github.com/Howie114514/MCCxMinecraftReborn-llplugin
 */
export namespace network {
  export function syncEntityProperty(target: Entity, player: Player, property: string, value: boolean) {
    try {
      return target.runCommand(`mccr syncprop ${property} ${value} "${player.name}"`).successCount >= 1;
    } catch (e) {
      return false;
    }
  }
  export function spawnParticleForPlayer(p: Player, particle: string, pos: Vector3) {
    overworld.runCommand(`mccr particle ${particle} ${pos.x} ${pos.y} ${pos.z} "${p.name}"`);
  }
  export let afterEvents = new NetworkEventEmitter();
  export function isLevilamina() {
    return environment.type == envTypes.LevilaminaWithPlugin;
  }
}
