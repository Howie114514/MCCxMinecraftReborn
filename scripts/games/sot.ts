import {
  Entity,
  EntityComponentTypes,
  EntityInventoryComponent,
  EquipmentSlot,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  world,
} from "@minecraft/server";
import { BasicGame } from "../game";
import { coordinates, coordinates_rotation } from "../main";
import { showSOTGameBar } from "../ui/gamebar";
import { showSOTCompleteToast } from "../ui/gametoast";
import { forIn, forInAsync, formatTime, getHat, tick2Time } from "../utils";
import { gameInstances } from "./gameInstance";
import { addCoins } from "../gameData";
import { MinecraftEntityTypes, MinecraftItemTypes } from "@minecraft/vanilla-data";
import { points as sotMobSpawnPoints } from "../data/sot";
import { inventory } from "../inventory";
import { Logger } from "../logger";
import { FTSounds, sound } from "../sound";
import { showSubTitle } from "../ui/title";
import { Text } from "../text";
import { challenges } from "../challenges";
import { PlayerRecord } from "../types";
import { record } from "../record";

export type SOTPlayerData = {
  collected_items: Record<string, Entity>;
  time: number;
  coins: number;
  lifeTime: number;
  startTime: number;
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

interface SOTPlayerStats {
  coinStacks: number;
  sands: number;
}

export class SandsOfTime extends BasicGame {
  name = "sot";
  music: string = "music_sot";
  player_data: PlayerRecord<SOTPlayerData> = {};
  stats: PlayerRecord<SOTPlayerStats> = {};
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
        if (p && this.player_data[p.name]) {
          this.player_data[p.name].escaped = true;
          if (this.player_data[p.name].lifeTime > 2400) {
            challenges["sot"].recordProgesss(p);
          }
          this.player_finish(p);
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
        this.stats[p.name].coinStacks++;
        p.onScreenDisplay.setActionBar(new Text().tr(`txt.sot.coins${c}`));
      },
    },
    "noxcrew.ft:sand_blocks": {
      collectSound: "sand_place",
      onCollect: (p, item, success) => {
        this.getPlayerData(p).time += 10 * TicksPerSecond;
        this.stats[p.name].sands++;
        world.getDimension("overworld").spawnParticle("noxcrew.ft:sand_collect", item.location);
      },
    },
    "noxcrew.ft:treasure_chest": {
      collectSound: "treasure_chest_open",
      canCollect: (p, item) => {
        if (this.hasItem(p, SOTKeyUnlockTypeMap[(item.getProperty("noxcrew.ft:unlock_type") as number) ?? 0]))
          return true;
        else {
          showSubTitle(p, new Text().tr("txt.error.msg5"));
          item.playAnimation("animation.n.ft.treasure_chest.wrong1", { players: [p] });
          world.getDimension("overworld").spawnParticle("noxcrew.ft:treasure_chest_wrong", item.location);
        }
        return false;
      },
      onCollect: (p, item, success) => {
        if (success) {
          sound.play(p, "bigcoins", {});
          sound.play(p, "teamvault_open", {});
          let t = item.getProperty("noxcrew.ft:unlock_type") as number;
          let c = t == 0 ? 50 : t == 1 ? 100 : t == 2 ? 200 : 400;
          this.player_data[p.name].coins += c;
          this.player_data[p.name].opened_chests++;
          p.onScreenDisplay.setActionBar(new Text().tr("txt.sot.coins" + c.toString()));
          showSubTitle(p, new Text().tr("txt.sot.chest"));
          let inv = p.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent;
          let slot = inv.container.find(
            new ItemStack(SOTKeyUnlockTypeMap[(item.getProperty("noxcrew.ft:unlock_type") as number) ?? 0])
          );
          inv.container.setItem(slot ?? 0, undefined);
        }
      },
      onFail(p, item) {
        showSubTitle(p, new Text().tr("txt.error.msg6"));
      },
    },
    "noxcrew.ft:key_podium": {
      onCollect: (p, item, success) => {
        p.getComponent(EntityComponentTypes.Inventory)?.container.addItem(
          new ItemStack(SOTKeyUnlockTypeMap[(item.getProperty("noxcrew.ft:unlock_type") as number) ?? 0])
        );
        sound.play(p, "key_unlock", {});
        showSubTitle(p, new Text().tr("txt.sot.key"));
      },
      collectSound: "key_pickup_vault",
    },
    "noxcrew.ft:armor_podium": {
      collectSound: "armor_upgrade",
      onCollect(p, item, success) {
        let t = item.getProperty("noxcrew.ft:unlock_type") as number;
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
        showSubTitle(p, new Text().tr("txt.sot.upgraded"));
      },
    },
  };
  onCollect(p: Player, item: Entity) {
    //console.log(p, p.nameTag, p.name, JSON.stringify(this.player_data), this.player_data[p.name]);
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
    p.setPropertyOverrideForEntity(
      world.getDimension("overworld").getEntities({ type: "noxcrew.ft:sand_timer", closest: 1 })[0],
      "noxcrew.ft:time",
      Math.floor(Math.min(this.player_data[p.name].time, 2400) / 20)
    );
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
      startTime: Date.now(),
    };
    this.stats[p.name] = {
      sands: 0,
      coinStacks: 0,
    };
    p.teleport({ x: 2160.25, y: 51.0, z: 79.17 }, { rotation: { x: 0, y: 180 } });
    forInAsync(this.collect_events, (v, k) => {
      world
        .getDimension("overworld")
        .getEntities({ type: k })
        .forEach((e) => {
          p.clearPropertyOverridesForEntity(e);
        });
    });
  }
  showGameBar(p: Player): void {
    showSOTGameBar(
      p,
      `\ue195${this.player_data[p.name].coins} \ue1b7${Math.floor(this.player_data[p.name].time / TicksPerSecond)}s`,
      0,
      (p.getDynamicProperty("mccr:coins") as number) ?? 0
    );
  }
  removePlayer(p: Player) {
    super.removePlayer(p);
    if (this.player_data[p.name]) {
      p.teleport(coordinates.sot, { rotation: coordinates_rotation.sot });
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
  }
  player_finish(p: Player): void {
    if (this.players[p.name]) {
      system.runTimeout(() => p.teleport(coordinates.sot, { rotation: coordinates_rotation.sot }), 2);
      let d = this.player_data[p.name];
      let rmCoins = d.escaped ? 0 : Math.ceil(d.coins / 4);
      let e = Math.max(d.coins - rmCoins, 0);
      if (getHat(p)?.typeId == "noxcrew.ft:beanie_blue") challenges.blue.recordProgesss(p, this.stats[p.name].sands);
      if (getHat(p)?.typeId == "noxcrew.ft:beanie_cyan")
        challenges.cyan.recordProgesss(p, this.stats[p.name].coinStacks);
      let isNewRecord = record.update(p, "sot", e);
      showSOTCompleteToast(
        p,
        d.coins,
        e,
        d.opened_chests,
        formatTime(Date.now() - d.startTime),
        d.escaped,
        !d.escaped,
        rmCoins,
        isNewRecord,
        record.get(p, "sot").toString()
      );
      addCoins(p, e);
      this.removePlayer(p);
    }
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
