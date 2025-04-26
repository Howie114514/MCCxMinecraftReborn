/**
 * 时之沙 - Sand Of Time
 * 本项目最大的依托石山
 */

import {
  DyeColor,
  EntityComponent,
  EntityComponentTypes,
  EntityHitEntityAfterEvent,
  EntityHitEntityAfterEventSignal,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  Vector3,
  world,
} from "@minecraft/server";
import { BasicGame } from "../game";
import { coordinates, isReloaded } from "../main";
import { Vec3Utils } from "../math";
import { Vector3Utils } from "../minecraft/math";
import { Text } from "../text";
import { tr } from "../lang";
import { showSOTGameBar } from "../ui/gamebar";
import { showSOTCompleteToast } from "../ui/gametoast";
import { forIn, playerByEntity, tick2Time } from "../utils";
import { gameInstances } from "./gameInstance";
import { addCoins } from "../gameData";
import { MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";
import { points as sotMobSpawnPoints } from "../data/sot";
import { inventory } from "../inventory";
import { showSubTitle } from "../ui/title";
import { Logger } from "../logger";
import { network } from "../network";
import environment, { envTypes } from "../environment";
import { sound } from "../sound";

export type SOTPlayerData = {
  collected_items: Record<string, boolean>;
  time: number;
  coins: number;
  lifeTime: number;
  escaped: boolean;
  opened_chests: number;
};

export class SandOfTime extends BasicGame {
  name = "sot";
  music: string = "music_sot";
  player_data: Record<string, SOTPlayerData> = {};
  spawner_points = sotMobSpawnPoints;
  mobs = [MinecraftEntityTypes.Zombie, MinecraftEntityTypes.Skeleton, MinecraftEntityTypes.Spider];
  tick_timer = 0;

  constructor() {
    super();
    const syncPropertyForPlayer = (p: Player) => {
      system.runTimeout(() => {
        if (network.isLevilamina())
          system.runJob(
            (function* (sot: SandOfTime) {
              for (let id of Object.keys(sot.player_data[p.name].collected_items)) {
                let p1 = id
                  .replace(/mccr\:collected_c|mccr\:collected_s|mccr\:collected_a|mccr\:collected_t/g, "")
                  .split("$");
                let pos: Vector3 = { x: parseInt(p1[0]), y: parseInt(p1[1]), z: parseInt(p1[2]) };
                if (Vec3Utils.distance(pos, p.location) < 100)
                  network.syncEntityProperty(
                    world
                      .getDimension("overworld")
                      .getEntitiesAtBlockLocation(pos)
                      .filter((e) =>
                        /^(noxcrew.ft:treasure_chest|noxcrew.ft:armor_podium|noxcrew.ft:key_podium|noxcrew.ft:coin_stack|noxcrew.ft:sand_blocks)$/.test(
                          e.typeId
                        )
                      )[0],
                    p,
                    "noxcrew.ft:collected",
                    sot.player_data[p.name].collected_items[id]
                  );
                yield;
              }
            })(this)
          );
      }, 1 * TicksPerSecond);
    };
    const syncAllProperties = () => {
      if (network.isLevilamina())
        system.runJob(
          (function* (sot: SandOfTime) {
            for (const p of Object.values(sot.players)) {
              syncPropertyForPlayer(p);
              yield;
            }
          })(this)
        );
    };
    if (network.isLevilamina()) system.runInterval(syncAllProperties, 5 * TicksPerSecond);
    world.afterEvents.entityHitEntity.subscribe((ev) => this.collect(ev));
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      let eheEvent: EntityHitEntityAfterEvent = { damagingEntity: ev.player, hitEntity: ev.target };
      this.collect(eheEvent);
    });
    world.afterEvents.playerSpawn.subscribe((ev) => {
      if (!ev.initialSpawn && this.players[ev.player.name]) {
        this.player_data[ev.player.name].escaped = false;
        this.player_finish(ev.player);
      }
    });
    world.afterEvents.entityDie.subscribe((ev) => {
      if (
        ev.damageSource.damagingEntity?.typeId == "minecraft:player" &&
        this.players[(ev.damageSource.damagingEntity as Player)?.name]
      ) {
        world.getDimension("overworld").spawnParticle("noxcrew.ft:coin_burst_small", ev.deadEntity.location);
        this.player_data[(ev.damageSource.damagingEntity as Player)?.name].coins += 3;
      }
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.sot:toggle_mode") {
        this.setProperty<boolean>("single_mode", !this.getProperty("single_mode", false));
        world.sendMessage(
          `[时之沙] 已切换模式。当前模式为${
            this.getProperty<boolean>("single_mode", false)
              ? "单人模式（沙子和金币会消失）"
              : "多人模式（沙子和金币不会消失，可供多人游玩）"
          }`
        );
      }
      if (ev.id == "mccr.sot:finish") {
        const p = ev.sourceEntity as Player;
        if (p) this.player_data[p.name].escaped = true;
      }
      if (ev.id == "mccr.sot:collect") {
        if (ev.sourceEntity) {
          let l = ev.sourceEntity?.location;
          let e = ev.sourceEntity;
          let p = ev.sourceEntity.dimension.getPlayers({ location: l, maxDistance: 0.5 })[0];
          if (e && p) {
            this.collect({ damagingEntity: p, hitEntity: e });
          }
        }
      }
      if (ev.id == "mccr.sot:reset_all") {
        world
          .getDimension("overworld")
          .getEntities({ type: "noxcrew.ft:coin_stack" })
          .forEach((e) => e.setProperty("noxcrew.ft:collected", false));
        world
          .getDimension("overworld")
          .getEntities({ type: "noxcrew.ft:sand_blocks" })
          .forEach((e) => e.setProperty("noxcrew.ft:collected", false));
        world
          .getDimension("overworld")
          .getEntities({ type: "noxcrew.ft:key_podium" })
          .forEach((e) => e.setProperty("noxcrew.ft:collected", false));
        world
          .getDimension("overworld")
          .getEntities({ type: "noxcrew.ft:armor_podium" })
          .forEach((e) => e.setProperty("noxcrew.ft:collected", false));
        world
          .getDimension("overworld")
          .getEntities({ type: "noxcrew.ft:treasure_chest" })
          .forEach((e) => e.setProperty("noxcrew.ft:collected", false));
      }
    });
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (ev.target.typeId == "noxcrew.ft:treasure_chest") {
        this.openChest({ damagingEntity: ev.player, hitEntity: ev.target });
      }
    });
    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (ev.hitEntity.typeId == "noxcrew.ft:treasure_chest") {
        this.openChest(ev);
      }
    });
  }
  hasItem(p: Player, id: string) {
    let inv = p.getComponent(EntityComponentTypes.Inventory);
    let res = [];
    for (let slot = 0; slot < (inv?.container?.size ?? 0); slot++) {
      res.push(inv?.container?.getSlot(slot).getItem()?.typeId);
    }
    return res.includes(id);
  }
  openChest(ev: EntityHitEntityAfterEvent) {
    let t = ev.hitEntity.getProperty("noxcrew.ft:unlock_type") as number;
    let requiredItemId =
      t == 0
        ? "noxcrew.ft:key_iron"
        : t == 1
        ? "noxcrew.ft:key_gold"
        : t == 2
        ? "noxcrew.ft:key_diamond"
        : "noxcrew.ft:key_netherite";
    let p = playerByEntity(ev.damagingEntity);
    if (this.hasItem(p, requiredItemId)) {
      let t = ev.hitEntity.getProperty("noxcrew.ft:unlock_type");
      let c = t == 0 ? 50 : t == 1 ? 100 : t == 2 ? 200 : 400;

      if (this.getProperty<boolean>("single_mode", false)) {
        if (!ev.hitEntity.getProperty("noxcrew.ft:collected")) {
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
          p.playSound("treasure_chest_open");
          p.playSound("bigcoins");
          this.player_data[p.name].coins += c;
          ev.damagingEntity.runCommand(`clear @s ${requiredItemId} 0 1`);
          showSubTitle(p, tr("txt.sot.coins" + c.toString()));
          this.player_data[p.name].opened_chests++;
          this.player_data[p.name].collected_items[
            "mccr:collected_t" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;
        }
      } else {
        let collected =
          this.player_data[p.name].collected_items[
            "mccr:collected_t" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ];
        if (!collected) {
          ev.damagingEntity.runCommand(`clear @s ${requiredItemId} 0 1`);
          p.playSound("bigcoins");
          p.playSound("treasure_chest_open");
          this.player_data[p.name].coins += c;
          showSubTitle(p, tr("txt.sot.coins" + c.toString()));
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
          system.runTimeout(() => ev.hitEntity.setProperty("noxcrew.ft:collected", false), 2000);
          this.player_data[p.name].opened_chests++;
          this.player_data[p.name].collected_items[
            "mccr:collected_t" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;

          network.syncEntityProperty(ev.hitEntity, ev.damagingEntity as Player, "noxcrew.ft:collected", true);
        }
      }
    } else {
      if (environment.type == envTypes.LevilaminaWithPlugin)
        network.spawnParticleForPlayer(p, "noxcrew.ft:treasure_chest_wrong", ev.hitEntity.location);
      else world.getDimension("overworld").spawnParticle("noxcrew.ft:treasure_chest_wrong", ev.hitEntity.location);
      showSubTitle(p, tr("txt.error.msg5"));
      ev.hitEntity.playAnimation("animation.n.ft.treasure_chest.wrong1");
      p.playSound("treasure_chest_wrong");
    }
  }
  collect(ev: EntityHitEntityAfterEvent) {
    if (!this.getProperty<boolean>("single_mode", false) && environment.type == envTypes.LevilaminaWithPlugin) {
      network.syncEntityProperty(ev.hitEntity, ev.damagingEntity as Player, "noxcrew.ft:collected", true);
    }
    if (ev.damagingEntity.typeId == "minecraft:player" && ev.hitEntity.typeId == "noxcrew.ft:coin_stack") {
      if (!this.getProperty<boolean>("single_mode", false)) {
        let collected =
          this.player_data[(ev.damagingEntity as Player).name].collected_items[
            "mccr:collected_c" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ];
        if (!collected) {
          let p = ev.damagingEntity as Player;
          if (p) {
            let ce = ev.hitEntity;
            let count = (ce.getProperty("noxcrew:variant") as number) ?? 1;
            p.playSound("smallcoins");
            let c = count == 1 ? 5 : count == 2 ? 20 : 30;
            p.onScreenDisplay.setActionBar(tr("txt.sot.coins" + c.toString()));
            this.player_data[p.name].coins += c;
            this.player_data[p.name].collected_items[
              "mccr:collected_c" + Vec3Utils.toMiniString(Vector3Utils.floor(ce.location))
            ] = true;
          }
        } else {
        }
      } else {
        let collected = ev.hitEntity.getProperty("noxcrew.ft:collected") as boolean;
        let p = playerByEntity(ev.damagingEntity);
        if (!collected) {
          let count = (ev.hitEntity.getProperty("noxcrew:variant") as number) ?? 1;
          let c = count == 1 ? 5 : count == 2 ? 20 : 30;
          p.playSound("smallcoins");
          this.player_data[p.name].coins += c;
          p.onScreenDisplay.setActionBar(tr("txt.sot.coins" + c.toString()));
          this.player_data[p.name].collected_items[
            "mccr:collected_c" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
        }
      }
    }
    if (ev.damagingEntity.typeId == "minecraft:player" && ev.hitEntity.typeId == "noxcrew.ft:sand_blocks") {
      if (!this.getProperty<boolean>("single_mode", false)) {
        let collected =
          this.player_data[playerByEntity(ev.damagingEntity).name].collected_items[
            "mccr:collected_s" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ];
        if (!collected) {
          let p = ev.damagingEntity as Player;
          if (p) {
            let ce = ev.hitEntity;
            p.playSound("sand_place");
            if (environment.type == envTypes.LevilaminaWithPlugin)
              network.spawnParticleForPlayer(p, "noxcrew.ft:sand_collect", ce.location);
            else ce.dimension.spawnParticle("noxcrew.ft:sand_collect", ce.location);
            this.player_data[p.name].time += 10 * TicksPerSecond;
            this.player_data[p.name].collected_items[
              "mccr:collected_s" + Vec3Utils.toMiniString(Vector3Utils.floor(ce.location))
            ] = true;
          }
        } else {
        }
      } else {
        let collected = ev.hitEntity.getProperty("noxcrew.ft:collected") as boolean;
        let p = playerByEntity(ev.damagingEntity);
        if (!collected) {
          this.player_data[p.name].time += 10 * TicksPerSecond;
          if (environment.type == envTypes.LevilaminaWithPlugin)
            network.spawnParticleForPlayer(p, "noxcrew.ft:sand_collect", ev.hitEntity.location);
          else ev.hitEntity.dimension.spawnParticle("noxcrew.ft:sand_collect", ev.hitEntity.location);
          p.playSound("sand_place");
          this.player_data[p.name].collected_items[
            "mccr:collected_s" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
        }
      }
    }
    if (ev.hitEntity.typeId == "noxcrew.ft:armor_podium" && ev.damagingEntity.typeId == "minecraft:player") {
      let ul = (p: Player) => {
        let t = ev.hitEntity.getProperty("noxcrew.ft:unlock_type") as number;
        p.getComponent("equippable")?.setEquipment(
          t == 0 ? EquipmentSlot.Chest : t == 1 ? EquipmentSlot.Legs : EquipmentSlot.Feet,
          new ItemStack(
            t == 0
              ? MinecraftItemTypes.IronChestplate
              : t == 1
              ? MinecraftItemTypes.IronLeggings
              : MinecraftItemTypes.IronBoots
          )
        );
      };
      if (!this.getProperty<boolean>("single_mode", false)) {
        let p = playerByEntity(ev.damagingEntity);
        let collected =
          this.player_data[p.name].collected_items[
            "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ];
        if (!collected) {
          this.player_data[p.name].collected_items[
            "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;
          showSubTitle(p, tr("txt.sot.upgraded"));
          ul(p);
        } else {
        }
      } else {
        let p = playerByEntity(ev.damagingEntity);
        this.player_data[p.name].collected_items[
          "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
        ] = true;
        let collected = ev.hitEntity.getProperty("noxcrew.ft:collected");
        if (!collected) {
          showSubTitle(p, tr("txt.sot.upgraded"));
          ul(p);
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
        }
      }
    }
    if (ev.hitEntity.typeId == "noxcrew.ft:key_podium" && ev.damagingEntity.typeId == "minecraft:player") {
      let ul = (p: Player) => {
        let t = ev.hitEntity.getProperty("noxcrew.ft:unlock_type") as number;
        p.getComponent("inventory")?.container?.addItem(
          new ItemStack(
            t == 0
              ? "noxcrew.ft:key_iron"
              : t == 1
              ? "noxcrew.ft:key_gold"
              : t == 2
              ? "noxcrew.ft:key_diamond"
              : "noxcrew.ft:key_netherite"
          )
        );
      };
      if (!this.getProperty<boolean>("single_mode", false)) {
        let p = playerByEntity(ev.damagingEntity);
        let collected =
          this.player_data[p.name].collected_items[
            "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ];
        if (!collected) {
          sound.play(p, "key_unlock", {});
          this.player_data[p.name].collected_items[
            "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
          ] = true;
          showSubTitle(
            p,
            new Text()
              .txt(String.fromCharCode(57747 - (ev.hitEntity.getProperty("noxcrew.ft:unlock_type") as number)))
              .tr("txt.sot.key")
          );
          if (environment.type == envTypes.LevilaminaWithPlugin)
            network.spawnParticleForPlayer(p, "noxcrew.ft:key_collect", ev.hitEntity.location);
          else world.getDimension("overworld").spawnParticle("noxcrew.ft:key_collect", ev.hitEntity.location);
          ul(p);

          network.syncEntityProperty(ev.hitEntity, p, "noxcrew.ft:collected", true);
        } else {
        }
      } else {
        let p = playerByEntity(ev.damagingEntity);
        this.player_data[p.name].collected_items[
          "mccr:collected_a" + Vec3Utils.toMiniString(Vector3Utils.floor(ev.hitEntity.location))
        ] = true;
        let collected = ev.hitEntity.getProperty("noxcrew.ft:collected");
        if (!collected) {
          if (environment.type == envTypes.LevilaminaWithPlugin)
            network.spawnParticleForPlayer(p, "noxcrew.ft:key_collect", ev.hitEntity.location);
          else world.getDimension("overworld").spawnParticle("noxcrew.ft:key_collect", ev.hitEntity.location);
          showSubTitle(
            p,
            new Text()
              .txt(String.fromCharCode(57747 - (ev.hitEntity.getProperty("noxcrew.ft:unlock_type") as number)))
              .tr("txt.sot.key")
          );
          ul(p);
          ev.hitEntity.setProperty("noxcrew.ft:collected", true);
        }
      }
    }
  }
  player_onTick(p: Player): void {
    super.player_onTick(p);
    this.player_data[p.name].time--;
    this.player_data[p.name].lifeTime++;
    if (this.player_data[p.name].time == 30 * TicksPerSecond) {
      p.playSound("sandtimer_30sec");
    }
    if (this.player_data[p.name].time == 20 * TicksPerSecond) {
      p.playSound("sandtimer_20sec");
    }
    if (this.player_data[p.name].time == 10 * TicksPerSecond) {
      p.playSound("sandtimer_10sec");
    }
    if (this.player_data[p.name].time == 0) {
      this.player_finish(p);
    }
  }
  player_join(p: Player): void {
    Logger.info(
      "玩家加入！",
      environment.type,
      !this.getProperty<boolean>("single_mode", false) && environment.type == envTypes.LevilaminaWithPlugin
    );
    p.camera.fade({
      fadeColor: { red: 0, blue: 0, green: 0 },
      fadeTime: { fadeInTime: 0.1, fadeOutTime: 1, holdTime: 0.2 },
    });
    let s = new ItemStack("minecraft:stone_sword");
    inventory.save(p);
    inventory.set(p, { 0: s, 8: new ItemStack("noxcrew.ft:leave_game") });
    let eq = p.getComponent("equippable");
    eq?.setEquipment(EquipmentSlot.Chest, new ItemStack(MinecraftItemTypes.LeatherChestplate));
    eq?.setEquipment(EquipmentSlot.Legs, new ItemStack(MinecraftItemTypes.LeatherLeggings));
    eq?.setEquipment(EquipmentSlot.Feet, new ItemStack(MinecraftItemTypes.LeatherBoots));
    this.player_data[p.name] = {
      collected_items: {},
      time: 120 * TicksPerSecond,
      coins: 0,
      lifeTime: 0,
      escaped: false,
      opened_chests: 0,
    };
    p.teleport({ x: 2160.25, y: 51.0, z: 79.17 });
  }
  showGameBar(p: Player): void {
    showSOTGameBar(
      p,
      `\ue195${this.player_data[p.name].coins}   \ue1b7${Math.floor(this.player_data[p.name].time / TicksPerSecond)}s`,
      0,
      (p.getDynamicProperty("mccr:coins") as number) ?? 0
    );
  }
  removePlayer(p: Player) {
    super.removePlayer(p);
    if (p && !p.getDynamicProperty("mccr:is_leaving")) {
      let e = p.getComponent("equippable");
      e?.setEquipment(EquipmentSlot.Legs, undefined);
      e?.setEquipment(EquipmentSlot.Chest, undefined);
      e?.setEquipment(EquipmentSlot.Feet, undefined);
    }
    let d = this.player_data[p.name];
    try {
      forIn(d.collected_items, (_, k) => {
        let p1 = k.replace(/mccr\:collected_c|mccr\:collected_s|mccr\:collected_a|mccr\:collected_t/g, "").split("$");
        let pos: Vector3 = { x: parseInt(p1[0]), y: parseInt(p1[1]), z: parseInt(p1[2]) };
        if (!this.getProperty<boolean>("single_mode", false))
          world
            .getDimension("overworld")
            .getEntitiesAtBlockLocation(pos)
            .forEach((e) => {
              e.setProperty("noxcrew.ft:collected", false);
            });
        else {
          world
            .getDimension("overworld")
            .getEntitiesAtBlockLocation(pos)
            .forEach((e) => {
              network.syncEntityProperty(e, p, "noxcrew.ft:collected", false);
            });
        }
      });
    } catch (err) {
      Logger.error(err);
    }
    delete this.player_data[p.name];
    gameInstances.lobby.addPlayer(p);
  }
  player_quit(p: Player, withItem?: boolean): void {
    p.teleport(coordinates.sot);
    this.removePlayer(p);
  }
  player_finish(p: Player): void {
    system.runTimeout(() => p.teleport(coordinates.sot), 2);
    let d = this.player_data[p.name];
    let rmCoins = d.escaped ? 0 : Math.ceil(d.coins / 4);
    let e = d.coins - rmCoins;
    showSOTCompleteToast(p, d.coins, e, d.opened_chests, tick2Time(d.lifeTime), d.escaped, !d.escaped, rmCoins);
    addCoins(p, d.coins - rmCoins);
    this.removePlayer(p);
  }
  mainloop(): void {
    this.tick_timer++;
    if ((this.tick_timer % 200) * TicksPerSecond == 0) {
      try {
        for (let i = 0; i < 3; i++) {
          let pindex = Math.floor(this.spawner_points.length * Math.random());
          let mindex = Math.floor(this.mobs.length * Math.random());
          let e = world.getDimension("overworld").spawnEntity(this.mobs[mindex], this.spawner_points[pindex]);
          system.runTimeout(() => {
            e.isValid ? e.remove() : undefined;
          }, 30 * TicksPerSecond);
        }
      } catch (e) {}
    }
  }
}
