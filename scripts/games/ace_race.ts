import {
  BlockVolume,
  BlockVolumeBase,
  ItemStack,
  ListBlockVolume,
  Player,
  system,
  TicksPerSecond,
  Trigger,
  world,
} from "@minecraft/server";
import { BasicGame } from "../game";
import { showARGameBar } from "../ui/gamebar";
import { formatTime, getHat, tick2Time } from "../utils";
import { showARCompleteToast, Trophy } from "../ui/gametoast";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { Vec3Utils } from "../math";
import tr from "../lang";
import { FTSoundDefinitions, sound } from "../sound";
import { inventory } from "../inventory";
import { spawnpoints } from "../data/ar";
import { Logger } from "../logger";
import { challenges } from "../challenges";
import { addCoins } from "../gameData";

export type Range = {
  max?: number;
  min?: number;
};
export function inRange(n: number, r: Range) {
  return n <= (r.max ?? Number.MAX_SAFE_INTEGER) && n >= (r.min ?? 0);
}

export interface ARPlayerStats {
  launchPad: number;
  speed: number;
  elytra: number;
}

export class AceRace extends BasicGame {
  name = "ace_race";
  music = "music_ar";
  timer: Record<string, number> = {};
  stats: Record<string, ARPlayerStats> = {};
  spawnpoints: Record<string, number> = {};
  trophys: Range[] = [
    {
      min: 0,
      max: 71,
    },
    {
      min: 71,
      max: 91,
    },
    {
      min: 91,
      max: 121,
    },
    {
      min: 121,
      max: 135,
    },
    {
      min: 135,
    },
  ];
  constructor() {
    super();
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.sourceEntity?.typeId == "minecraft:player") {
        let p = ev.sourceEntity as Player;
        if (ev.id == "mccr.ar:spawnpoint") {
          if (this.spawnpoints[p.name] != parseInt(ev.message)) {
            sound.play(p, "checkpoint_pass", {});
            this.spawnpoints[p.name] = parseInt(ev.message);
          }
        }
      }
    });
    world.afterEvents.playerEmote.subscribe((ev) => {
      if (
        ev.personaPieceId == "9a469a61-c83b-4ba9-b507-bdbe64430582" &&
        Vec3Utils.distance(ev.player.location, { x: 4226.24, y: 75.0, z: 2238.7 }) < 3
      ) {
        world
          .getDimension("overworld")
          .fillBlocks(
            new BlockVolume({ x: 4231, y: 76, z: 2237 }, { x: 4231, y: 79, z: 2239 }),
            MinecraftBlockTypes.Air
          );
        ev.player.playSound("castle_door");
        ev.player.onScreenDisplay.setActionBar(tr("txt.misc.msg8"));
        system.runTimeout(() => {
          world
            .getDimension("overworld")
            .fillBlocks(
              new BlockVolume({ x: 4231, y: 76, z: 2237 }, { x: 4231, y: 79, z: 2239 }),
              MinecraftBlockTypes.BrownWool
            );
        }, 5 * TicksPerSecond);
      }
    });
  }
  mainloop(): void {
    super.mainloop();
    world
      .getDimension("overworld")
      .getPlayers({ location: { x: 4227, y: 74, z: 2238 }, maxDistance: 3 })
      .forEach((p) => {
        if (!p.hasTag("ifoc")) {
          p.addTag("ifoc");
        }
      });
    world
      .getDimension("overworld")
      .getPlayers({ location: { x: 4227, y: 74, z: 2238 }, minDistance: 3, maxDistance: 5 })
      .forEach((p) => {
        if (p.hasTag("ifoc")) p.removeTag("ifoc");
      });
  }
  player_finish(p: Player): void {
    if (this.players[p.name]) {
      sound.play(p, "scoreacquired", undefined);
      p.applyKnockback({ x: -3, z: 0 }, 0.5);
      challenges.ar.recordProgesss(p);
      let stats = this.stats[p.name];
      if (getHat(p)?.typeId == "noxcrew.ft:beanie_red") challenges.red.recordProgesss(p, stats.launchPad);
      if (getHat(p)?.typeId == "noxcrew.ft:beanie_orange") challenges.orange.recordProgesss(p, stats.speed);
      if (getHat(p)?.typeId == "noxcrew.ft:beanie_pink") challenges.pink.recordProgesss(p, stats.elytra);
      let time = (Date.now() - this.timer[p.name]) / 1000;
      let t: Trophy = 1;
      this.trophys.forEach((tro, index) => {
        if (inRange(time, tro)) {
          t = index + 1;
        }
      });
      let c =
        t == Trophy.netherrite
          ? 400
          : t == Trophy.diamond
          ? 300
          : t == Trophy.gold
          ? 180
          : t == Trophy.iron
          ? 140
          : 100;
      addCoins(p, c);
      let isNewRecord = false;
      if (
        Date.now() - this.timer[p.name] <
        ((p.getDynamicProperty("mccr.ar:new_record") ?? Number.MAX_SAFE_INTEGER) as number)
      ) {
        isNewRecord = true;
        p.setDynamicProperty("mccr.ar:new_record", Date.now() - this.timer[p.name]);
      }
      showARCompleteToast(p, c, formatTime(Date.now() - this.timer[p.name]), t, isNewRecord);

      super.player_finish(p);
    }
  }
  player_quit(p: Player, withItem = false): void {
    if (withItem) {
      p.teleport({ x: 4247.34, y: 60.0, z: 2119.83 });
      p.playSound("leave_game");
    }
    super.player_quit(p);
  }
  player_join(p: Player): void {
    p.onScreenDisplay.setActionBar(tr("txt.tut.ace_title"));
    inventory.set(p, { 8: new ItemStack("noxcrew.ft:leave_game") });
    sound.play(p, "go", {});
    this.timer[p.name] = Date.now();
    this.stats[p.name] = {
      speed: 0,
      launchPad: 0,
      elytra: 0,
    };
  }
  player_onTick(p: Player): void {
    if (p.location.y <= 0) {
      this.player_respawn(p);
      sound.play(p, "rescue", {});
    }
    p.addEffect(MinecraftEffectTypes.InstantHealth, 10, { amplifier: 255, showParticles: false });
  }
  removePlayerByName(n: string): void {
    delete this.timer[n];
    delete this.spawnpoints[n];
    super.removePlayerByName(n);
  }
  showGameBar(p: Player): void {
    showARGameBar(
      p,
      "\ue197" + Math.floor((Date.now() - this.timer[p.name]) / 1000).toString() + "s",
      0,
      (p.getDynamicProperty("mccr:coins") as number) ?? 0
    );
  }
  player_respawn(p: Player): void {
    Logger.info(this.spawnpoints[p.name]);
    if (this.spawnpoints[p.name] != undefined) {
      p.teleport(spawnpoints[this.spawnpoints[p.name]]);
    } else p.teleport({ x: 4234.98, y: 60.0, z: 2120.14 });
  }
}
