import { EffectType, EffectTypes, Player, system, TicksPerSecond, world } from "@minecraft/server";
import { ComplexGame } from "../game";
import { FTSounds } from "../sound";
import { Text } from "../text";
import { forIn } from "../utils";
import { Logger } from "../logger";
import { overworld } from "../constants";
import { showSubTitle } from "../ui/title";
import { starts } from "../data/gr";
import { inventory } from "../inventory";
import { Queue } from "../queue";
import { coordinates } from "../main";
import { Vector2Utils, Vector3Utils } from "@minecraft/math";
import { gameInstances } from "./gameInstance";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";

export class GRLevel {
  game: GridRunners = gameInstances.grid_runners;
  playerInvulnerable = false;
  id = 0;
  players: Player[] = [];
  constructor() {}
  loop_interval = 0;
  loop() {
    if (this.playerInvulnerable) {
      this.players.forEach((p) => p.getComponent("health")?.resetToMaxValue());
    }
  }
  start() {
    Logger.info("Level started:", this.id);
  }
  end() {
    this.players = [];
  }
}
export class GridRunners extends ComplexGame {
  music: FTSounds = "music_gr";
  name: string = "grid_runners";
  started: boolean = true;
  constructor() {
    super();
    world.afterEvents.entitySpawn.subscribe((ev) => {
      let loc = ev.entity.location;
      if (ev.entity.typeId == "minecraft:tnt") {
        system.runTimeout(() => {
          if (ev.entity.isValid()) ev.entity.remove();
          overworld.createExplosion(loc, 20, { breaksBlocks: false });
        }, 81);
      }
    });
  }
  start(): void {
    super.start();
    let index = 0;
    Object.keys(this.players).forEach((name, index, arr) => {
      let player = this.players[name];
      inventory.save(player);
      player.onScreenDisplay.setActionBar(new Text().tr("txt.title.grid_runners"));
      let startLoc = starts[index];
      player.teleport(startLoc, { facingLocation: Vector3Utils.add(startLoc, { x: 1, y: 0, z: 0 }) });
      for (let i = 0; i < 10; i++)
        overworld.spawnEntity("minecraft:tnt", Vector3Utils.add(startLoc, { x: -3, y: 0, z: 0 }));
    });
  }
  removePlayer(p: Player): void {
    p.teleport(coordinates.grid_runners);
    super.removePlayer(p);
  }
}
