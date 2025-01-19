import { Player } from "@minecraft/server";
import { replace } from "../utils";
import { getPuzzles } from "../puzzles/puzzle";
/**
function replace(str, start, str1){
  return str.substring(0,start-1)+str1+str.substring(0,str1.length+start-1);
}
 */
export function showLobbyGameBar(p: Player, _: number, coins: number) {
  var text =
    "nox:barlby__cdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz____________________11451123456789012345678";
  let glyphs = getPuzzles(p);
  var glyphstxt = "\ue177" + "\ue179".repeat(glyphs) + "\ue17a".repeat(7 - glyphs);
  text = replace(text, 13, glyphstxt + "_".repeat(50 - glyphstxt.length - 1));
  text = replace(text, 83, coins.toString() + "_".repeat(23 - coins.toString().length));
  p.onScreenDisplay.setTitle(text);
}
export function showARGameBar(p: Player, time: string, _: number, coins: number) {
  var text = "nox:barace__cdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz____________bc______114511234567890123";
  let glyphs = getPuzzles(p);
  var glyphstxt = glyphs.toString();
  text = replace(text, 13, time + "_".repeat(50 - time.length));
  text = replace(text, 78, glyphstxt);
  text = replace(text, 83, coins.toString() + "_".repeat(23 - coins.toString().length));
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
