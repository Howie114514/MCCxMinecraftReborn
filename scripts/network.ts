import { Entity, Player } from "@minecraft/server";

/**
 * 适配插件
 */
export namespace network {
  export function syncEntityProperty(
    target: Entity,
    player: Player,
    property: string,
    value: boolean | number | string
  ) {
    target.runCommand(`mccr syncprop ${player.name} ${property} ${JSON.stringify(value)}`);
  }
}
