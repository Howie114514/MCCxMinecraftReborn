import { Player, world } from "@minecraft/server";
import { vaildateNum } from "./utils";
import { Text } from "./text";

export function addCoins(p: Player, c: number) {
  p.setDynamicProperty("mccr:coins", ((p.getDynamicProperty("mccr:coins") ?? 0) as number) + vaildateNum(c));
}
export function setCoins(p: Player, c: number) {
  p.setDynamicProperty("mccr:coins", vaildateNum(c));
}
export function getCoins(p: Player) {
  return (p.getDynamicProperty("mccr:coins") as number) ?? 0;
}

export function clearAllData(p: Player) {
  p.clearDynamicProperties();
  p.sendMessage(new Text().txt("请退出重进保证生效"));
}
