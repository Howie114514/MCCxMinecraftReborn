import { Player, system } from "@minecraft/server";
import { fill, fillString, formatTime, replace } from "../utils";
import { Text } from "../text";

export enum Trophy {
  netherrite = 1,
  diamond = 2,
  gold = 3,
  iron = 4,
  copper = 5,
}

export function showARCompleteToast(
  p: Player,
  coins: number,
  time: string,
  trophy: Trophy,
  isNewRecord: boolean,
  highscore: string
) {
  let text = new Text();
  text.txt(`§znox:complete nox:type_ar nox:ar_trophy_${trophy} `);

  text.txt("§zd1" + fillString(coins.toString(), 11));
  text.txt("§zd2" + fillString(time, 11));
  text.txt("§zd3~~~~~~~~~~~");
  text.txt("§z" + fillString(highscore, 11));
  if (isNewRecord) text.txt("nox:new_record ");

  p.onScreenDisplay.setActionBar(text);
}

export function showSOTCompleteToast(
  p: Player,
  earned: number,
  collected: number,
  chests: number,
  time: string,
  escaped: boolean,
  failed: boolean,
  lostCoins: number,
  isNewRecord: boolean,
  highscore: string
) {
  let text = new Text();
  text.txt(`§znox:complete nox:type_sot ${escaped ? "nox:sot_escaped" : "nox:sot_failed"} `);
  //1
  text.txt("§zd1" + fillString(collected.toString(), 11));
  //2
  text.txt("§zd2" + fillString(earned.toString(), 11));
  //3
  text.txt("§zd3" + fillString(chests.toString(), 11));
  //4
  text.txt("§z" + fillString(time, 11));
  //5
  text.txt("§zd5" + fillString(failed ? "\ue1b8" + lostCoins.toString() : "", 11));
  //6
  text.txt("§zd6" + fillString(highscore, 11));

  if (isNewRecord) text.txt("nox:new_record");
  console.log(text);
  p.onScreenDisplay.setActionBar(text);
}

export function showMDCompleteToast(
  p: Player,
  coins: number,
  killed: number,
  r: number,
  isNewRecord: boolean,
  highscore: string,
  trophy: Trophy = Trophy.netherrite
) {
  let text = new Text();
  text.txt(`§znox:complete nox:type_md nox:ar_trophy_${trophy} nox:md_rooms_${r}`);
  text.txt("§zd1" + fillString(coins.toString(), 11));
  text.txt("§zd2" + fillString(killed.toString(), 11));
  text.txt("§zd3~~~~~~~~~~~§zd4~~~~~~~~~~~");
  text.txt("§zd5" + fillString(highscore, 11));
  if (isNewRecord) text.txt("nox:new_record");
  p.onScreenDisplay.setActionBar(text);
}

export function showGRCompleteToast(
  p: Player,
  coins: number,
  mobs: number,
  blocks: number,
  cakes: number,
  isNewRecord: boolean,
  highscore: string
) {
  let t = new Text();
  t.txt("§znox:complete nox:type_gr ");
  t.txt("§zd1" + coins.toString() + "~".repeat(11 - coins.toString().length));
  t.txt(" §zd2" + mobs.toString() + "~".repeat(11 - mobs.toString().length));
  t.txt(" §zd3" + blocks.toString() + "~".repeat(11 - blocks.toString().length));
  t.txt(" §zd4" + cakes.toString() + "~".repeat(11 - cakes.toString().length));
  t.txt(" §zd5" + fillString(highscore, 11));
  if (isNewRecord) t.txt("nox:new_record");
  p.onScreenDisplay.setActionBar(t);
}

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id == "mccr.toast:test") {
    showGRCompleteToast(ev.sourceEntity as Player, 114, 114, 7, 2, true, "114514");
  }
});
