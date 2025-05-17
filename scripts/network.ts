import { Entity, Player, system, Vector3, world } from "@minecraft/server";
import EventEmitter from "eventemitter3";
import environment, { envTypes } from "./environment";
import { plugin } from "./plugin";

/**
 * 适配插件
 * https://github.com/Howie114514/MCCxMinecraftReborn-llplugin
 */
export namespace network {
  export function syncEntityProperty(target: Entity, player: Player, property: string, value: boolean) {
    if (!isLevilamina()) return;
    plugin.send({ type: plugin.BPMsgTypes.set_property, actor: target.id, prop: property, value, player: player.name });
  }
  export function spawnParticleForPlayer(p: Player, particle: string, pos: Vector3) {
    if (!isLevilamina()) return;
    plugin.send({ type: plugin.BPMsgTypes.spawn_particle, particle, pos });
  }
  export function setTime(p: Player, time: number) {
    if (!isLevilamina()) return;
    plugin.send({ type: plugin.BPMsgTypes.set_time, time, player: p.name });
  }
  export function isLevilamina() {
    return environment.type == envTypes.LevilaminaWithPlugin;
  }
}
