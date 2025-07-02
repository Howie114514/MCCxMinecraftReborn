/**
 * 时之沙 - Sands Of Time
 * 本项目最大的依托石山
 */
//待重构

import {
  Entity,
  EntityComponentTypes,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  world,
} from "@minecraft/server";
import { BasicGame } from "../game";
import { coordinates } from "../main";
import { showSOTGameBar } from "../ui/gamebar";
import { showSOTCompleteToast } from "../ui/gametoast";
import { forIn, forInAsync, tick2Time } from "../utils";
import { gameInstances } from "./gameInstance";
import { addCoins } from "../gameData";
import { MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";
import { points as sotMobSpawnPoints } from "../data/sot";
import { inventory } from "../inventory";
import { Logger } from "../logger";
import { FTSounds, sound } from "../sound";
import { showSubTitle } from "../ui/title";
import { Text } from "../text";

export type SOTPlayerData = {
  collected_items: Record<string, Entity>;
  time: number;
  coins: number;
  lifeTime: number;
  escaped: boolean;
  opened_chests: number;
};

export const SOTKeyUnlockTypeMap = [
  "noxcrew.ft:key_iron",
  "noxcrew.ft:key_gold",
  "noxcrew.ft:key_diamond",
  "noxcrew.ft:key_netherite",
];

interface SOTItem {
  canCollect?: (p: Player, item: Entity) => boolean;
  onCollect: (p: Player, item: Entity, success: boolean) => void;
  onFail?: (p: Player, item: Entity) => void;
  collectSound?: string;
}

export class SandsOfTime extends BasicGame {
  name = "sot";
  music: string = "music_sot";
  player_data: Record<string, SOTPlayerData> = {};
  spawner_points = sotMobSpawnPoints;
  mobs = [MinecraftEntityTypes.Zombie, MinecraftEntityTypes.Skeleton, MinecraftEntityTypes.Spider];
  tick_timer = 0;

  entities = [
    "noxcrew.ft:coin_stack",
    "noxcrew.ft:sand_blocks",
    "noxcrew.ft:key_podium",
    "noxcrew.ft:armor_podium",
    "noxcrew.ft:treasure_chest",
  ];

  constructor() {
    super();
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
      if (ev.id == "mccr.sot:finish") {
        const p = ev.sourceEntity as Player;
        if (p) this.player_data[p.name].escaped = true;
        this.player_finish(p);
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

    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (
        this.players[(ev.damagingEntity as Player).name] &&
        ev.damagingEntity.typeId == "minecraft:player" &&
        this.entities.includes(ev.hitEntity.typeId)
      ) {
        this.onCollect(ev.damagingEntity as Player, ev.hitEntity);
      }
    });
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (this.players[ev.player.name] && this.entities.includes(ev.target.typeId)) {
        this.onCollect(ev.player, ev.target);
      }
    });
  }

  getPlayerData(p: Player | Entity) {
    return this.player_data[(p as Player).name];
  }

  reset(p: Player) {
    this.entities.forEach((et) => {
      world
        .getDimension("overworld")
        .getEntities({ type: et })
        .forEach((e) => {
          p.setPropertyOverrideForEntity(e, "noxcrew.ft:collected", false);
        });
    });
  }

  collect_events: Record<string, SOTItem> = {
    "noxcrew.ft:coin_stack": {
      collectSound: "smallcoins",
      onCollect: (p, item, success) => {
        let count = (item.getProperty("noxcrew:variant") as number) ?? 1;
        let c = count == 1 ? 5 : count == 2 ? 20 : 30;
        this.getPlayerData(p).coins += c;
        showSubTitle(p, new Text().tr(`txt.sot.coins${c}`));
      },
    },
    "noxcrew.ft:sand_blocks": {
      collectSound: "sand_place",
      onCollect: (p, item, success) => {
        this.getPlayerData(p).time += 10 * TicksPerSecond;
      },
    },
    "noxcrew.ft:treasure_chest": {
      collectSound: "treasure_chest_open",
      canCollect: (p, item) => {
        if (this.hasItem(p, SOTKeyUnlockTypeMap[(item.getProperty("noxcrew.ft:unlock_type") as number) ?? 0]))
          return true;
        else showSubTitle(p, new Text().tr("txt.error.msg5"));
        return false;
      },
      onCollect: (p, item, success) => {
        if (success) {
          switch (item.getProperty("noxcrew.ft:variant")) {
          }
        }
      },
      onFail(p, item) {
        showSubTitle(p, new Text().tr("txt.error.msg6"));
      },
    },
    "noxcrew.ft:key_podium": {
      onCollect: (p, item, success) => {
        p.getComponent(EntityComponentTypes.Inventory)?.container.addItem(
          new ItemStack(SOTKeyUnlockTypeMap[(item.getProperty("noxcrew.ft:variant") as number) ?? 0])
        );
        showSubTitle(p, new Text().tr("txt.sot.key"));
      },
    },
    "noxcrew.ft:armor_podium": {
      onCollect(p, item, success) {
        //TODO
      },
    },
  };
  onCollect(p: Player, item: Entity) {
    console.log(p, p.nameTag, p.name, JSON.stringify(this.player_data), this.player_data[p.name]);
    let data = this.player_data[p.name];
    if (!data || data.collected_items[item.id]) {
      this.collect_events[item.typeId]?.onFail?.(p, item);
      return;
    }
    let success = this.collect_events[item.typeId]?.canCollect?.(p, item) ?? true;

    if (success) {
      p.setPropertyOverrideForEntity(item, "noxcrew.ft:collected", true);
      data.collected_items[item.id] = item;
      let e = this.collect_events[item.typeId]?.collectSound;
      if (e) p.playSound(e);
    }
    if (!this.collect_events[item.typeId]) {
      Logger.warn("没有类型相应的拾起事件：", item.typeId);
      return;
    }
    this.collect_events[item.typeId]?.onCollect(p, item, success);
  }

  hasItem(p: Player, id: string) {
    let inv = p.getComponent(EntityComponentTypes.Inventory);
    for (let slot = 0; slot < (inv?.container?.size ?? 0); slot++) {
      if (inv?.container?.getSlot(slot).getItem()?.typeId == id) return true;
    }
    return false;
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
    p.teleport(coordinates.sot);
    if (p && !p.getDynamicProperty("mccr:is_leaving")) {
      let e = p.getComponent("equippable");
      e?.setEquipment(EquipmentSlot.Legs, undefined);
      e?.setEquipment(EquipmentSlot.Chest, undefined);
      e?.setEquipment(EquipmentSlot.Feet, undefined);
    }
    let d = this.player_data[p.name];
    system.runTimeout(() => {
      forInAsync(d.collected_items, (e: Entity) => {
        try {
          p.setPropertyOverrideForEntity(e, "noxcrew.ft:collected", false);
        } catch (e) {
          Logger.error(e);
        }
      });
    }, 1);
    delete this.player_data[p.name];
    gameInstances.lobby.addPlayer(p);
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
