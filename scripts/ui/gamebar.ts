import { Player, world } from "@minecraft/server";
import { replace } from "../utils";
import { getPuzzles } from "../puzzles/puzzle";
import { Text } from "../text";
/**
function replace(str, start, str1){
  return str.substring(0,start-1)+str1+str.substring(0,str1.length+start-1);
}
 */
export function showLobbyGameBar(p: Player, _: number, coins: number) {
  var text = new Text().txt("nox:barlby___");
  let glyphs = getPuzzles(p);
  var glyphstxt =
    "\ue177" +
    "\ue179".repeat(glyphs) +
    ((world.getDynamicProperty("mccr:theme") ?? "default") == "default" ? "\ue178" : "\ue17a").repeat(7 - glyphs);
  text.txt(glyphstxt);
  text.txt("_".repeat(82 - 13 - glyphstxt.length));
  text.txt(coins.toString());
  p.onScreenDisplay.setTitle(text);
}
export function showARGameBar(p: Player, time: string, _: number, coins: number) {
  var text = new Text().txt("nox:barace___");
  let glyphs = getPuzzles(p);
  var glyphstxt = glyphs.toString();
  text.txt(time);
  text.txt("_".repeat(76 - 2 - 13 - time.length) + "\u00a7");
  text.txt(glyphstxt);
  text.txt("_".repeat(82 - 77));
  text.txt(coins.toString());
  p.onScreenDisplay.setTitle(text);
}
export function showSOTGameBar(p: Player, info: string, _: number, coins: number) {
  var text = "nox:barsot________________________________________________________________________114511234567890123";
  let glyphs = getPuzzles(p);
  var glyphstxt = glyphs.toString();
  text = replace(text, 13, info);
  text = replace(text, 75, glyphstxt);
  text = replace(text, 83, coins.toString() + "_".repeat(23 - coins.toString().length));
  p.onScreenDisplay.setTitle(text);
}
export function showMDGameBar(p: Player, a1: string, _: number, coins: number) {
  var text = "nox:barmlt__cdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz____________________14511234567890123";
  let glyphs = getPuzzles(p);
  var glyphstxt = glyphs.toString();
  text = replace(text, 13, a1 + "_".repeat(50 - a1.length));
  text = replace(text, 73, glyphstxt);
  text = replace(text, 83, coins.toString() + "_".repeat(23 - coins.toString().length));
  p.onScreenDisplay.setTitle(text);
}
export function showGRGameBar(p: Player, info: string, hasAdditionalInfo: boolean, coins: number) {
  let text = new Text().txt("nox:bargrd___");
  text.txt(info + "_".repeat(63 + (hasAdditionalInfo ? 1 : 0) - info.length));
  text.txt(getPuzzles(p).toString());
  text.txt("__" + coins.toString());
  p.onScreenDisplay.setTitle(text);
}

export namespace gridRunnersGamebar {
  export function showGRGameBar(p: Player, info: string, coins: number) {
    let text = new Text().txt("nox:bargrd___");
    text.txt(info + "_".repeat(63 - info.length));
    text.txt(getPuzzles(p).toString());
    text.txt("_____" + coins.toString());
    p.onScreenDisplay.setTitle(text);
  }
  export function showGRGameBarWithAdditionalInfo(p: Player, info: string, coins: number) {
    let text = new Text().txt("nox:bargrd___");
    text.txt(info + "_".repeat(62 - info.length));
    text.txt(getPuzzles(p).toString());
    text.txt("______" + coins.toString());
    p.onScreenDisplay.setTitle(text);
  }
}
