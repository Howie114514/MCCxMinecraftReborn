import { Entity, Player, system, world } from "@minecraft/server";

/**
 * 适配插件
 * https://github.com/Howie114514/MCCxMinecraft-plugin
 */
export namespace network {
  export function syncEntityProperty(
    target: Entity,
    player: Player,
    property: string,
    value: boolean | number | string
  ) {
    return target.runCommand(`mccr syncprop ${player.name} ${property} ${JSON.stringify(value)}`).successCount >= 1;
  }
}
