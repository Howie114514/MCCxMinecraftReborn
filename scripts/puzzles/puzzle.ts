import { Player, system } from "@minecraft/server";
import tr from "../lang";
import { Logger } from "../logger";
import { challenges } from "../challenges";
import { sound } from "../sound";

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
      sound.play(p, "puzzle_complete", { volume: 2 });
      challenges.challenge.recordProgesss(p, 1);
      Logger.info("玩家完成谜题：", p.name, this.day);
    }
  }
}

export namespace puzzles {
  /**
   * 在中心的皇冠上使用“挥手”表情。
   */
  export const day1 = new Puzzle(1);
  /**
   * 前往时之沙大厅的右侧水柱上，在钻石眼石像前使用“派对拉炮”玩具。
   */
  export const day2 = new Puzzle(2);
  /**
   * 前往中心的王牌竞速左侧金鸭子下，然后游泳踩下压力板并进入活板门下方，完成跑酷，最终需要走进一个传送门框架。
   */
  export const day3 = new Puzzle(3);
  /**
   * 前往网格跑者大厅。往右侧出口走，然后直走，当看到“复制画作”房间时右转，爬上顶楼，左侧有一名带有绿色星星眼的观众，在其面前使用“迪斯科球”玩具。
   */
  export const day4 = new Puzzle(4);
  /**
   * 前往熔毁大厅。转身，顺着左边的路进入室内，立刻左转上楼，顺着路走，跳进对面的黄黑门框处，完成跑酷（需要翻越栏杆）。最后走楼梯上圆台，站在中间使用“小块蛋糕”食物。
   */
  export const day5 = new Puzzle(5);
  export const day6 = new Puzzle(6);
  export const day7 = new Puzzle(7);
}

export function getPuzzles(p: Player) {
  return Object.keys(JSON.parse((p.getDynamicProperty("mccr.p:puzzle_data") as string) ?? "{}")).length;
}
