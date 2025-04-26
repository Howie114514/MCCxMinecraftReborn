import { Player } from "@minecraft/server";
import { replace } from "../utils";
import { Text } from "../text";

export enum Trophy {
  netherrite = 1,
  diamond = 2,
  gold = 3,
  iron = 4,
  copper = 5,
}

export function showARCompleteToast(p: Player, coins: number, time: string, trophy: Trophy, isNewRecord = true) {
  var t = `§znox:completenox:type_ar nox:ar_trophy_${trophy} ${
    isNewRecord ? "nox:new_record " : ""
  }§zd1~~~~~~~~~~~ §zd2~~~~~~~~~~~`;
  let l = isNewRecord ? "nox:new_record ".length : 0;
  t = replace(t, 47 + l, coins.toString());
  t = replace(t, 64 + l, time);
  p.onScreenDisplay.setActionBar(t);
}

export function showSOTCompleteToast(
  p: Player,
  earned: number,
  collected: number,
  chests: number,
  time: string,
  escaped: boolean,
  showNum = false,
  num = 0
) {
  var t = `§znox:completenox:type_sot ${
    escaped ? "nox:sot_escaped" : "nox:sot_failed"
  } §zd1~~~~~~~~~~~ §zd2~~~~~~~~~~~ §zd3~~~~~~~~~~~ §zd4~~~~~~~~~~~ §zd5~~~~~~~~~~~ §zd6~~~~~~~~~~~`;
  t = replace(t, 48, collected.toString());
  t = replace(t, 64, earned.toString());
  t = replace(t, 80, chests.toString());
  t = replace(t, 96, time);
  t = replace(t, 112, showNum ? "\ue1b8" + num.toString() : "~");
  t = replace(t, 128, earned.toString());
  p.onScreenDisplay.setActionBar(t);
}

export function showMDCompleteToast(
  p: Player,
  coins: number,
  killed: number,
  r: number,
  hs: number,
  trophy: Trophy = Trophy.netherrite
) {
  var t = `§znox:complete nox:type_md nox:ar_trophy_${trophy} nox:md_rooms_${r} §zd1~~~~~~~~~~~ §zd2~~~~~~~~~~~  §zd3~~~~~~~~~~~ §zd4~~~~~~~~~~~ §zd5~~~~~~~~~~~`;
  t = replace(t, 63, coins.toString());
  t = replace(t, 79, killed.toString());

  p.onScreenDisplay.setActionBar(t);
}

export function showGRCompleteToast(p: Player, coins: number, mobs: number, blocks: number, cakes: number) {
  let t = new Text();
  t.txt("§znox:complete nox:type_gr ");
  t.txt("§zd1" + coins.toString() + "~".repeat(11 - coins.toString().length));
  t.txt(" §zd2" + mobs.toString() + "~".repeat(11 - mobs.toString().length));
  t.txt(" §zd3" + blocks.toString() + "~".repeat(11 - blocks.toString().length));
  t.txt(" §zd4" + cakes.toString() + "~".repeat(11 - cakes.toString().length));
  p.onScreenDisplay.setActionBar(t);
}
