import {
  world,
  system,
  ScriptEventSource,
  Player,
  Vector3,
  EquipmentSlot,
  ItemStack,
  EffectType,
  EffectTypes,
  TicksPerSecond,
  ItemLockMode,
  BlockVolume,
  GameMode,
  MolangVariableMap,
  RGB,
  PaletteColor,
  PlayerBreakBlockAfterEvent,
  BlockComponentRegistry,
} from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import flags from "./flags";
import { Vector2Builder, Vector3Builder, Vector3Utils } from "@minecraft/math";
import { Vec3Utils } from "./math";
import { tr, itemName } from "./lang";
import { MinecraftCameraPresetsTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { showLobbyGameBar } from "./ui/gamebar";
import { debounce, forIn, rgb, vaildateNum } from "./utils";
import { cosmetic_chest, vendor_food, vendor_hat, vendor_mascot } from "./ui/screens";
import { gameInstances } from "./games/gameInstance";
import { addCoins, clearAllData, getCoins, setCoins } from "./gameData";
import { Lobby } from "./game";
import { puzzles } from "./puzzles/puzzle";
import env from "./environment";
import { inventory } from "./inventory";
import { LKey } from "./langfile";
import { rules } from "./rule";
import { Logger } from "./logger";
import { blockCompoents, itemCompoents } from "./compoents";
import { showSubTitle } from "./ui/title";
import { sound } from "./sound";
import { overworld } from "./constants";

world.beforeEvents.worldInitialize.subscribe((init) => {
  forIn(blockCompoents, (v, k) => {
    init.blockComponentRegistry.registerCustomComponent("mccr:" + k, v);
  });
  forIn(itemCompoents, (v, k) => {
    init.itemComponentRegistry.registerCustomComponent("mccr:" + k, v);
  });
});

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
  } else {
    p.sendMessage("[!] 这个游戏还没有开发完成＞﹏＜ 敬请期待");
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
  if (ev.itemStack?.typeId == "minecraft:stick") {
    ev.target.remove();
  }
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
            new MessageFormData().title("").body(tr("txt.error.msg1")).button1("确认").button2("取消").show(ev.player);
            return;
          }
          ev.player.runCommand(`give @s ${foods[v.selection as number]}`);
          ev.player.runCommand("scriptevent mccr:remove_coins " + price[v.selection ?? 0].toString());
        }
      });
  }
});

world.afterEvents.projectileHitBlock.subscribe((ev) => {
  ev.projectile.addTag("hit");
  system.runTimeout(() => {
    ev.projectile.isValid() ? ev.projectile.remove() : undefined;
  }, 20 * TicksPerSecond);
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

function teleport(player: Player, dest: "ace_race" | "sot" | "lobby" | string, from: Vector3, to: Vector3) {
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
        if (v.selection == 0) {
          player.teleport(from);
        } else {
          sound.play(player, "quick_travel", {});
          player.teleport(to);
          (gameInstances.lobby as Lobby).setPlayerArea(player, dest);
        }
        system.runTimeout(() => player.removeTag("inPortal"), 10);
      });
  else {
    player.teleport(to);
  }
}

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
        pos[2] == "here" ? p.location : (coordinates[pos[2]] as Vector3)
      );
    }
  } else if (ev.id == "mccr:clear_effect") {
    system.runTimeout(() => p.playSound("launch"), 2);
    if (p) {
      system.runTimeout(() => {
        p.removeEffect(MinecraftEffectTypes.Levitation);
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
        gameInstances[ev.message].player_finish(p);
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
  } else if (ev.id == "mccr:collect_coins") {
    if (p) {
      let collected = p.getDynamicProperty(
        "mccr:collected_" + Vec3Utils.toMiniString(Vector3Utils.floor(p.location))
      ) as boolean;
      //console.error("mccr:collected_" + Vec3Utils.toMiniString(Vector3Utils.floor(p.location)));
      if (!collected) {
        let ce = p.dimension.getEntities({ location: p.location, maxDistance: 0.6, type: "noxcrew.ft:hub_coin" })[0];
        let count = (ce.getProperty("noxcrew:variant") as number) ?? 1;
        p.playSound(count == 3 ? "bigcoins" : "smallcoins");
        let c = count == 1 ? 5 : count == 2 ? 20 : 50;

        addCoins(p, c);
        showSubTitle(p, tr("txt.lobby.coins" + c.toString()));
        p.setDynamicProperty("mccr:collected_" + Vec3Utils.toMiniString(Vector3Utils.floor(p.location)), true);
      } else {
        p.onScreenDisplay.setActionBar(tr("mccr.coins.collected"));
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
    world.sendMessage(env);
  }
});
world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  ev.cancel = disableBlockBreaking;
  if (ev.cancel) system.run(() => ev.player.onScreenDisplay.setActionBar("已阻止一次可能无意间产生的方块破坏"));
});
world.afterEvents.playerSpawn.subscribe((ev) => {
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
    system.runTimeout(
      () =>
        ev.player.sendMessage(
          "欢迎来到MCC X Minecraft Reborn!\n\n本地图旨在还原MCC X Minecraft活动服务器的玩法！\n\n作者：Howie"
        ),
      50
    );
    gameInstances.lobby.addPlayer(ev.player);
    ev.player.teleport(coordinates.lobby);
  }
});
world.afterEvents.worldInitialize.subscribe((ev) => {
  world.getAllPlayers().forEach((p) => {
    let g = (p.getDynamicProperty("mccr:game") as string) ?? "lobby";
    if (gameInstances[g]) {
      gameInstances[g].addPlayer(p);
    } else gameInstances.lobby.addPlayer(p);
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
});
let dc = false;
world.beforeEvents.chatSend.subscribe((ev) => {
  if (dc) {
    ev.cancel = true;
    ev.sender.sendMessage("\u00a7e聊天在当前世界已被禁用");
  }
});

world.afterEvents.playerInteractWithBlock.subscribe(
  debounce((ev: PlayerBreakBlockAfterEvent) => {
    if (/noxcrew.ft:plush_.*/g.test(ev.block.typeId)) {
      let vmap = new MolangVariableMap();
      vmap.setColorRGB("color", colors[ev.block.typeId.replace(/noxcrew.ft:plush_/, "")] ?? colors.red);
      world.getDimension("overworld").spawnParticle("noxcrew.ft:sparkley", ev.block.center(), vmap);
    }
  }, 2)
);

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
};
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
              teleport(p, "lobby", here, coordinates.lobby);
              break;
            case 1:
              teleport(p, "meltdown", here, coordinates.meltdown);
              break;
            case 2:
              teleport(p, "sot", here, coordinates.sot);
              break;
            case 3:
              teleport(p, "ace_race", here, coordinates.ace_race);
              break;
            case 4:
              teleport(p, "grid_runners", here, coordinates.grid_runners);
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
                "\u00a7" + colorCodes[colorIndex].toString() + String.fromCharCode(57824 + colorIndex) + ev.source.name;
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
//#region toys
world.afterEvents.itemUse.subscribe((ev) => {
  switch (ev.itemStack.typeId) {
    case "noxcrew.ft:celebration_fireworks":
      ev.source.dimension.spawnParticle("noxcrew.ft:c_firework_rocket", ev.source.location);
      useItem(ev.source, ev.itemStack);
      break;
    case "noxcrew.ft:party_popper":
      ev.source.dimension.spawnParticle("noxcrew.ft:party_popper", ev.source.location);
      useItem(ev.source, ev.itemStack);
      break;
    case "noxcrew.ft:big_bubble_blower":
      //noxcrew.ft:big_bubbles
      ev.source.dimension.spawnParticle("noxcrew.ft:big_bubbles", ev.source.location);
      useItem(ev.source, ev.itemStack);
      break;
    case "noxcrew.ft:silly_horn":
      ev.source.dimension.spawnParticle("noxcrew.ft:horn", ev.source.location);
      sound.play(overworld, "silly_horn", { location: ev.source.location });
      useItem(ev.source, ev.itemStack);
      break;
  }
});
//#endregion

system.runInterval(() => {
  world.getAllPlayers().forEach((p) => {
    var e = p.getComponent("equippable");
    if (e?.getEquipment(EquipmentSlot.Chest)?.typeId == "minecraft:elytra") {
      if (p.isGliding) {
        p.setDynamicProperty("mccr:used_elytra", true);
      }
      if (p.isOnGround && p.getDynamicProperty("mccr:used_elytra")) {
        e.setEquipment(EquipmentSlot.Chest, undefined);
        p.setDynamicProperty("mccr:used_elytra", false);
      }
    }
  });
});

Logger.info("所有内容加载完成！");
