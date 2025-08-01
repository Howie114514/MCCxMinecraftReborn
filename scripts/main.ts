import {
  world,
  system,
  Player,
  Vector2,
  Vector3,
  EquipmentSlot,
  ItemStack,
  TicksPerSecond,
  ItemLockMode,
  GameMode,
  MolangVariableMap,
  RGB,
  PlayerBreakBlockAfterEvent,
  InputPermissionCategory,
  TimeOfDay,
  CommandPermissionLevel,
  CustomCommandStatus,
  CustomCommandSource,
  CustomCommandParamType,
  Entity,
  Block,
  CommandResult,
  EntityComponentTypes,
  InputButton,
  ItemComponentTypes,
  ItemDurabilityComponent,
  EntityQueryOptions,
  ScriptEventSource,
} from "@minecraft/server";
import { ActionFormData, FormCancelationReason, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import flags from "./flags";
import { Vector3Utils } from "./minecraft/math";
import { Vec3Utils } from "./math";
import { tr } from "./lang";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import {
  asPlayer,
  choice,
  createEntityPropertyProxy,
  debounce,
  forIn,
  getHat,
  give,
  isInventoryFull,
  random,
  rgb,
  runAfterStartup,
  setFog,
} from "./utils";
import {
  challenge_list,
  cosmetic_chest,
  info,
  vendor_food,
  vendor_hat,
  vendor_mascot,
  vendor_toys,
} from "./ui/screens";
import { gameInstances } from "./games/gameInstance";
import { addCoins, clearAllData, getCoins, setCoins } from "./gameData";
import { Lobby } from "./game";
import { puzzles } from "./puzzles/puzzle";
import env, { envTypes } from "./environment";
import { inventory } from "./inventory";
import { Logger } from "./logger";
import { blockCompoents, itemCompoents } from "./compoents";
import { showSubTitle } from "./ui/title";
import { sound } from "./sound";
import { challengeColors, challenges } from "./challenges";
import { debugScriptsDialog } from "./debug";
import { Text } from "./text";
import { playerSessionData } from "./data";

Player.prototype.toString = function () {
  return `Player[${this.name},${this.id}]`;
};

Entity.prototype.toString = function () {
  return `Entity[${this.typeId},${this.id}]`;
};

Block.prototype.toString = function () {
  return `Block[${this.typeId},{${this.dimension.id},${this.location.x},${this.location.y},${this.location.z}}]`;
};

system.beforeEvents.startup.subscribe((init) => {
  forIn(blockCompoents, (v, k) => {
    init.blockComponentRegistry.registerCustomComponent("mccr:" + k, v);
  });
  forIn(itemCompoents, (v, k) => {
    init.itemComponentRegistry.registerCustomComponent("mccr:" + k, v);
  });
});

export const fogs = {
  lobby: "noxcrew.ft:hub",
  meltdown: "noxcrew.ft:melt",
  ace_race: "noxcrew.ft:ace",
  grid_runners: "noxcrew.ft:grid",
  sot: "noxcrew.ft:sand",
};

export const colors: Record<string, RGB> = {
  aqua: rgb(127, 255, 212),
  blue: rgb(0, 0, 255),
  cyan: rgb(0, 255, 255),
  green: rgb(0, 255, 0),
  lime: rgb(50, 205, 50),
  orange: rgb(255, 165, 0),
  pink: rgb(255, 105, 180),
  purple: rgb(160, 32, 240),
  red: rgb(255, 0, 0),
  yellow: rgb(255, 255, 0),
  black: rgb(0, 0, 0),
};
export let isReloaded = { value: false };
export const coordinates: Record<string, Vector3> = {
  plobby2sot: {
    x: 2144.48,
    y: 112.0,
    z: 2216.11,
  },
  psot2lobby: {
    x: 2159.92,
    y: 61.0,
    z: 109.83,
  },
  plobby2ace_race: {
    x: 2075.57,
    y: 132.0,
    z: 2143.65,
  },
  pace_race2lobby: {
    x: 4248.15,
    y: 65.0,
    z: 2166.74,
  },
  plobby2grid_runners: {
    x: 2135.44,
    y: 110.5,
    z: 2088.04,
  },
  pgrid_runners2lobby: {
    x: 2083.81,
    y: 83.0,
    z: 4255.93,
  },
  plobby2meltdown: {
    x: 2207.57,
    y: 113.0,
    z: 2143.39,
  },
  pmeltdown2lobby: {
    x: 86.56,
    y: 65.06,
    z: 2166.94,
  },
  meltdown: {
    x: 81.5,
    y: 66,
    z: 2167.5,
  },
  grid_runners: {
    x: 2089.5,
    y: 82,
    z: 4254.5,
  },
  sot: {
    x: 2159.42,
    y: 61.0,
    z: 97.93,
  },
  ace_race: {
    x: 4248.5,
    y: 64,
    z: 2158.5,
  },
  lobby: {
    x: 2158.0,
    y: 110.0,
    z: 2131.0,
  },
};
export const coordinates_rotation: Record<string, Vector2> = {
  plobby2sot: {
    x: 0,
    y: 0,
  },
  psot2lobby: {
    x: 0,
    y: 0,
  },
  plobby2ace_race: {
    x: 0,
    y: 90,
  },
  pace_race2lobby: {
    x: 0,
    y: 0,
  },
  plobby2grid_runners: {
    x: 0,
    y: 180,
  },
  pgrid_runners2lobby: {
    x: 0,
    y: 90,
  },
  plobby2meltdown: {
    x: 0,
    y: 270,
  },
  pmeltdown2lobby: {
    x: 0,
    y: 270,
  },
  meltdown: {
    x: 0,
    y: 90,
  },
  grid_runners: {
    x: 0,
    y: 270,
  },
  sot: {
    x: 0,
    y: 180,
  },
  ace_race: {
    x: 0,
    y: 180,
  },
  lobby: {
    x: 0,
    y: 90,
  },
};

let coin_data: Record<string, boolean> = {};

function collectHubCoin(p: Player, coin: Entity) {
  let collected = p.getDynamicProperty("mccr:collected_" + coin.id) as boolean | undefined;
  console.log(collected);
  if (!collected) {
    p.setPropertyOverrideForEntity(coin, "noxcrew.ft:collected", true);
    p.setDynamicProperty("mccr:collected_" + coin.id, true);
    let count = (coin.getProperty("noxcrew:variant") as number) ?? 1;
    p.playSound(count == 3 ? "bigcoins" : "smallcoins");
    let c = count == 1 ? 5 : count == 2 ? 20 : 30;
    showSubTitle(p, new Text().tr("txt.lobby.coins" + c));
    addCoins(p, c);
  }
}

system.beforeEvents.startup.subscribe((ev) => {
  ev.customCommandRegistry.registerCommand(
    { name: "mccr:info", description: "MCCxMinecraft Reborn info", permissionLevel: CommandPermissionLevel.Any },
    (o) => {
      if (o.sourceType != CustomCommandSource.Entity || o.sourceEntity?.typeId != "minecraft:player") {
        return { message: "只有玩家能执行该命令。", status: CustomCommandStatus.Failure };
      }
      system.run(() => {
        info().show(o.sourceEntity as Player);
      });
      return { status: CustomCommandStatus.Success };
    }
  );
  ev.customCommandRegistry.registerEnum("mccr:theme", ["default", "theFirstWeek"]);
  ev.customCommandRegistry.registerCommand(
    {
      name: "mccr:set_theme",
      mandatoryParameters: [{ type: CustomCommandParamType.Enum, name: "mccr:theme" }],
      permissionLevel: CommandPermissionLevel.GameDirectors,
      description: "设置顶部栏的主题",
    },
    (origin, res) => {
      if (!["default", "theFirstWeek"].includes(res))
        return { status: CustomCommandStatus.Failure, message: "无效的主题" + res };
      world.setDynamicProperty("mccr:theme", res);
      return undefined;
    }
  );
  let pipes = {
    "1": {
      from: {
        x: 2326.0,
        y: 62,
        z: 4247.0,
      },
      to: {
        x: 2098.0,
        y: 90,
        z: 4245.0,
      },
    },
    "2": {
      from: {
        x: 2326.0,
        y: 62,
        z: 4265.0,
      },
      to: {
        x: 2098.0,
        y: 90,
        z: 4267.0,
      },
    },
  };
  system.runInterval(() => {
    let overworld = world.getDimension("overworld");
    try {
      overworld.spawnParticle("noxcrew.ft:gr_pipe", pipes[1].from);
      overworld.spawnParticle("noxcrew.ft:gr_pipe", pipes[2].from);
    } catch (e) {}
  }, 20);
  system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id == "mccr:trigger") {
      let parsed: { selector?: EntityQueryOptions; params: string; event: string } = JSON.parse(ev.message);
      let { params, event, selector } = parsed;
      selector = selector ?? {};
      selector.location = ev.sourceEntity?.location;
      let origin = ev;
      let targets = world.getDimension("overworld").getPlayers(parsed.selector);
      switch (event) {
        case "sot.collect": {
          system.run(() => {
            targets.forEach((p) => gameInstances.sot.onCollect(p, origin.sourceEntity as Entity));
          });
          break;
        }
        case "hub.collect": {
          system.run(() => {
            targets.forEach((p) => {
              if (origin.sourceEntity) {
                collectHubCoin(p, origin.sourceEntity);
              }
            });
          });
          break;
        }
        case "hub.coin.update": {
          system.run(() => {
            targets.forEach((p) => {
              if (origin.sourceEntity && !coin_data[`${p.name}_${origin.sourceEntity.id}`]) {
                p.setPropertyOverrideForEntity(
                  origin.sourceEntity,
                  "noxcrew.ft:collected",
                  (p.getDynamicProperty("mccr:collected_" + origin.sourceEntity.id) as boolean | undefined) ?? false
                );
                coin_data[`${p.name}_${origin.sourceEntity.id}`] = true;
              }
            });
          });
          break;
        }
        case "hub.candle.update": {
          targets.forEach((p) => {
            let c = challengeColors[origin.sourceEntity?.getProperty("noxcrew:variant") as number];
            system.run(() =>
              p.setPropertyOverrideForEntity(
                origin.sourceEntity as Entity,
                "noxcrew.ft:complete",
                challenges[c].getPlayerChallengeData(p).finished ?? false
              )
            );
          });
          break;
        }
        case "hub.gr.pipe_tp": {
          if (!params) return;
          targets = [origin.sourceEntity as Player];
          let pipe = pipes[params as keyof typeof pipes];
          system.run(() => {
            targets.forEach((p) => {
              p.addTag("returning");
              sound.play(p, "pipe_suck_start", {});
              p.teleport(pipe.from);
              p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
              p.addEffect(MinecraftEffectTypes.Levitation, 60, { amplifier: 3, showParticles: false });
              system.runTimeout(() => {
                sound.play(p, "pipe_teleport", {});
                p.teleport(pipe.to);
                p.removeTag("returning");
                p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
              }, 60);
            });
          });

          break;
        }
      }
    }
  });
  /*
  ev.customCommandRegistry.registerCommand(
    {
      name: "mccr:trigger",
      permissionLevel: CommandPermissionLevel.Any,
      description: "触发事件",
      mandatoryParameters: [
        {
          name: "event",
          type: CustomCommandParamType.String,
        },
        {
          name: "target",
          type: CustomCommandParamType.PlayerSelector,
        },
      ],
      optionalParameters: [
        {
          name: "params",
          type: CustomCommandParamType.String,
        },
      ],
    },
    (origin, event: string, targets: Player[], params?: string) => {
      if (origin.sourceType == CustomCommandSource.Entity && origin.sourceEntity?.typeId == "minecraft:player")
        return { status: CustomCommandStatus.Failure, message: "你无权使用该命令" };
      switch (event) {
        case "sot.collect": {
          system.run(() => {
            targets.forEach((p) => gameInstances.sot.onCollect(p, origin.sourceEntity as Entity));
          });
          break;
        }
        case "hub.collect": {
          system.run(() => {
            targets.forEach((p) => {
              if (origin.sourceEntity) {
                collectHubCoin(p, origin.sourceEntity);
              }
            });
          });
          break;
        }
        case "hub.coin.update": {
          system.run(() => {
            targets.forEach((p) => {
              if (origin.sourceEntity && !coin_data[`${p.name}_${origin.sourceEntity.id}`]) {
                p.setPropertyOverrideForEntity(
                  origin.sourceEntity,
                  "noxcrew.ft:collected",
                  (p.getDynamicProperty("mccr:collected_" + origin.sourceEntity.id) as boolean | undefined) ?? false
                );
                coin_data[`${p.name}_${origin.sourceEntity.id}`] = true;
              }
            });
          });
          break;
        }
        case "hub.candle.update": {
          targets.forEach((p) => {
            let c = challengeColors[origin.sourceEntity?.getProperty("noxcrew:variant") as number];
            system.run(() =>
              p.setPropertyOverrideForEntity(
                origin.sourceEntity as Entity,
                "noxcrew.ft:complete",
                challenges[c].getPlayerChallengeData(p).finished ?? false
              )
            );
          });
          break;
        }
        case "hub.gr.pipe_tp": {
          if (!params) return;
          let pipe = pipes[params as keyof typeof pipes];
          system.run(() => {
            targets.forEach((p) => {
              p.addTag("returning");
              sound.play(p, "pipe_suck_start", {});
              p.teleport(pipe.from);
              p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
              p.addEffect(MinecraftEffectTypes.Levitation, 60, { amplifier: 3, showParticles: false });
              system.runTimeout(() => {
                sound.play(p, "pipe_teleport", {});
                p.teleport(pipe.to);
                p.removeTag("returning");
                p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
              }, 60);
            });
          });

          break;
        }
      }
      return undefined;
    }
  );*/
  ev.customCommandRegistry.registerCommand(
    { name: "mccr:reset", permissionLevel: CommandPermissionLevel.Any, description: "重置个人数据" },
    (origin) => {
      system.run(() => {
        new MessageFormData()
          .title(new Text().tr("form.reset.title"))
          .body(new Text().tr("form.reset.body"))
          .button1(new Text().tr("txt.button.ok"))
          .button2(new Text().tr("txt.button.close"))
          .show(origin.sourceEntity as Player)
          .then((v) => {
            if (v.selection == 0) {
              (origin.sourceEntity as Player)
                .getComponent(EntityComponentTypes.Equippable)
                ?.setEquipment(EquipmentSlot.Head, undefined);

              (origin.sourceEntity as Player).runCommand("scriptevent mccr:reset_inv");
              clearAllData(origin.sourceEntity as Player);
              system.run(() => {
                gameInstances.lobby.addPlayer(origin.sourceEntity as Player);
                forIn(challenges, (c) => {
                  c.reset(origin.sourceEntity as Player);
                });
              });
            }
          });
      });

      return undefined;
    }
  );
  if (isDevMode) {
    ev.customCommandRegistry.registerCommand(
      {
        name: "mccr:debug",
        description: "MCCxMinecraft Reborn debug",
        permissionLevel: CommandPermissionLevel.GameDirectors,
      },
      (origin) => {
        if (origin.sourceEntity && origin.sourceEntity.typeId == "minecraft:player") {
          system.run(() => {
            debugScriptsDialog(origin.sourceEntity as Player);
          });
        } else {
          return { status: CustomCommandStatus.Failure, message: "执行者必须为玩家" };
        }
        return undefined;
      }
    );
  }
  system.run(() => {
    world.afterEvents.playerEmote.subscribe((ev) => {
      Logger.info("检测到表情", ev.personaPieceId);
      if (
        Vec3Utils.distance(ev.player.location, { x: 2145.31, y: 109.0, z: 2144.46 }) <= 6 &&
        ev.personaPieceId == "4c8ae710-df2e-47cd-814d-cc7bf21a3d67"
      ) {
        puzzles.day1.complete(ev.player);
      }
    });
    let pcps: Record<string, number> = {};
    function joinGame(p: Player) {
      if ((gameInstances.lobby as Lobby).getPlayerArea(p) == "sot") {
        system.runTimeout(() => gameInstances.sot.addPlayer(p), 10);
      } else if ((gameInstances.lobby as Lobby).getPlayerArea(p) == "meltdown") {
        gameInstances.meltdown.addPlayer(p);
      } else if ((gameInstances.lobby as Lobby).getPlayerArea(p) == "grid_runners") {
        gameInstances.grid_runners.addPlayer(p);
      } else {
        p.sendMessage(
          `未查找到与您所在的区域${gameInstances.lobby.getPlayerArea(p)}匹配的有效游戏，请尝试重新加入当前游戏大厅。`
        );
      }
      Logger.info("触发加入游戏按钮：", p.name, (gameInstances.lobby as Lobby).getPlayerArea(p));
    }
    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (ev.hitEntity.typeId == "noxcrew.ft:start_button") {
        ev.hitEntity.playAnimation("animation.n.start_button.interact");
        joinGame(ev.damagingEntity as Player);
      }
    });
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (ev.target.typeId == "noxcrew.ft:start_button") {
        joinGame(ev.player);
      }
      if (ev.target.typeId == "noxcrew.ft:vendor_mascot") {
        vendor_mascot()
          .body(`\ue17b${getCoins(ev.player)}`)
          .show(ev.player)
          .then((v) => {
            let colors = ["aqua", "blue", "cyan", "green", "lime", "orange", "pink", "purple", "red", "yellow"];
            if (!v.canceled) {
              let hats: string[] = JSON.parse((ev.player.getDynamicProperty("mccr:hats") ?? "[]") as string);
              if (hats.includes("noxcrew.ft:beanie_" + colors[v.selection ?? 0])) {
                showSubTitle(ev.player, tr("txt.error.msg3"));
                return;
              }
              if ((ev.player.getDynamicProperty("mccr:coins") as number) < 250) {
                showSubTitle(ev.player, tr("txt.error.msg1"));
                return;
              }
              hats.push("noxcrew.ft:beanie_" + colors[v.selection ?? 0]);
              ev.player.runCommand("scriptevent mccr:remove_coins 250");
              ev.player.setDynamicProperty("mccr:hats", JSON.stringify(hats));
              sound.play(ev.player, "purchase", {});
            }
          });
      }
      if (ev.target.typeId == "noxcrew.ft:vendor_hat") {
        let hats = [
          "noxcrew.ft:hat_birthday_present",
          "noxcrew.ft:hat_boombox",
          "noxcrew.ft:hat_chicken_jockey",
          "noxcrew.ft:hat_crown_cake",
          "noxcrew.ft:hat_jester",
          "noxcrew.ft:hat_party",
          "noxcrew.ft:hat_propeller",
        ];
        vendor_hat(hats)
          .body(`\ue17b${getCoins(ev.player)}`)
          .show(ev.player)
          .then((v) => {
            if (!v.canceled) {
              let hats1: string[] = JSON.parse((ev.player.getDynamicProperty("mccr:hats") ?? "[]") as string);
              if (hats1.includes(hats[v.selection ?? 0])) {
                showSubTitle(ev.player, tr("txt.error.msg3"));
                return;
              }
              if ((ev.player.getDynamicProperty("mccr:coins") as number) < 300) {
                showSubTitle(ev.player, tr("txt.error.msg1"));
                return;
              }
              hats1.push(hats[v.selection ?? 0]);
              ev.player.runCommand("scriptevent mccr:remove_coins 300");
              ev.player.setDynamicProperty("mccr:hats", JSON.stringify(hats1));
              sound.play(ev.player, "purchase", {});
            }
          });
      }
      if (ev.target.typeId == "noxcrew.ft:vendor_food") {
        let foods = [
          "noxcrew.ft:anniversary_hot_dog",
          "noxcrew.ft:party_soda",
          "noxcrew.ft:cotton_candy",
          "noxcrew.ft:popcorn",
          "noxcrew.ft:mcc_burger",
          "noxcrew.ft:party_cupcake",
          "noxcrew.ft:party_cake",
          "noxcrew.ft:party_chips",
          "noxcrew.ft:party_cookie",
          "noxcrew.ft:super_wrap",
        ];
        let price = [10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20];
        vendor_food(foods, price)
          .body(`\ue17b${getCoins(ev.player)}`)
          .show(ev.player)
          .then((v) => {
            if (!v.canceled) {
              if ((ev.player.getDynamicProperty("mccr:coins") as number) < price[v.selection ?? 0]) {
                showSubTitle(ev.player, new Text().tr("txt.error.msg1"));
                return;
              }
              if (isInventoryFull(ev.player)) {
                showSubTitle(ev.player, new Text().tr("txt.error.msg2"));
                return;
              }
              give(ev.player, new ItemStack(foods[v.selection as number]));
              ev.player.runCommand("scriptevent mccr:remove_coins " + price[v.selection ?? 0].toString());
              sound.play(ev.player, "purchase", {});
            }
          });
      }

      /**
       * 玩具商店代码由mc火燃贡献
       */
      if (ev.target.typeId == "noxcrew.ft:vendor_toys") {
        let toys = [
          "noxcrew.ft:foam_finger",
          "noxcrew.ft:balloon_animal",
          "noxcrew.ft:big_bubble_blower",
          "noxcrew.ft:silly_horn",
          "noxcrew.ft:party_popper",
          "noxcrew.ft:confetti_tag_prime",
          "noxcrew.ft:pizza_box",
          "noxcrew.ft:celebration_fireworks",
          "noxcrew.ft:player_gift_giving",
          "noxcrew.ft:disco_ball",
          "noxcrew.ft:beach_ball",
          "noxcrew.ft:balloon_helium",
        ];
        let price = [60, 60, 60, 100, 40, 40, 80, 40, 100, 60, 60, 60];
        vendor_toys(toys, price)
          .body(`\ue17b${getCoins(ev.player)}`)
          .show(ev.player)
          .then((v) => {
            if (!v.canceled) {
              if ((ev.player.getDynamicProperty("mccr:coins") as number) < price[v.selection ?? 0]) {
                showSubTitle(ev.player, new Text().tr("txt.error.msg1"));
                return;
              }
              if (isInventoryFull(ev.player)) {
                showSubTitle(ev.player, new Text().tr("txt.error.msg2"));
                return;
              }
              give(ev.player, new ItemStack(toys[v.selection as number]));
              ev.player.runCommand("scriptevent mccr:remove_coins " + price[v.selection ?? 0].toString());
              sound.play(ev.player, "purchase", {});
            }
          });
      }
    });

    world.afterEvents.projectileHitBlock.subscribe((ev) => {
      if (ev.projectile.typeId == "minecraft:arrow") {
        ev.projectile.addTag("hit");
        system.runTimeout(() => {
          ev.projectile.isValid ? ev.projectile.remove() : undefined;
        }, 20 * TicksPerSecond);
      }
    });

    world.afterEvents.itemCompleteUse.subscribe((ev) => {
      switch (ev.itemStack.typeId) {
        case "noxcrew.ft:party_cake":
          ev.source.addEffect(MinecraftEffectTypes.Levitation, 3 * TicksPerSecond, { amplifier: 2 });
          ev.source.addEffect(MinecraftEffectTypes.SlowFalling, 10 * TicksPerSecond);
          break;
        case "noxcrew.ft:party_soda":
          ev.source.addEffect(MinecraftEffectTypes.Speed, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:cotton_candy":
          ev.source.addEffect(MinecraftEffectTypes.JumpBoost, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:popcorn":
          ev.source.addEffect(MinecraftEffectTypes.JumpBoost, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:mcc_burgur":
        case "noxcrew.ft:anniversary_hot_dog":
          ev.source.addEffect(MinecraftEffectTypes.Speed, 10 * TicksPerSecond, { amplifier: 2 });
          ev.source.addEffect(MinecraftEffectTypes.JumpBoost, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:party_cupcake":
          ev.source.addEffect(MinecraftEffectTypes.SlowFalling, 10 * TicksPerSecond);
          break;
        case "noxcrew.ft:party_chips":
          ev.source.addEffect(MinecraftEffectTypes.Speed, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:party_cookie":
          ev.source.addEffect(MinecraftEffectTypes.JumpBoost, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:super_wrap":
          ev.source.addEffect(MinecraftEffectTypes.Speed, 10 * TicksPerSecond, { amplifier: 2 });
          ev.source.addEffect(MinecraftEffectTypes.SlowFalling, 10 * TicksPerSecond);
          ev.source.addEffect(MinecraftEffectTypes.JumpBoost, 10 * TicksPerSecond, { amplifier: 2 });
          break;
        case "noxcrew.ft:pizza_slice":
          ev.source.addEffect(MinecraftEffectTypes.Speed, 10 * TicksPerSecond, { amplifier: 2 });
          break;
      }
    });
    const time: Record<string, number> = {
      lobby: TimeOfDay.Sunset,
    };
    function teleport(
      player: Player,
      dest: "ace_race" | "sot" | "lobby" | string,
      from: Vector3,
      to: Vector3,
      from_rotation: Vector2 | undefined,
      to_rotation: Vector2 | undefined
    ) {
      if (gameInstances.ace_race.players[player.name]) {
        gameInstances.ace_race.player_quit(player);
        gameInstances.lobby.addPlayer(player);
      }
      if ((gameInstances.lobby as Lobby).getPlayerArea(player) != dest)
        new MessageFormData()
          .body({
            rawtext: [
              { translate: "txt.ui.tp.confirm_target", with: { rawtext: [{ translate: `txt.ui.tp.area_${dest}` }] } },
            ],
          })
          .title({ rawtext: [{ translate: "txt.ui.tp.confirm1" }] })
          .button1(tr("txt.button.no"))
          .button2(tr("txt.button.yes"))
          .show(player)
          .then((v) => {
            if (v.selection == 1) {
              setFog(player, fogs[dest as keyof typeof fogs]);
              sound.play(player, "quick_travel", {});
              player.teleport(to, { rotation: to_rotation });
              (gameInstances.lobby as Lobby).setPlayerArea(player, dest);
            } else {
              player.teleport(from, { rotation: from_rotation });
            }
            system.runTimeout(() => player.removeTag("inPortal"), 10);
          });
      else {
        setFog(player, fogs[dest as keyof typeof fogs]);
        player.teleport(to, { rotation: to_rotation });
      }
    }

    let disableBlockBreaking = false;

    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      const p = ev.sourceEntity as Player;
      if (ev.id == "mccr:toggle_disable_chat") {
        dc = !dc;
      }
      if (ev.id == "mccr:enter_portal") {
        if (!p.hasTag("inPortal")) {
          p.addTag("inPortal");
          let pos = ev.message.split(";");
          teleport(
            p,
            pos[0],
            pos[1] == "here" ? p.location : (coordinates[pos[1]] as Vector3),
            pos[2] == "here" ? p.location : (coordinates[pos[2]] as Vector3),
            pos[1] == "here" ? undefined : (coordinates_rotation[pos[1]] as Vector2),
            pos[2] == "here" ? undefined : (coordinates_rotation[pos[2]] as Vector2)
          );
        }
      } else if (ev.id == "mccr:clear_effect") {
        system.runTimeout(() => p.playSound("launch"), 2);
        if (p && p.isValid) {
          system.runTimeout(() => {
            p?.removeEffect(MinecraftEffectTypes.Levitation);
          }, parseInt(ev.message));
        }
      } else if (ev.id == "mccr:add_coins") {
        if (p) {
          addCoins(p, parseInt(ev.message));
        }
      } else if (ev.id == "mccr:remove_coins") {
        if (p) {
          addCoins(p, -parseInt(ev.message));
        }
      } else if (ev.id == "mccr:set_coins") {
        if (p) {
          setCoins(p, parseInt(ev.message));
        }
      } else if (ev.id == "mccr:start_game") {
        if (p) {
          if (gameInstances[ev.message]) {
            gameInstances[ev.message].addPlayer(p);
          }
        }
      } else if (ev.id == "mccr:end_game") {
        if (p) {
          if (gameInstances[ev.message]) {
            gameInstances[ev.message].player_finish(p, true);
            gameInstances.lobby.addPlayer(p);
          }
        }
      } else if (ev.id == "mccr:quit_game") {
        if (p) {
          if (gameInstances[ev.message]) {
            gameInstances[ev.message].player_quit(p);
            gameInstances.lobby.addPlayer(p);
          }
        }
      } else if (ev.id == "mccr:clear_data") {
        if (p) {
          new MessageFormData()
            .title("你确定吗")
            .body("你的个人数据将会被清除")
            .button1("确定")
            .button2("取消")
            .show(p)
            .then((v) => {
              if (v.selection == 0) {
                clearAllData(p);
              }
            });
        }
      } else if (ev.id == "mccr:transform") {
        ev.sourceEntity?.setProperty("noxcrew.ft:transform", !ev.sourceEntity?.getProperty("noxcrew.ft:transform"));
      } else if (ev.id == "mccr.dev:create_floating_text") {
        if (ev.sourceEntity) {
          let e = ev.sourceEntity.dimension.spawnEntity("noxcrew.ft:floating_text", ev.sourceEntity.location);
          e.nameTag = ev.message;
        }
      } else if (ev.id == "mccr.dev:t_disable_block_breaking") {
        disableBlockBreaking = !disableBlockBreaking;
      } else if (ev.id == "mccr.dev:getenv") {
        world.sendMessage(env.type);
      }
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr:reset_inv") {
        inventory.set(
          ev.sourceEntity as Player,
          {
            6: {
              id: "noxcrew.ft:challenge_list",
              amount: 1,
              lockMode: ItemLockMode.slot,
            },
            7: {
              id: "noxcrew.ft:cosmetic_chest",
              amount: 1,
              lockMode: ItemLockMode.slot,
            },
            8: {
              id: "noxcrew.ft:teleporter",
              amount: 1,
              lockMode: ItemLockMode.slot,
            },
          },
          { clearAll: true, lock: false }
        );
      }
    });
    world.beforeEvents.playerBreakBlock.subscribe((ev) => {
      //ev.cancel = disableBlockBreaking;
      //if (ev.cancel) system.run(() => ev.player.onScreenDisplay.setActionBar("已阻止一次可能无意间产生的方块破坏"));
    });
    world.afterEvents.playerSpawn.subscribe((ev) => {
      setFog(ev.player, fogs.lobby);
      ev.player.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
      if (ev.player.getGameMode() == GameMode.Survival) {
        ev.player.setGameMode(GameMode.Adventure);
      }
      if (ev.initialSpawn) {
        let item = ev.player.getComponent("equippable")?.getEquipment(EquipmentSlot.Head);
        (gameInstances.lobby as Lobby).setPlayerArea(ev.player, "lobby");
        if (item) {
          if (/noxcrew\.ft:beanie_.*/.test(item.typeId)) {
            let colors = ["aqua", "blue", "cyan", "green", "lime", "orange", "pink", "purple", "red", "yellow"];
            //start:57824
            let colorCodes = ["b", 9, 3, 2, "a", 6, "d", 5, "c", "e"];
            let colorIndex = colors.indexOf(item.typeId.match(/(?<=noxcrew\.ft:beanie_).*/)?.[0] as string);
            ev.player.nameTag =
              "\u00a7" + colorCodes[colorIndex].toString() + String.fromCharCode(57824 + colorIndex) + ev.player.name;
          } else {
            ev.player.nameTag = ev.player.name;
          }
        }
        if (!ev.player.getDynamicProperty("mccr:coins")) {
          setCoins(ev.player, 0);
        }
        system.runTimeout(() => ev.player.sendMessage(new Text().tr("msg.mccr.welcome")), 50);
        gameInstances.lobby.addPlayer(ev.player);
        ev.player.teleport(coordinates.lobby, { rotation: coordinates_rotation.lobby });
      }
    });

    world.getAllPlayers().forEach((p) => {
      let g = (p.getDynamicProperty("mccr:game") as string) ?? "lobby";
      gameInstances.lobby.addPlayer(p);
      if (gameInstances[g]) {
        gameInstances[g].addPlayer(p);
      }
    });
    system.runInterval(() => {
      world
        .getDimension("overworld")
        .getEntities({ type: "noxcrew.ft:seat" })
        .forEach((e) => {
          let c = e.getComponent("rideable");
          let r = c?.getRiders() ?? [];
          if (r.length == 0) {
            e.remove();
          }
        });
    });
    world.getDimension("overworld").runCommand("scriptevent mccr.sot:reset_all");
    let dc = false;
    world.beforeEvents.chatSend.subscribe((ev) => {
      if (dc) {
        ev.cancel = true;
        ev.sender.sendMessage("\u00a7e聊天在当前世界已被禁用");
      }
      if (/^\.获取信息$|^.info$/.test(ev.message)) {
        ev.cancel = true;
        ev.sender.sendMessage("退出聊天栏即可查看。");
        let s = () => {
          system.run(() =>
            info()
              .show(ev.sender)
              .then((r) => {
                if (r.cancelationReason == FormCancelationReason.UserBusy) {
                  s();
                }
              })
          );
        };
        s();
      }
    });

    world.afterEvents.playerInteractWithBlock.subscribe(
      debounce((ev: PlayerBreakBlockAfterEvent) => {
        if (/noxcrew.ft:plush_.*/g.test(ev.block.typeId)) {
          let vmap = new MolangVariableMap();
          vmap.setColorRGB("color", colors[ev.block.typeId.replace(/noxcrew.ft:plush_/, "")] ?? colors.red);
          world.getDimension("overworld").spawnParticle("noxcrew.ft:sparkley", ev.block.center(), vmap);
          world.getDimension("overworld").playSound("sparkle", ev.block, { volume: 0.5 });
        }
      }, 2)
    );

    world.afterEvents.itemUse.subscribe((ev) => {
      if (ev.itemStack.typeId == "noxcrew.ft:teleporter") {
        new ActionFormData()
          .title({ rawtext: [{ translate: "txt.ui.map" }, { text: flags.flag_quick_travel_modal }] })
          .button(tr("txt.ui.tp.area_lobby"))
          .button(tr("txt.ui.tp.area_meltdown"))
          .button(tr("txt.ui.tp.area_sot"))
          .button(tr("txt.ui.tp.area_ace_race"))
          .button(tr("txt.ui.tp.area_grid_runners"))
          .show(ev.source)
          .then((v) => {
            if (!v.canceled) {
              var here = ev.source.location;
              var p = ev.source;
              switch (v.selection) {
                case 0:
                  teleport(p, "lobby", here, coordinates.lobby, undefined, coordinates_rotation.lobby);
                  break;
                case 1:
                  teleport(p, "meltdown", here, coordinates.meltdown, undefined, coordinates_rotation.meltdown);
                  break;
                case 2:
                  teleport(p, "sot", here, coordinates.sot, undefined, coordinates_rotation.sot);
                  break;
                case 3:
                  teleport(p, "ace_race", here, coordinates.ace_race, undefined, coordinates_rotation.ace_race);
                  break;
                case 4:
                  teleport(
                    p,
                    "grid_runners",
                    here,
                    coordinates.grid_runners,
                    undefined,
                    coordinates_rotation.grid_runners
                  );
                  break;
                default:
                  p.sendMessage("666这个入是桂，尝试传送到一个不存在的地方");
              }
            }
          });
      }
      if (ev.itemStack.typeId == "noxcrew.ft:cosmetic_chest") {
        let hats: string[] = JSON.parse((ev.source.getDynamicProperty("mccr:hats") ?? "[]") as string);
        cosmetic_chest(hats)
          .show(ev.source)
          .then((v) => {
            if (!v.canceled) {
              if (v.selection == 0) {
                ev.source.getComponent("equippable")?.setEquipment(EquipmentSlot.Head);
                ev.source.nameTag = ev.source.name;
              } else {
                let item = new ItemStack(hats[(v.selection ?? 1) - 1]);
                item.lockMode = ItemLockMode.slot;
                if (/noxcrew\.ft:beanie_.*/.test(item.typeId)) {
                  let colors = ["aqua", "blue", "cyan", "green", "lime", "orange", "pink", "purple", "red", "yellow"];
                  //start:57824
                  let colorCodes = ["b", 9, 3, 2, "a", 6, "d", 5, "c", "e"];
                  let colorIndex = colors.indexOf(item.typeId.match(/(?<=noxcrew\.ft:beanie_).*/)?.[0] as string);
                  ev.source.nameTag =
                    "\u00a7" +
                    colorCodes[colorIndex].toString() +
                    String.fromCharCode(57824 + colorIndex) +
                    ev.source.name;
                } else {
                  ev.source.nameTag = ev.source.name;
                }
                ev.source.getComponent("equippable")?.setEquipment(EquipmentSlot.Head, item);
              }
            }
          });
      }
      if (ev.itemStack.typeId == "noxcrew.ft:leave_game") {
        let p = ev.source;
        let g = (p.getDynamicProperty("mccr:game") as string) ?? "lobby";
        new MessageFormData()
          .body(tr("txt.ui.tp.confirm1"))
          .button1(tr("txt.button.back"))
          .button2(tr("txt.button.ok"))
          .show(p)
          .then((v) => {
            if (v.selection) {
              if (gameInstances[g]) {
                gameInstances[g].player_quit(p, true);
              }
              gameInstances.lobby.addPlayer(p);
            }
          });
      }
      if (ev.itemStack.typeId == "noxcrew.ft:challenge_list") {
        (async () => {
          (await challenge_list(ev.source)).show(ev.source).then((r) => {
            if (!r.canceled) {
              challenges[challengeColors[r.selection ?? 0]]?.composeInfoUI(ev.source).show(ev.source);
            }
          });
        })();
      }
    });

    world.beforeEvents.playerLeave.subscribe((ev) => {
      ev.player.setDynamicProperty("mccr:is_leaving", true);
      let g = (ev.player.getDynamicProperty("mccr:game") as string) ?? "lobby";
      if (gameInstances[g]) {
        try {
          if (g == "lobby") {
            inventory.save(ev.player);
            delete (gameInstances.lobby as Lobby).players[ev.player.name];
          } else gameInstances[g].removePlayer(ev.player);
        } catch (e) {
          Logger.info(e, (e as Error).stack);
        }
      }
      ev.player.setDynamicProperty("mccr:is_leaving", false);
    });

    function useItem(p: Player, i: ItemStack) {
      if (i.amount > 1) {
        i.amount -= 1;
        p.getComponent("equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
      } else {
        p.getComponent("equippable")?.setEquipment(EquipmentSlot.Mainhand);
      }
    }

    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (ev.target.typeId == "noxcrew.ft:hub_coin") {
        collectHubCoin(ev.player, ev.target);
      }
    });
    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (ev.hitEntity.typeId == "noxcrew.ft:hub_coin" && ev.damagingEntity.typeId == "minecraft:player") {
        collectHubCoin(ev.damagingEntity as Player, ev.hitEntity);
      }
    });
    //#region toys
    world.afterEvents.itemUse.subscribe((ev) => {
      let entity = ev.source.getEntitiesFromViewDirection({ type: "minecraft:player", maxDistance: 3.5 });
      if (entity[0]) {
        let target = entity[0].entity as Player;
        switch (ev.itemStack.typeId) {
          case "noxcrew.ft:player_gift_giving": {
            useItem(ev.source, ev.itemStack);
            target
              .getComponent(EntityComponentTypes.Inventory)
              ?.container.addItem(new ItemStack("noxcrew.ft:player_gift_receiving"));
            target.onScreenDisplay.setActionBar(new Text().tr("txt.misc.msg6_1", ev.source.name));
            ev.source.onScreenDisplay.setActionBar(new Text().tr("txt.misc.msg6_2", target.name));
            break;
          }
          case "noxcrew.ft:confetti_tag_prime": {
            useItem(ev.source, ev.itemStack);
            let target = entity[0].entity as Player;
            world.getDimension("overworld").spawnParticle("noxcrew.ft:party_popper", target.location);
            break;
          }
          case "noxcrew.ft:pizza_box": {
            let d = ev.itemStack.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent;
            if (d?.damage == d?.maxDurability) useItem(ev.source, ev.itemStack);
            else d.damage += 1;
            give(target, new ItemStack("noxcrew.ft:pizza_slice"));
            break;
          }
        }
      }
    });
    world.afterEvents.entityHitEntity.subscribe((ev) => {
      if (ev.hitEntity.typeId == "noxcrew.ft:beach_ball") {
        sound.play(ev.damagingEntity.dimension, "ball_hit", { location: ev.hitEntity.location });
        ev.hitEntity.applyKnockback(Vec3Utils.getProjectileMotion(ev.damagingEntity, 5), 1);
        if (Math.random() < 0.05) {
          ev.hitEntity.dimension.spawnParticle("noxcrew.ft:ball_pop", ev.hitEntity.location);
          ev.hitEntity.remove();
        }
      }
    });
    world.afterEvents.itemUse.subscribe((ev) => {
      switch (ev.itemStack.typeId) {
        case "noxcrew.ft:party_popper":
          ev.source.dimension.spawnParticle("noxcrew.ft:party_popper", ev.source.location);
          if (Vec3Utils.distance(ev.source.location, { x: 2178.54, y: 79.0, z: 100.78 }) < 5) {
            puzzles.day2.complete(ev.source);
          }
          useItem(ev.source, ev.itemStack);
          break;
        case "noxcrew.ft:big_bubble_blower":
          //noxcrew.ft:big_bubbles
          ev.source.dimension.spawnParticle("noxcrew.ft:big_bubbles", ev.source.location);
          useItem(ev.source, ev.itemStack);
          break;
        case "noxcrew.ft:silly_horn":
          ev.source.dimension.spawnParticle("noxcrew.ft:horn", ev.source.location);
          sound.play(world.getDimension("overworld"), "silly_horn", { location: ev.source.location });
          useItem(ev.source, ev.itemStack);
          break;
        case "noxcrew.ft:player_gift_receiving":
          let items = [
            "noxcrew.ft:foam_finger",
            "noxcrew.ft:balloon_animal",
            "noxcrew.ft:big_bubble_blower",
            "noxcrew.ft:silly_horn",
            "noxcrew.ft:party_popper",
            "noxcrew.ft:confetti_tag_prime",
            "noxcrew.ft:pizza_box",
            "noxcrew.ft:celebration_fireworks",
            "noxcrew.ft:disco_ball",
            "noxcrew.ft:beach_ball",
            "noxcrew.ft:balloon_helium",
          ];
          useItem(ev.source, ev.itemStack);
          give(ev.source, new ItemStack(choice(items)));
          if (getHat(ev.source)?.typeId == "noxcrew.ft:beanie_lime") challenges.lime.recordProgesss(ev.source, 1);
          break;
      }
    });
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (ev.target.typeId == "noxcrew.ft:beach_ball") {
        ev.target.remove();
      }
    });
    world.afterEvents.itemUse.subscribe((ev) => {
      let block = ev.source.getBlockFromViewDirection({ maxDistance: 8 });
      if (!block?.block) return;
      let above = block.block.above();
      switch (ev.itemStack?.typeId) {
        case "noxcrew.ft:disco_ball":
          if (!above) return;
          world.getDimension("overworld").spawnEntity("noxcrew.ft:disco_ball", above.bottomCenter());
          if (Vec3Utils.distance({ x: 2210, y: 82, z: 4281 }, ev.source.location) < 3) {
            puzzles.day4.complete(ev.source);
          }
          useItem(ev.source, ev.itemStack);
          break;
        case "noxcrew.ft:beach_ball": {
          if (!above) return;
          let ball = ev.source.dimension.spawnEntity("noxcrew.ft:beach_ball", above.bottomCenter());
          system.runTimeout(() => {
            if (ball.isValid) ball.remove();
          }, 2400);
          useItem(ev.source, ev.itemStack);
          break;
        }
        case "noxcrew.ft:balloon_helium": {
          if (!above) return;
          world.getDimension("overworld").spawnEntity("noxcrew.ft:balloon_helium", above.bottomCenter());
          useItem(ev.source, ev.itemStack);
          break;
        }
        case "noxcrew.ft:celebration_fireworks":
          if (!above) return;
          ev.source.dimension.spawnParticle("noxcrew.ft:c_firework_rocket", above.bottomCenter());
          world.getDimension("overworld").playSound("firework.launch", above.bottomCenter());
          system.runTimeout(() => {
            world.getDimension("overworld").playSound("firework.blast", above.bottomCenter());
          }, 80);
          useItem(ev.source, ev.itemStack);
          if (Vec3Utils.distance({ x: 2192, y: 171, z: 2095 }, ev.source.location) < 3) {
            puzzles.day6.complete(ev.source);
          }
          break;
        case "noxcrew.ft:balloon_animal": {
          if (!above) return;
          world.getDimension("overworld").spawnParticle("noxcrew.ft:balloon_animal", above.bottomCenter());
          sound.play(world.getDimension("overworld"), "balloon_animal", { location: above });
          useItem(ev.source, ev.itemStack);
          break;
        }
      }
    });

    world.afterEvents.itemCompleteUse.subscribe((ev) => {
      if (
        ev.itemStack.typeId == "noxcrew.ft:party_cake" &&
        Vec3Utils.distance({ x: 67, y: 88, z: 2180 }, ev.source.location) < 8
      ) {
        puzzles.day5.complete(ev.source);
      }
    });
    //#endregion

    system.afterEvents.scriptEventReceive.subscribe((e) => {
      if (e.id == "mccr.test:info") {
        console.log(e.sourceEntity?.id);
      }
    });

    system.runInterval(() => {
      world.getAllPlayers().forEach((p) => {
        var e = p.getComponent("equippable");
        if (e?.getEquipment(EquipmentSlot.Chest)?.typeId == "minecraft:elytra") {
          if (p.isGliding) {
            p.setDynamicProperty("mccr:used_elytra", true);
          }
          if (p.isOnGround && p.getDynamicProperty("mccr:used_elytra")) {
            e.setEquipment(EquipmentSlot.Chest, undefined);
            sound.play(p, "elytra_remove", {});
            if (gameInstances.ace_race.players[p.name]) {
              gameInstances.ace_race.stats[p.name].elytra++;
            }
            p.setDynamicProperty("mccr:used_elytra", false);
          }
        }
      });
    });
    Logger.info("所有内容加载完成！");
  });
});

world.afterEvents.playerJoin.subscribe((ev) => {
  playerSessionData[ev.playerName] = {};
});

world.afterEvents.pressurePlatePush.subscribe((ev) => {
  if (Vector3Utils.equals(ev.block, { x: 2112, y: 102, z: 2167 })) {
    (ev.source as Player).onScreenDisplay?.setActionBar(new Text().tr("txt.misc.msg8"));
  }
});

runAfterStartup(() => {
  world.getAllPlayers().forEach((p) => {
    playerSessionData[p.name] = {};
  });
});

function launch(p: Player) {
  let motion = Object.assign(Vec3Utils.getProjectileMotion(p, 10), { y: 0 });
  p.applyKnockback(motion, 0.5);
  sound.play(p, "launch", {});
}

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.sourceEntity && ev.id == "mccr:test_launch") {
    launch(ev.sourceEntity as Player);
  }
});
