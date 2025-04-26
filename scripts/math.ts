import { Vector3Utils } from "./minecraft/math";
import { BlockVolume, Player, Vector3 } from "@minecraft/server";

export namespace Vec3Utils {
  export function isBetween(v: Vector3, v1: Vector3, v2: Vector3) {
    return (
      Math.min(v1.x, v2.x) <= v.x &&
      v.x <= Math.max(v1.x, v2.x) &&
      Math.min(v1.y, v2.y) <= v.y &&
      v.y <= Math.max(v1.y, v2.y) &&
      Math.min(v1.z, v2.z) <= v.z &&
      v.z <= Math.max(v1.z, v2.z)
    );
  }
  export function toMiniString(v: Vector3): string {
    return `${v.x}$${v.y}$${v.z}`;
  }
  export function distance(v: Vector3, v1: Vector3) {
    return Math.sqrt(Math.pow(v.x - v1.x, 2) + Math.pow(v.y - v1.y, 2) + Math.pow(v.z - v1.z, 2));
  }
  export function getVolume(bv: BlockVolume) {
    let delta = Vector3Utils.subtract(bv.getMax(), bv.getMin());
    return delta.x * delta.y * delta.z;
  }
  export function getProjectileMotion(player: Player, speed: number) {
    let pitch = player.getRotation().x,
      yaw = player.getRotation().y;
    let y1 = (yaw + 90) * (Math.PI / 180);
    let p1 = pitch * -(Math.PI / 180);
    return {
      x: Math.cos(y1) * Math.cos(p1) * speed,
      y: Math.sin(p1) * speed,
      z: Math.sin(y1) * Math.cos(p1) * speed,
    };
  }
}
