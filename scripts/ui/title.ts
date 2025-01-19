import { Player, RawText } from "@minecraft/server";
import { Text } from "../text";
import flags from "../flags";

export function showSubTitle(p: Player, rt: RawText) {
  p.sendMessage(new Text().txt(flags.flag_subtile).raw(rt));
}
