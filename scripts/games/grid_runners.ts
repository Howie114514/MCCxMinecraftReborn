import {
  Block,
  BlockPermutation,
  BlockType,
  BlockTypes,
  BlockVolume,
  EffectType,
  Entity,
  EntityProjectileComponent,
  EquipmentSlot,
  GameMode,
  InputPermissionCategory,
  ItemStack,
  Player,
  system,
  TicksPerSecond,
  Vector3,
  world,
} from "@minecraft/server";
import { ComplexGame } from "../game";
import { FTSounds, sound } from "../sound";
import { Text } from "../text";
import {
  BlockVolumeArguments,
  createEntityPropertyProxy,
  fill,
  forIn,
  forInAsync,
  initializeBlockVolume,
  random,
  tick2Time,
  useItem,
} from "../utils";
import { showSubTitle } from "../ui/title";
import { doors, mob_spawnpoints, paintings, reeds, start_blocks, starts, wheats } from "../data/gr";
import { inventory } from "../inventory";
import { colors, coordinates } from "../main";
import { Vector3Utils } from "../minecraft/math";
import { gameInstances } from "./gameInstance";
import { MinecraftBlockTypes, MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { gridRunnersGamebar } from "../ui/gamebar";
import { getCoins } from "../gameData";
import { Logger } from "../logger";
import { Vec3Utils } from "../math";
import { showGRCompleteToast } from "../ui/gametoast";
import { challenges } from "../challenges";

export class GRLevel {
  game: GridRunners;
  playerInvulnerable = false;
  id = 0;
  pos: Vector3 = { x: 0, y: 0, z: 0 };
  constructor(gr: GridRunners) {
    this.game = gr;
    system.runInterval(() => {
      if (this.game.started && this.game.currentLevelId == this.id) this.mainloop();
    });
  }
  loop(p: Player) {
    if (this.playerInvulnerable) {
      p.addEffect("resistance", 1, { amplifier: 255, showParticles: false });
      p.addEffect("instant_health", 1, { amplifier: 255, showParticles: false });
    }
  }
  mainloop() {}
  showGamebar(p: Player) {
    gridRunnersGamebar.showGRGameBar(p, `\ue195 ${this.game.player_data[p.name].coins}`, getCoins(p));
  }
  tpAllPlayers() {
    forIn(this.game.players, (p) => {
      if (this.game.player_data[p.name].area != this.id) {
        this.game.player_data[p.name].area = this.id;
        p.teleport(this.pos);
        this.playerEnter(p);
      }
    });
  }
  playerEnter(p: Player) {
    inventory.set(p, { 8: new ItemStack("noxcrew.ft:leave_game") });
  }
  start() {}
  reset() {}
  closeDoor() {
    let d: BlockVolumeArguments = doors[this.id];
    if (!d) return;
    fill(d, MinecraftBlockTypes.NetheriteBlock);
    world
      .getDimension("overworld")
      .fillBlocks(
        new BlockVolume(Vector3Utils.add(d.from, { x: 0, y: 1, z: 0 }), Vector3Utils.add(d.to, { x: 0, y: -1, z: 0 })),
        MinecraftBlockTypes.IronBlock
      );
  }
  openDoor() {
    let d: BlockVolumeArguments = doors[this.id];
    fill(d, MinecraftBlockTypes.Air);
  }
}

class Level0 extends GRLevel {
  playerInvulnerable: boolean = true;
  id = 0;
}

class Level1 extends GRLevel {
  playerInvulnerable: boolean = true;
  id = 1;
  pos = { x: 2164.14, y: 61.0, z: 4256.07 };
  playerEnter(p: Player) {
    sound.play(p, "room_beast", {});
    p.sendMessage(new Text().tr("txt.tut.grid1_text"));
    showSubTitle(p, new Text().tr("txt.tut.grid1_title"));
    inventory.set(p, { 0: new ItemStack("minecraft:stone_sword"), 8: new ItemStack("noxcrew.ft:leave_game") });
  }
  mobGroups = [
    ["minecraft:zombie", "minecraft:husk"],
    ["minecraft:skeleton", "minecraft:stray"],
    ["minecraft:pillager", "minecraft:witch"],
  ];
  mainloop(): void {
    let e = world.getDimension("overworld").getEntities({ tags: ["gr_mobs"] });
    if (e.length == 0) {
      if (this.game.tick_timer > 82) {
        forIn(this.game.players, (p) => {
          p.onScreenDisplay.setActionBar(new Text().tr("txt.grid.wave_clear"));
          showSubTitle(p, new Text().tr("txt.grid.wave_reward"));
          this.game.playSound("scoreacquired");
          this.game.player_data[p.name].coins += 10;
        });
      }
      let group = random.choice(this.mobGroups);
      mob_spawnpoints.forEach((p) => {
        let e = world.getDimension("overworld").spawnEntity(random.choice(group), p);
        e.addTag("gr_mobs");
        e.addEffect("fire_resistance", 20000000, { showParticles: false });
      });
    }
  }
  showGamebar(p: Player) {
    gridRunnersGamebar.showGRGameBarWithAdditionalInfo(
      p,
      `\ue195 ${this.game.player_data[p.name].coins} \ue1c7 ${Math.floor(60 - (this.game.tick_timer - 80) / 20)}s`,
      getCoins(p)
    );
  }
}

class Level2 extends GRLevel {
  id = 2;
  pos = { x: 2195.71, y: 64.0, z: 4255.96 };
  paintedBlockCount = [0, 0];
  playerInvulnerable: boolean = true;
  constructor(gr: GridRunners) {
    super(gr);
    world.afterEvents.projectileHitBlock.subscribe((ev) => {
      if (ev.projectile?.typeId == "noxcrew.ft:paint_proj") {
        Logger.info(
          "Projectile hit block:",
          ev.projectile.getProperty("noxcrew.ft:color"),
          ev.getBlockHit().block.typeId
        );
        let block = ev.getBlockHit().block;
        let paintBlock = (block: Block) => {
          if (
            block.typeId == "noxcrew.ft:painting_" + ev.projectile.getProperty("noxcrew.ft:color") &&
            block.permutation.matches("noxcrew.ft:painting_" + ev.projectile.getProperty("noxcrew.ft:color"), {
              "noxcrew.ft:painted": false,
            })
          ) {
            block.setPermutation(block.permutation.withState("noxcrew.ft:painted", true));
            this.paintedBlockCount[block.location.z == 4242 ? 0 : 1] += 1;
            world.getDimension("overworld").spawnParticle("noxcrew.ft:coin_burst_small", ev.projectile.location);
            if (this.game.currentLevelId == this.id) {
              if (
                ev.source &&
                ev.source.typeId == "minecraft:player" &&
                this.game.player_data[(ev.source as Player).name]
              ) {
                this.game.player_data[(ev.source as Player).name].coins += 3;
                this.game.player_data[(ev.source as Player).name].painted += 1;
              }
              if (this.paintedBlockCount[block.location.z == 4242 ? 0 : 1] == 40) {
                forIn(this.game.players, (p, n) => {
                  let d = this.game.player_data[n];
                  d.coins += 10;
                  showSubTitle(p, new Text().tr("txt.grid.painting_reward"));
                  p.onScreenDisplay.setActionBar(new Text().tr("txt.grid.painting_clear"));

                  this.game.playSound("scoreacquired");
                  this.place(block.location.z == 4242 ? 0 : 1);
                });
              }
            }
          }
        };
        paintBlock(block);
        paintBlock(block.above() as Block);
        paintBlock(block.below() as Block);
        paintBlock(block.east() as Block);
        paintBlock(block.west() as Block);
        ev.projectile.remove();
      }
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.gr:test") {
        this.start();
      }
    });
  }
  paintings = [
    { x: 2198, y: 69, z: 4242 },
    { x: 2198, y: 69, z: 4269 },
  ];
  start() {
    this.place(0);
    this.place(1);
  }
  place(id: number) {
    this.paintedBlockCount[id] = 0;
    this.placePainting(random.choice(paintings), this.paintings[id]);
  }
  showGamebar(p: Player): void {
    let rest = Math.floor(60 - (this.game.tick_timer - 1280) / 20);
    gridRunnersGamebar.showGRGameBarWithAdditionalInfo(
      p,
      `\ue195 ${this.game.player_data[p.name].coins} \ue1c8 ${rest}s`,
      getCoins(p)
    );
  }
  playerEnter(p: Player): void {
    sound.play(p, "room_copy", {});
    showSubTitle(p, new Text().tr("txt.tut.grid2_title"));
    p.sendMessage(new Text().tr("txt.tut.grid2_text"));
    inventory.set(p, {
      0: new ItemStack("noxcrew.ft:paintbrush"),
      8: new ItemStack("noxcrew.ft:leave_game"),
    });
  }
  placePainting(bs: string[][], pos: Vector3) {
    bs.forEach((bl, l) => {
      bl.forEach((b, i) => {
        let bp = Vector3Utils.add(pos, { x: i, y: -l, z: 0 });
        world.getDimension("overworld").getBlock(bp)?.setType(b);
        let pp = Vector3Utils.add(pos, { x: i + 12, y: -l, z: 0 });
        world
          .getDimension("overworld")
          .getBlock(pp)
          ?.setPermutation(
            BlockPermutation.resolve(
              "noxcrew.ft:painting_" +
                b
                  .match(/minecraft:(.*)_concrete/)?.[1]
                  .replace("light_", "")
                  .replace("lime", "green"),
              {
                "noxcrew.ft:painted": false,
              }
            )
          );
      });
    });
  }
}

class Level3 extends GRLevel {
  id = 3;
  pos = { x: 2228.08, y: 64.0, z: 4256.02 };
  playerEnter(p: Player): void {
    showSubTitle(p, new Text().tr("txt.tut.grid3_title"));
    p.sendMessage(new Text().tr("txt.tut.grid3_text"));
    inventory.set(p, {
      8: new ItemStack("noxcrew.ft:leave_game"),
    });
    sound.play(p, "room_cake", {});
  }
  cake: undefined | Entity = undefined;
  showGamebar(p: Player): void {
    let rest = Math.floor(60 - (this.game.tick_timer - 2480) / 20);
    gridRunnersGamebar.showGRGameBarWithAdditionalInfo(
      p,
      `\ue195 ${this.game.player_data[p.name].coins} \ue1c9 ${rest}s`,
      getCoins(p)
    );
  }
  start(): void {
    this.cake = world.getDimension("overworld").getEntities({ type: "noxcrew.ft:giant_cake", closest: 1 })[0];
    this.reset();
    let c = world.getDimension("overworld").getBlock({ x: 2249, y: 64, z: 4260 })?.getComponent("inventory")?.container;
    if (c)
      for (let s = 0; s < c?.size; s++) {
        c.setItem(s, new ItemStack("minecraft:bucket", 16));
      }
    for (let i = 0; i < 2; i++) {
      let chicken = world
        .getDimension("overworld")
        .spawnEntity("minecraft:chicken", { x: 2229.48, y: 67.0, z: 4245.05 });
      let cow = world.getDimension("overworld").spawnEntity("minecraft:cow", { x: 2250.53, y: 65.0, z: 4263.52 });
      cow.addTag("gr_animals");
      chicken.addTag("gr_animals");
    }
    reeds.forEach((r) => {
      world
        .getDimension("overworld")
        .fillBlocks(new BlockVolume(r, Vector3Utils.add(r, { x: 0, y: 2, z: 0 })), "minecraft:reeds");
    });
  }
  reset(): void {
    if (!this.cake || !this.cake?.isValid) return;
    this.cake.setProperty("noxcrew.ft:cake_completion", 0);
    this.cake.setProperty("noxcrew.ft:egg", 0);
    this.cake.setProperty("noxcrew.ft:milk_bucket", 0);
    this.cake.setProperty("noxcrew.ft:sugar", 0);
    this.cake.setProperty("noxcrew.ft:wheat", 0);
    this.cake.setProperty("noxcrew.ft:disappear", false);
  }
  checkCompletion() {
    if (this.cake) {
      let props = createEntityPropertyProxy(this.cake);
      let completion: number =
        (props["noxcrew.ft:egg"] as number) +
        (props["noxcrew.ft:milk_bucket"] as number) +
        (props["noxcrew.ft:sugar"] as number) +
        (props["noxcrew.ft:wheat"] as number);
      Logger.info(completion);
      if (completion == 7) {
        forIn(this.game.players, (p) => {
          showSubTitle(p, new Text().tr("txt.grid.cake_reward"));
          p.onScreenDisplay.setActionBar(new Text().tr("txt.grid.cake_reward"));
          this.game.player_data[p.name].cakes += 1;
          this.game.playSound("scoreacquired");
        });
        props["noxcrew.ft:disappear"] = true;
        system.runTimeout(() => this.reset(), 2 * TicksPerSecond);
      }
    }
  }
  reeds: Record<string, number> = {};
  constructor(game: GridRunners) {
    super(game);
    system.runInterval(() => {
      if (game.tick_timer > 2480 && game.tick_timer < 3680 && game.started)
        try {
          reeds.forEach((p) => {
            let k = Vec3Utils.toMiniString(p);
            let b = world.getDimension("overworld").getBlock(p) as Block;
            let height = 0;
            if (!b?.isAir) height++;
            if (!b.above()?.isAir) height++;
            if (!b.above()?.above()?.isAir) height++;
            let pHeight = this.reeds[k] ?? height;
            this.reeds[k] = height;
            //Logger.info(pHeight, height, pHeight - height, k);
            if (height < 3 && game.tick_timer % 10 == 0) {
              world
                .getDimension("overworld")
                .setBlockType(Vector3Utils.add(p, { x: 0, y: height, z: 0 }), "minecraft:reeds");
            }
            if (pHeight - height > 0) {
              let sugar = new ItemStack("minecraft:sugar", pHeight - height);
              let i = world
                .getDimension("overworld")
                .spawnItem(sugar, Vector3Utils.add(p, { x: 0.5, y: pHeight, z: 0.5 }));
              i.addTag("gr_animals");
            }
          });
        } catch (e) {}
    });
    system.runInterval(() => {
      world
        .getDimension("overworld")
        .getEntities({ tags: ["gr_animals"], type: "minecraft:chicken" })
        .forEach((c) => {
          let pos = c.location;
          world.getDimension("overworld").spawnItem(new ItemStack("minecraft:egg"), pos).addTag("gr_animals");
        });
    }, 20);
    system.runInterval(() => {
      if (game.tick_timer > 2480 && game.tick_timer < 3680 && game.started) {
        try {
          wheats.forEach((w) => {
            for (let b of initializeBlockVolume(w).getBlockLocationIterator()) {
              let block = world.getDimension("overworld").getBlock(b);
              if (!block) continue;
              let growth = 0;
              if (block?.typeId == "minecraft:wheat") {
                growth = Math.min((block.permutation.getAllStates().growth as number) + 1, 7);
              }
              let p = BlockPermutation.resolve("minecraft:wheat", { growth: growth });
              block?.setPermutation(p);
              block.below()?.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Farmland));
            }
          });
        } catch (e) {}
      }
    }, 5);
    world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
      if (ev.target.typeId == "noxcrew.ft:giant_cake" && !ev.target.getProperty("noxcrew.ft:disappear")) {
        this.checkCompletion();
        if (ev.itemStack) {
          let props = createEntityPropertyProxy(ev.target);
          switch (ev.itemStack.typeId) {
            case "minecraft:sugar":
              (() => {
                let p: number = props["noxcrew.ft:sugar"] as number;
                if (p < 2) {
                  useItem(ev.player);
                  (props["noxcrew.ft:sugar"] as number) += 1;
                }
              })();
              game.player_data[ev.player.name].coins += 3;
              break;
            case "minecraft:egg":
              (() => {
                let p: number = props["noxcrew.ft:egg"] as number;
                if (p < 2) {
                  useItem(ev.player);
                  (props["noxcrew.ft:egg"] as number) += 1;
                }
              })();
              game.player_data[ev.player.name].coins += 3;
              break;
            case "minecraft:wheat":
              (() => {
                let p: number = props["noxcrew.ft:wheat"] as number;
                if (p < 2) {
                  useItem(ev.player);
                  (props["noxcrew.ft:wheat"] as number) += 1;
                }
              })();
              game.player_data[ev.player.name].coins += 3;
              break;
            case "noxcrew.ft:milk_bucket":
              (() => {
                let p: number = props["noxcrew.ft:milk_bucket"] as number;
                if (p < 2) {
                  useItem(ev.player);
                  (props["noxcrew.ft:milk_bucket"] as number) += 1;
                }
              })();
              game.player_data[ev.player.name].coins += 3;
              break;
          }
        }
      }
    });
  }
}

class Level4 extends GRLevel {
  id = 4;
  pos = { x: 2259.28, y: 62.2, z: 4255.88 };
  playerEnter(p: Player): void {
    sound.play(p, "room_complete", {});
  }
}

export class GridRunners extends ComplexGame {
  music: FTSounds = "music_gr";
  name: string = "grid_runners";
  player_data: Record<
    string,
    {
      coins: number;
      area: number;
      cakes: number;
      mobs: number;
      painted: number;
    }
  > = {};
  currentLevelId = 0;
  levels = [new Level0(this), new Level1(this), new Level2(this), new Level3(this), new Level4(this)];
  started: boolean = true;
  tick_timer = 0;
  timer_iid = 0;
  playSound(s: FTSounds) {
    forIn(this.players, (p) => {
      p.playSound(s);
    });
  }
  plans: Record<number, () => void> = {
    0: () => {
      forIn(this.players, (p) => {
        p.setGameMode(GameMode.Survival);
        showSubTitle(p, new Text().tr("txt.matchmaking.status.start.0"));
        p.onScreenDisplay.setActionBar(new Text().tr("txt.matchmaking.status.start.2", "4"));
      });
      start_blocks.forEach((b) => {
        fill(b, "minecraft:glass");
      });
      this.levels[0].closeDoor();
    },
    20: () => {
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.matchmaking.status.start.3", "3"));
        sound.play(p, "321", {});
      });
    },
    40: () => {
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.matchmaking.status.start.4", "2"));
        sound.play(p, "321", {});
      });
    },
    60: () => {
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.matchmaking.status.start.5", "1"));
        sound.play(p, "321", {});
      });
    },
    80: () => {
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.matchmaking.status.start.6"));
        sound.play(p, "go", {});
      });
      start_blocks.forEach((b) => {
        fill(b, "minecraft:air");
      });
      this.levels[1].closeDoor();
      this.levels[0].openDoor();
      world
        .getDimension("overworld")
        .getEntities({ tags: ["gr_mobs"] })
        .forEach((e) => e.remove());
      this.currentLevelId = 1;
      this.addPlan(() => {
        this.levels[1].tpAllPlayers();
        this.levels[0].closeDoor();
      }, 15 * TicksPerSecond);
    },
    1280: () => {
      this.currentLevelId = 2;
      world
        .getDimension("overworld")
        .getEntities({ tags: ["gr_mobs"] })
        .forEach((e) => e.remove());
      this.levels[1].openDoor();
      this.levels[2].closeDoor();
      this.levels[2].start();
      this.addPlan(() => {
        this.levels[2].tpAllPlayers();
        this.levels[1].closeDoor();
      }, 15 * TicksPerSecond);
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.grid.warning_hint"));
        p.getComponent("health")?.resetToMaxValue();
        p.runCommand("effect @s clear");
      });
    },
    2480: () => {
      this.currentLevelId = 3;
      this.levels[2].openDoor();
      this.levels[3].closeDoor();
      this.levels[3].start();
      world
        .getDimension("overworld")
        .getEntities({ type: "noxcrew.ft:paint_pot" })
        .forEach((e) => e.addEffect(MinecraftEffectTypes.Invisibility, 16 * TicksPerSecond, { showParticles: false }));
      this.addPlan(() => {
        this.levels[3].tpAllPlayers();
        this.levels[2].closeDoor();
      }, 15 * TicksPerSecond);
      forIn(this.players, (p) => {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.grid.warning_hint"));
        inventory.set(p, { 8: new ItemStack("noxcrew.ft:leave_game") });
      });
    },
    3680: () => {
      forIn(this.players, (p) => {
        showSubTitle(p, new Text().tr("txt.tut.grid4_title"));
        p.sendMessage(new Text().tr("txt.tut.grid4_text"));
        inventory.set(p, {
          8: new ItemStack("noxcrew.ft:leave_game"),
        });
      });
      world
        .getDimension("overworld")
        .getEntities({ tags: ["gr_animals"] })
        .forEach((e) => e.remove());
      this.levels[3].openDoor();
      this.currentLevelId = 4;
      this.addPlan(() => {
        this.levels[4].tpAllPlayers();
        this.levels[3].closeDoor();
      }, 15 * TicksPerSecond);
    },
  };
  addPlan(fn: () => void, timeout: number) {
    this.plans[this.tick_timer + timeout] = fn;
  }
  constructor() {
    super();
    world.afterEvents.entityDie.subscribe((ev) => {
      let player = ev.damageSource.damagingEntity as Player;
      if (player.typeId == "minecraft:player" && this.players[player.name]) {
        this.player_data[player.name].coins += 3;
        this.player_data[player.name].mobs += 1;
        world.getDimension("overworld").spawnParticle("noxcrew.ft:coin_burst_small", ev.deadEntity.location);
      }
    });
    system.runInterval(() => {
      forInAsync(this.players, (p, n) => {
        let data = this.player_data[n];
        this.levels[this.currentLevelId]?.loop(p);
      });
    });
    system.runInterval(() => {
      forInAsync(this.players, (p, n) => {
        let data = this.player_data[n];
        this.levels[this.currentLevelId]?.showGamebar(p);
      });
    });
    this.timer_iid = system.runInterval(() => {
      if (this.started) {
        try {
          this.plans[this.tick_timer]?.();
        } catch (e) {
          Logger.error(e);
        }
        this.tick_timer++;
      }
    });
    world.afterEvents.entitySpawn.subscribe((ev) => {
      let loc = ev.entity.location;
      if (ev.entity.typeId == "minecraft:tnt") {
        system.runTimeout(() => {
          if (ev.entity.isValid) ev.entity.remove();
          world.getDimension("overworld").createExplosion(loc, 20, { breaksBlocks: false });
        }, 81);
      }
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.gr:enter_gate") {
        let id = parseInt(ev.message);
        let data = this.player_data[(ev.sourceEntity as Player)?.name];
        if (data.area == id || !data) return;
        data.area = id;
        this.levels[id].playerEnter(ev.sourceEntity as Player);
      }
    });
    system.afterEvents.scriptEventReceive.subscribe((ev) => {
      if (ev.id == "mccr.gr:add_tick") {
        this.tick_timer += parseInt(ev.message);
      }
      if (ev.id == "mccr.gr:set_tick") {
        this.tick_timer = parseInt(ev.message);
      }
    });
  }
  start(): void {
    super.start();
    this.tick_timer = 0;
    this.currentLevelId = 0;
    Object.keys(this.players).forEach((name, index, arr) => {
      let player = this.players[name];
      this.player_data[name] = {
        coins: 0,
        area: 0,
        cakes: 0,
        painted: 0,
        mobs: 0,
      };
      player.onScreenDisplay.setActionBar(new Text().tr("txt.title.grid_runners"));
      this.levels[0].playerEnter(player);
      let startLoc = starts[index];
      player.teleport(startLoc, { facingLocation: Vector3Utils.add(startLoc, { x: 1, y: 0, z: 0 }) });
      for (let i = 0; i < 4; i++) {
        world.getDimension("overworld").spawnEntity("minecraft:tnt", Vector3Utils.add(startLoc, { x: -3, y: 0, z: 0 }));
        world.getDimension("overworld").spawnEntity("minecraft:tnt", Vector3Utils.add(startLoc, { x: -3, y: 0, z: 1 }));
        world
          .getDimension("overworld")
          .spawnEntity("minecraft:tnt", Vector3Utils.add(startLoc, { x: -3, y: 0, z: -1 }));
      }
    });
  }
  removePlayer(p: Player): void {
    p.setGameMode(GameMode.Adventure);
    super.removePlayer(p);
  }
  player_quit(p: Player, withItem?: boolean): void {
    if (withItem) p.teleport(coordinates.grid_runners);
    this.removePlayer(p);
  }
  player_finish(p: Player): void {
    if (this.players[p.name]) {
      let d = this.player_data[p.name];
      showGRCompleteToast(p, d.coins, d.mobs, d.painted, d.cakes);
      p.applyKnockback({ x: 4, z: 0 }, 0.5);
      challenges.gr.recordProgesss(p);
      super.player_finish(p);
    }
  }
  removePlayerByName(n: string): void {
    super.removePlayerByName(n);
    delete this.player_data[n];
  }
  end(): void {
    super.end();
    this.tick_timer = -100;
  }
}
export namespace GridRunners {
  export function getInstance() {
    return gameInstances.grid_runners;
  }
}

world.afterEvents.itemUse.subscribe((ev) => {
  let reg = /^noxcrew\.ft:paintbrush_?(.*)$/;
  if (reg.test(ev.itemStack.typeId)) {
    let matchRes = ev.itemStack.typeId.match(reg);
    if (!matchRes) return;
    if (matchRes[1] == "") return;
    let p = world.getDimension("overworld").spawnEntity("noxcrew.ft:paint_proj", ev.source.getHeadLocation());
    p.setProperty("noxcrew.ft:color", matchRes[1]);
    let component = p.getComponent("projectile") as EntityProjectileComponent;
    component.owner = ev.source;
    component.shoot(Vec3Utils.getProjectileMotion(ev.source, 2));
  }
});

world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
  if (
    ev.target.typeId == "noxcrew.ft:paint_pot" &&
    /noxcrew\.ft:paintbrush.*/.test(
      ev.player.getComponent("equippable")?.getEquipment(EquipmentSlot.Mainhand)?.typeId as string
    )
  ) {
    sound.play(ev.player, "paintpot", {});
    ev.player
      .getComponent("equippable")
      ?.setEquipment(
        EquipmentSlot.Mainhand,
        new ItemStack(
          "noxcrew.ft:paintbrush_" +
            ["black", "blue", "brown", "green", "purple", "red", "white", "yellow"][
              ev.target.getProperty("noxcrew:variant") as number
            ]
        )
      );
  }
});

world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
  if (ev.target.typeId == "minecraft:cow") {
    ev.cancel = true;
    if (ev.itemStack?.typeId == "minecraft:bucket") {
      system.run(() => {
        useItem(ev.player);
        ev.player.getComponent("inventory")?.container?.addItem(new ItemStack("noxcrew.ft:milk_bucket"));
      });
    }
  }
});

world.beforeEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack.typeId == "minecraft:egg") {
    ev.cancel = true;
  }
});

world.beforeEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.getGameMode() == GameMode.Survival) {
    if (!/wheat|reeds/.test(ev.block.typeId)) {
      ev.cancel = true;
    }

    if (/wheat/.test(ev.block.typeId)) {
      system.run(() => world.getDimension("overworld").spawnItem(new ItemStack("minecraft:wheat"), ev.block.center()));
    }
  }
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.id == "mccr.gr:return") {
    let p = ev.sourceEntity as Player;
    if (p.hasTag("returning")) return;
    p.addEffect("levitation", 3.2 * TicksPerSecond, { showParticles: false, amplifier: 5 });
    p.addTag("returning");
    p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
    system.runTimeout(() => {
      p.camera.fade({
        fadeColor: colors.black,
        fadeTime: {
          fadeInTime: 0.2,
          fadeOutTime: 0.2,
          holdTime: 1,
        },
      });
      system.runTimeout(() => {
        p.teleport(coordinates.grid_runners);
        p.removeTag("returning");
      }, 1.2 * TicksPerSecond);
      p.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
    }, 3 * TicksPerSecond);
  }
});
