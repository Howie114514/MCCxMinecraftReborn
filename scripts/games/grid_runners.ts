import { system, TicksPerSecond, world } from "@minecraft/server";
import { ComplexGame } from "../game";
import { FTSounds } from "../sound";
import { Text } from "../text";
import { forIn } from "../utils";
import { Logger } from "../logger";
import { overworld } from "../constants";
import { showSubTitle } from "../ui/title";

export class GridRunners extends ComplexGame {
  music: FTSounds = "music_gr";
  constructor() {
    super();
    world.afterEvents.entitySpawn.subscribe((ev) => {
      let loc = ev.entity.location;
      if (ev.entity.typeId == "minecraft:tnt") {
        system.runTimeout(() => {
          if (ev.entity.isValid()) ev.entity.remove();
          overworld.createExplosion(loc, 3, { breaksBlocks: false });
        }, 81);
      }
    });
  }
  start(): void {
    super.start();
    let index = 0;
    for (const key in this.players) {
      if (this.players.prototype.hasOwnProperty.call(this.players, key)) {
        const p = this.players[key];
        if (p) {
          showSubTitle(p, new Text().tr("txt.title.grid_runners"));
        }
      }
    }
  }
}
