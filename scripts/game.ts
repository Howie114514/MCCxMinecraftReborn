import { EquipmentSlot, ItemLockMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { showLobbyGameBar } from "./ui/gamebar";
import { gameInstances } from "./games/gameInstance";
import { forIn, forInAsync, playerByName } from "./utils";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { coordinates } from "./main";
import { tr } from "./lang";
import { Queue } from "./queue";
import { inventory } from "./inventory";
import { rules } from "./rule";
import { Logger } from "./logger";
import { Text } from "./text";
import { sound } from "./sound";

type SetHotbarOpt = {
  lock?: boolean;
  clearAll?: boolean;
};
type JSONItem = {
  id: string;
  amount: number;
  lockMode: ItemLockMode;
  nameTag?: string;
};

export class BasicGame {
  players: Record<string, Player> = {};
  music: string = "music_hub";
  name: string = "unknown";
  constructor() {
    system.runInterval(() => {
      this.mainloop();
    });
    system.runInterval(() => {
      forInAsync(this.players, (v, n) => {
        if (v && !v.isValid) this.removePlayerByName(n);
        if (v) this.player_onTick(v);
      });
    });
    system.runInterval(() => {
      forInAsync(this.players, (v) => {
        if (v) this.showGameBar(v);
      });
    });
  }
  getProperty<T extends string | number | boolean>(id: string, defaultValue: T): T {
    return (world.getDynamicProperty(`mccr.${this.name}:${id}`) as T) ?? defaultValue;
  }
  setProperty<T extends string | number | boolean>(id: string, value: T) {
    world.setDynamicProperty(`mccr.${this.name}:${id}`, value);
  }
  addPlayer(p: Player) {
    if (p.getDynamicProperty("mccr:is_leaving")) return;
    if (!this.players[p.name]) {
      this.players[p.name] = p;
      let o = p.getDynamicProperty("mccr:game") as string;
      if (o !== this.name && o) {
        gameInstances[o]?.player_quit(p);
      }
      p.setDynamicProperty("mccr:game", this.name);
      system.run(() => {
        console.log("Play music");
        p.playMusic(this.music, {
          loop: true,
          volume: 1,
          fade: 0,
        });
      });
      this.player_join(p);
    }
  }
  player_join(p: Player) {}
  player_finish(p: Player) {
    this.removePlayer(p);
  }
  removePlayerByName(n: string) {
    delete this.players[n];
  }
  player_quit(p: Player, withItem = false) {
    this.removePlayer(p);
  }
  removePlayer(p: Player) {
    this.removePlayerByName(p.name);
  }
  mainloop() {}
  player_onTick(p: Player) {
    if (p.location.y <= -60) {
      this.player_respawn(p);
    }
  }
  showGameBar(p: Player) {
    showLobbyGameBar(
      p,
      (p.getDynamicProperty("mccr:glyphs") as number) ?? 0,
      (p.getDynamicProperty("mccr:coins") as number) ?? 0
    );
  }
  player_respawn(p: Player) {
    p.teleport({
      x: 2158.0,
      y: 110.0,
      z: 2131.0,
    });
  }
}

export class Lobby extends BasicGame {
  name = "lobby";
  getPlayerArea(p: Player) {
    return p.getDynamicProperty("mccr:lobby_area") as string;
  }
  setPlayerArea(p: Player, a: string) {
    p.setDynamicProperty("mccr:lobby_area", a);
  }
  constructor() {
    super();
    system.runInterval(() => {
      forInAsync(this.players, (p) => {
        if (p && p.getDynamicProperty("mccr:game") != "lobby") {
          this.removePlayer(p);
        }
      });
    });
    let n = 1;
    system.runInterval(() => {
      forInAsync(this.players, (p) => {
        p.sendMessage(new Text().tr("txt.nudge.msg" + n.toString()));
        n++;
        if (n == 13) n = 1;
        if (n == 8) n++;
      });
    }, 600);
  }
  player_onTick(p: Player): void {
    super.player_onTick(p);
    //p.addEffect(MinecraftEffectTypes.InstantHealth, 10, { amplifier: 255, showParticles: false });
  }
  player_join(p: Player): void {
    p.triggerEvent("mccr:become_invulnerable");
    let e = p.getComponent("equippable");
    e?.setEquipment(EquipmentSlot.Legs, undefined);
    e?.setEquipment(EquipmentSlot.Chest, undefined);
    e?.setEquipment(EquipmentSlot.Feet, undefined);
    let jsonInv: Record<string, JSONItem> = JSON.parse(
      (p.getDynamicProperty("mccr.lobby:inventory") as string) ??
        JSON.stringify({
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
        } as Record<number, JSONItem>)
    );
    if (Object.keys(jsonInv).length <= 3) {
      inventory.set(
        p,
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
    try {
      inventory.set(p, jsonInv, { clearAll: true, lock: false });
    } catch (err) {
      inventory.set(
        p,
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
  }
  player_respawn(p: Player): void {
    p.teleport(coordinates[this.getPlayerArea(p)] ?? coordinates.lobby);
  }
  showGameBar(p: Player): void {
    showLobbyGameBar(
      p,
      (p.getDynamicProperty("mccr:glyphs") as number) ?? 0,
      (p.getDynamicProperty("mccr:coins") as number) ?? 0
    );
  }
}

export enum MatchingStatus {
  countdown,
  none,
}

export class ComplexGame {
  queue = new Queue<string>();
  players: Record<string, Player> = {};
  started = false;
  available = true;
  isWaiting = true;
  tick = 0;
  name = "test";
  music = "music_md";
  anim_t = 0;
  countdown_timer = -1;
  status: MatchingStatus = MatchingStatus.none;
  constructor() {
    system.runInterval(() => {
      this.anim_t++;
      if (this.queue.items.length >= this.queue.minCount) {
        if (this.started) {
          this.queue.items.forEach((p) => {
            playerByName(p)?.onScreenDisplay.setActionBar(
              tr("txt.matchmaking.status.preparing." + (this.anim_t % 6).toString())
            );
          });
        }
      } else {
        this.queue.items.forEach((p) => {
          playerByName(p)?.onScreenDisplay.setActionBar(
            tr(
              "txt.matchmaking.status.in_queue." + (this.anim_t % 6).toString(),
              `${this.queue.items.length}/${this.queue.minCount}`
            )
          );
        });
      }
    }, 3);
    system.runInterval(() => {
      this.tick++;
      if (this.countdown_timer > -1) this.countdown_timer--;
      if (world.getAllPlayers().length > 0) {
        this.queue.minCount = Math.min(world.getAllPlayers().length, 4);
        if (this.queue.items.length >= this.queue.minCount && !this.started) {
          if (this.countdown_timer == 0 && !this.started) this.start();
          else {
            if (this.countdown_timer < 0) {
              this.countdown_timer = 100;
            }
            let cdSeconds = this.countdown_timer / 20;
            if (this.countdown_timer > 0 && cdSeconds % 1 == 0) {
              this.queue._next().forEach((pl) => {
                let p = playerByName(pl);
                if (!p) return;
                p?.onScreenDisplay.setActionBar(
                  new Text().tr("txt.matchmaking.status.teleporting", cdSeconds.toString())
                );
                if (cdSeconds == 5) sound.play(p as Player, "queue_success", {});
                sound.play(p as Player, "queue_countdown", {});
              });
            }
          }
        }
        this.queue.items.forEach((v) => {
          if (
            !playerByName(v) ||
            (playerByName(v) && (gameInstances.lobby as Lobby).getPlayerArea(playerByName(v) as Player) != this.name)
          ) {
            this.queue.remove(v);
          }
        });
      }
    });
    system.runInterval(() => {
      if (Object.keys(this.players).length == 0 && this.started) {
        this.end();
      }
    });
    system.runInterval(() => {
      forInAsync(this.players, (p, n) => {
        if (!p) {
          delete this.players[n];
        }
        if (!p.isValid) {
          this.removePlayerByName(n);
        }
        this.showGamebar(p);
      });
    });
  }
  mainloop() {}
  showGamebar(p: Player) {}
  addPlayer(p: Player) {
    if (!this.queue.items.includes(p.name)) {
      this.queue.enqueue(p.name);
      p.sendMessage("你加入了队列");
    }
  }
  start() {
    this.queue.next().forEach((p) => {
      let player = playerByName(p);
      if (!player) return;
      this.players[p] = player;
      inventory.save(player);
      this.queue.remove(p);
      player.sendMessage("你已加入游戏");
      player.setDynamicProperty("mccr:game", this.name);
      player.playMusic(this.music, { loop: true });
    });
    //system.runTimeout(() => this.end(), 100);
    this.started = true;
  }
  end() {
    this.started = false;
    forIn(this.players, (p, k) => {
      this.player_finish(p);
    });
    this.players = {};
  }
  player_quit(p: Player, withItem = false) {
    this.removePlayer(p);
  }
  player_finish(p: Player, all: boolean = false) {
    //p.sendMessage("你完成了游戏！");
    this.removePlayer(p);
  }
  removePlayerByName(n: string) {
    delete this.players[n];
  }
  removePlayer(p: Player) {
    gameInstances.lobby.addPlayer(p);
    this.removePlayerByName(p.name);
  }
}
