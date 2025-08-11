import {
  BlockPermutation,
  BlockVolume,
  Direction,
  EnchantmentType,
  EnchantmentTypes,
  Entity,
  EntityDamageCause,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  world,
} from "@minecraft/server";
import { doors, hardcoded_melt_order, mobs, points, spawners, structure_points } from "../data/meltdown";
import { BasicGame, ComplexGame } from "../game";
import {
  BlockVolumeArguments,
  fill,
  forIn,
  forInAsync,
  getHat,
  giveArmor,
  initializeBlockVolume,
  playerByEntity,
  removeArmor,
} from "../utils";
import { showMDGameBar } from "../ui/gamebar";
import { addCoins, getCoins } from "../gameData";
import { coordinates } from "../main";
import { inventory } from "../inventory";
import { sound } from "../sound";
import { MinecraftBlockTypes, MinecraftEnchantmentTypes } from "@minecraft/vanilla-data";
import { Vector3Utils } from "../minecraft/math";
import { gameInstances } from "./gameInstance";
import { Queue } from "../queue";
import { tr } from "../lang";
import { rules } from "../rule";
import { Logger } from "../logger";
import { showSubTitle } from "../ui/title";
import { showMDCompleteToast, Trophy } from "../ui/gametoast";
import { isReloaded } from "../main";
import { challenges } from "../challenges";
import { record } from "../record";

export type MeltdownPlayerData = {
  room: number;
  coins: number;
  killed: number;
};

export type MeltdownPlayerStats = {};

const default_time = rules.md_default_time as number;

class MDRoom {
  isMelting: boolean = false;
  restTime: number = 70 * TicksPerSecond;
  isValid: boolean = false;
  volume: BlockVolumeArguments;
  id = 0;
  time;
  anim_tick = 0;
  melt_tick = 0;
  meltdown: Meltdown;
  constructor(volume: BlockVolumeArguments, id: number, md: Meltdown, time: number | undefined = default_time) {
    this.volume = volume;
    this.meltdown = md;
    system.runInterval(() => {
      if (this.isValid) this.restTime--;
      if (this.restTime == 0 && this.isValid) {
        this.isValid = false;
        this.closeDoor();
        this.meltdown.loadStructure(this.id);
      }
    });
    system.runInterval(() => {
      if (this.isMelting && this.melt_tick >= 0) {
        this.melt_tick++;
      }
      if (this.isValid && !this.isMelting) {
        spawners[this.id]?.forEach(async (p) => {
          world.getDimension("overworld").spawnParticle("minecraft:mob_block_spawn_emitter", p);
          let l = mobs[this.id]?.length;
          if (l) {
            let id = Math.floor(Math.random() * l);
            let e = world
              .getDimension("overworld")
              .spawnEntity(
                mobs[this.id]?.[id],
                Vector3Utils.add(p, { x: Math.random(), y: Math.random(), z: Math.random() })
              );
            e.addTag("md_room_" + this.id.toString());
          }
        });
      }
    }, 10 * TicksPerSecond);
    this.id = id;
    this.time = time ?? (rules.md_default_time as number);
  }
  setup() {
    this.isMelting = false;
    this.melt_tick = -1;
    this.isValid = true;
    this.restTime = this.time;
    //let uid = this.gameUid;
    let gameUid = this.meltdown.gameUniqueId;
    this.meltdown.loadStructure(this.id);
    world
      .getDimension("overworld")
      .getEntities({ tags: ["md_room_" + this.id.toString()] })
      .forEach((e) => e.remove());
    this.closeDoor();
    Logger.info(gameUid);
    system.runTimeout(() => {
      Logger.info(gameUid);
      if (this.meltdown.inTheSameGame(gameUid)) {
        this.openDoor();
        this.melt();
      } else Logger.info("Canceled");
    }, Math.max(this.time - 31 * TicksPerSecond, 0));
    Logger.info("初始化熔毁房间：", this.id);
    Logger.info("调用栈：", new Error().stack);
  }
  openDoor() {
    let d = doors[this.id];
    fill(d, MinecraftBlockTypes.StructureVoid);
  }
  closeDoor() {
    let d = doors[this.id];
    fill(d, MinecraftBlockTypes.IronBlock);
  }
  melt() {
    let bv = initializeBlockVolume(this.volume);
    this.isMelting = true;
    system.runTimeout(() => {
      this.melt_tick = 0;
    }, 4 * TicksPerSecond);
    [Direction.East, Direction.North, Direction.South, Direction.West].forEach((d) => {
      world
        .getDimension("overworld")
        .fillBlocks(bv, BlockPermutation.resolve("noxcrew.ft:rotating_light", { "minecraft:cardinal_direction": d }), {
          blockFilter: {
            includePermutations: [
              BlockPermutation.resolve("noxcrew.ft:rotating_light_off", { "minecraft:cardinal_direction": d }),
            ],
          },
        });
    });

    system.runJob(
      function* (this: MDRoom) {
        let gameUid = this.meltdown.gameUniqueId;
        let size = bv.getSpan();
        let sections: BlockVolume[] = [];
        let sectionSizeX = size.x / 5;
        let sectionSizeZ = size.z / 5;
        for (let x = bv.getMin().x; x < bv.getMax().x; x += sectionSizeX) {
          for (let z = bv.getMin().z; z < bv.getMax().z; z += sectionSizeZ) {
            sections.push(
              new BlockVolume(
                { x: x, y: bv.getMin().y, z: z },
                { x: x + sectionSizeX - 1, y: bv.getMax().y, z: z + sectionSizeZ - 1 }
              )
            );
            yield;
          }
          yield;
        }
        let i = 0;
        for (let section of sections) {
          /*
          system.runTimeout(() => {
            fill(section, "noxcrew.ft:md_a", {
              blockFilter: { excludeTypes: [MinecraftBlockTypes.Air, MinecraftBlockTypes.LightBlock] },
            });
            system.runTimeout(() => {
              fill(section, MinecraftBlockTypes.Air, {
                blockFilter: { includeTypes: ["noxcrew.ft:md_a"] },
              });
            }, 5 * TicksPerSecond);
          }, (i / sections.length) * 25 * TicksPerSecond);
          */
          let t = (Math.random() > 0.5 ? 5 : 10) * TicksPerSecond;
          if (hardcoded_melt_order[this.id]?.includes(i)) {
            t = 20 * TicksPerSecond;
          }
          system.runTimeout(() => {
            if (this.meltdown.inTheSameGame(gameUid) && this.isMelting) {
              fill(section, "noxcrew.ft:md_a", {
                blockFilter: { excludeTypes: [MinecraftBlockTypes.Air, "minecraft:light_block"] },
              });
              system.runTimeout(() => {
                if (this.meltdown.inTheSameGame(gameUid) && this.isMelting)
                  fill(section, MinecraftBlockTypes.Air, {
                    blockFilter: { includeTypes: ["noxcrew.ft:md_a"] },
                  });
              }, 10 * TicksPerSecond);
            }
          }, t);
          i++;
          yield;
        }
        system.runTimeout(
          () =>
            world
              .getDimension("overworld")
              .getEntities({ tags: ["md_room_" + this.id.toString()] })
              .forEach((e) => e.remove()),
          30 * TicksPerSecond
        );
      }.apply(this)
    );
  }
}

export class Meltdown extends ComplexGame {
  name = "meltdown";
  music = "music_md";
  player_data: Record<string, MeltdownPlayerData> = {};
  global_data = {
    time: 70 * TicksPerSecond,
  };
  rooms = [
    new MDRoom(structure_points.r1, 0, this, 30 * TicksPerSecond),
    new MDRoom(structure_points.r2, 1, this),
    new MDRoom(structure_points.r3, 2, this),
    new MDRoom(structure_points.r4, 3, this),
    new MDRoom(structure_points.r5, 4, this),
    new MDRoom(structure_points.r6, 5, this),
    new MDRoom(structure_points.r7, 6, this),
    new MDRoom(structure_points.r8, 7, this),
  ];
  gameUniqueId = 0;
  isStarting: boolean = false;
  prompt_id: string = "melt";
  constructor() {
    super();
    //this.recover();
    system.runInterval(() => {
      forIn(this.players, (p) => {
        if (this.player_data[p.name]?.room) {
          let r = this.rooms[this.player_data[p.name]?.room];
          if (r.restTime == 30 * TicksPerSecond) {
            sound.play(p, "meltdown_alarm_start", {});
          }
          if (r.restTime <= 15 * TicksPerSecond && r.melt_tick % 20 == 0) {
            p.applyDamage(1, { cause: EntityDamageCause.fireTick });
          }
          if (r.melt_tick >= 0 && r.isMelting && r.melt_tick % (7 * TicksPerSecond) == 0) {
            sound.play(p, "meltdown_alarm_loop", {});
          }
        }
      });
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.md:recover") {
        //this.recover();
      }
      if (this.player_data[(ev.sourceEntity as Player)?.name ?? ""]) {
        let p = playerByEntity(ev.sourceEntity as Entity);
        if (ev.id == "mccr.md:enter_gate") {
          if (this.player_data[p.name] && this.player_data[p.name].room !== parseInt(ev.message)) {
            if (!this.rooms[parseInt(ev.message)]?.isValid) {
              this.rooms[parseInt(ev.message)].setup();
            }
            p.getComponent("health")?.resetToMaxValue();
            this.player_data[p.name].room = parseInt(ev.message);
            showSubTitle(p, tr("txt.melt.room", (parseInt(ev.message) - 1).toString()));
            sound.play(p, "room_clear", {});
          }
        }
      }
      if (ev.id == "mccr.md:test") {
        this.rooms[parseInt(ev.message)]?.melt();
      }
    });
    world.afterEvents.entitySpawn.subscribe((ev) => {
      if (ev.entity.getComponent("projectile")?.owner?.typeId == "minecraft:player") {
        ev.entity.addTag("by_player");
      }
    });
    world.afterEvents.projectileHitEntity.subscribe((ev) => {
      if (ev.getEntityHit().entity?.getComponent("minecraft:type_family")?.hasTypeFamily("md_mob")) {
        let e = ev.getEntityHit().entity;
        e?.triggerEvent("mccr:freeze");
        system.runTimeout(() => {
          if (e?.isValid) {
            e.triggerEvent("mccr:melt");
          }
        }, 10 * TicksPerSecond);
      }
    });
    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (/md_/.test(ev.hitEntity.typeId)) {
        if (ev.hitEntity.isValid ? ev.hitEntity.getProperty("noxcrew.ft:frozen") : false) {
          ev.hitEntity.dimension.spawnParticle("noxcrew.ft:frozen_shatter", ev.hitEntity.location);
          ev.hitEntity.dimension.spawnParticle("noxcrew.ft:coin_burst_small", ev.hitEntity.location);
          sound.play(ev.hitEntity.dimension, "enemy_shatter", { location: ev.hitEntity.location });
          ev.hitEntity.remove();
          if (this.player_data[(ev.damagingEntity as Player).name]) {
            this.player_data[(ev.damagingEntity as Player).name].coins += 3;
            this.player_data[(ev.damagingEntity as Player).name].killed += 1;
          }
        }
      }
    });
    system.runInterval(() => {
      forInAsync(this.players, (p, n) => {
        if (!p?.isValid) {
          delete this.players[n];
        }
        if (p && !this.rooms[this.player_data[p?.name]?.room]?.isValid) {
          this.player_finish(p);
          p.teleport(coordinates.meltdown);
        }
        if (this.rooms[this.player_data[p?.name]?.room]?.restTime == 30 * TicksPerSecond) {
          p.onScreenDisplay.setActionBar(tr("txt.melt.warning"));
          showSubTitle(p, tr("txt.melt.warning_hint"));
        }
      });
    });
    world.afterEvents.playerSpawn.subscribe((ev) => {
      if (!ev.initialSpawn && this.players[ev.player.name]) {
        ev.player.teleport(coordinates.meltdown);
        this.player_finish(ev.player);
      }
    });
  }
  loadStructure(r: number) {
    let { x, y, z } = structure_points[`r${r + 1}`].from;
    world.getDimension("overworld").runCommand(`structure load r${r + 1} ${x} ${y} ${z}`);
  }
  closeDoor(id: number) {}

  start() {
    this.isStarting = true;
    //this.recover();
    super.start();

    this.gameUniqueId = Date.now();
    this.rooms[0].setup();
    forIn(this.players, (p) => {
      p.teleport(points.start);
      p.triggerEvent("mccr:become_not_invulnerable");
      p.onScreenDisplay.setActionBar(tr("txt.tut.melt_title"));
      p.sendMessage(tr("txt.tut.melt_text"));
      this.player_data[p.name] = { room: 0, coins: 0, killed: 0 };
      let bis = new ItemStack("minecraft:bow");
      bis.getComponent("enchantable")?.addEnchantments([
        { type: EnchantmentTypes.get(MinecraftEnchantmentTypes.BowInfinity) as EnchantmentType, level: 1 },
        { type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Unbreaking) as EnchantmentType, level: 3 },
      ]);
      inventory.save(p);
      inventory.set(p, {
        0: bis,
        1: new ItemStack("minecraft:arrow", 64),
        8: new ItemStack("noxcrew.ft:leave_game"),
      });
      giveArmor(p);
    });
    this.isStarting = false;
  }
  player_finish(p: Player, all?: boolean): void {
    let d = this.player_data[p.name];
    if (d) {
      if (d.room) {
        let isNewRecord = record.update(p, "md", d.coins);
        showMDCompleteToast(
          p,
          d.coins,
          d.killed,
          d.room,
          isNewRecord,
          record.get(p, "md").toString(),
          d.room <= 1
            ? Trophy.copper
            : d.room > 1 && d.room <= 3
            ? Trophy.iron
            : d.room > 3 && d.room <= 5
            ? Trophy.gold
            : d.room == 6
            ? Trophy.diamond
            : Trophy.netherrite
        );
        if (d.room >= 3) {
          challenges.md.recordProgesss(p);
        }
        if (getHat(p)?.typeId == "noxcrew.ft:beanie_yellow") challenges.yellow.recordProgesss(p, d.killed);
      }
      if (all) {
        p.applyKnockback({ x: 0, z: 7.5 }, 0);
      }
      addCoins(p, d.coins);
      //p.sendMessage("你完成了游戏");
      this.removePlayer(p);
    }
  }
  player_quit(p: Player, withItem = false): void {
    if (withItem) p.teleport(coordinates.meltdown);
    this.removePlayer(p);
  }
  inTheSameGame(uid: number) {
    return this.gameUniqueId == uid && this.started;
  }
  removePlayer(p: Player): void {
    delete this.player_data[p.name];
    delete this.players[p.name];
    removeArmor(p);
    gameInstances.lobby.addPlayer(p);
  }
  showGamebar(p: Player): void {
    let room = this.rooms[this.player_data[p.name]?.room];
    showMDGameBar(
      p,
      `\ue195 ${this.player_data[p.name].coins} ${room?.isMelting ? "\ue1a1" : "\ue1a0"} ${Math.floor(
        room.restTime / TicksPerSecond
      )}s ${String.fromCharCode(57767 + (this.player_data[p.name]?.room ?? 0))}`,
      0,
      getCoins(p)
    );
  }
  end(): void {
    if (this.started) {
      this.rooms.forEach((r) => {
        r.isValid = false;
        r.isMelting = false;
      });
      super.end();
      //this.recover();
    }
  }
}

//TODO
class MeltdownBase extends BasicGame {
  queue = new Queue<Player>();
  instances: Meltdown[] = [];
  constructor() {
    super();
  }
  addPlayer(p: Player): void {
    this.queue.enqueue(p);
  }
  removePlayer(p: Player): void {
    this.queue.remove(p);
  }
}
