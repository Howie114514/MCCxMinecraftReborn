import { Player, system } from "@minecraft/server";
import tr from "../lang";
import { Logger } from "../logger";

export class Puzzle {
  day;
  constructor(day?: number) {
    this.day = day ?? 1;
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.sourceEntity && ev.id == `mccr.p:complete_${this.day}`) {
        this.complete(ev.sourceEntity as Player);
      }
    });
  }
  complete(p: Player) {
    let o = JSON.parse((p.getDynamicProperty("mccr.p:puzzle_data") as string) ?? "{}");
    if (!o[`day_${this.day}`]) {
      o[`day_${this.day}`] = true;
      p.dimension.spawnParticle("noxcrew.ft:party_popper", p.location);
      p.setDynamicProperty("mccr.p:puzzle_data", JSON.stringify(o));
      p.onScreenDisplay.setActionBar(tr("txt.misc.msg9"));
      p.playSound("puzzle_complete");
      Logger.info("玩家完成谜题：", p.name, this.day);
    }
  }
}

export namespace puzzles {
  export const day1 = new Puzzle(1);
  export const day2 = new Puzzle(2);
  export const day7 = new Puzzle(7);
}

export function getPuzzles(p: Player) {
  return Object.keys(JSON.parse((p.getDynamicProperty("mccr.p:puzzle_data") as string) ?? "{}")).length;
}
