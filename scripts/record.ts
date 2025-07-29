import { Player, Vector3 } from "@minecraft/server";

export namespace record {
  export interface GameRecord {
    gr: number;
    sot: number;
    md: number;
    ar: number; //time
  }
  export function get(p: Player, game: keyof GameRecord): number {
    return (
      JSON.parse((p.getDynamicProperty("mccr.game:record") as string) ?? "{}")[game] ??
      (game == "ar" ? Number.MAX_SAFE_INTEGER : -1)
    );
  }
  export function set(p: Player, game: keyof GameRecord, num: number) {
    let obj: GameRecord = JSON.parse((p.getDynamicProperty("mccr.game:record") as string) ?? "{}");
    obj[game] = num;
    p.setDynamicProperty("mccr.game:record", JSON.stringify(obj));
  }
  export function update(p: Player, game: keyof GameRecord, num: number) {
    let o = get(p, game);
    if ((game == "ar" && num < o) || (game != "ar" && num > o)) {
      set(p, game, num);
      return true;
    }
    return false;
  }
}
