import {
  BlockComponentPlayerInteractEvent,
  BlockComponentStepOffEvent,
  BlockComponentStepOnEvent,
  BlockComponentTickEvent,
  BlockCustomComponent,
  CustomComponentParameters,
  EquipmentSlot,
  ItemComponentUseEvent,
  ItemComponentUseOnEvent,
  ItemCustomComponent,
  ItemLockMode,
  Player,
  system,
  TicksPerSecond,
  Vector3,
  world,
} from "@minecraft/server";
import { sound } from "./sound";
import { MinecraftEffectTypes } from "@minecraft/vanilla-data";
import { Vec3Utils } from "./math";
import { asPlayer } from "./utils";
import { gameInstances } from "./games/gameInstance";
import { playerSessionData } from "./data";
import { Vector3Builder, Vector3Utils } from "./minecraft/math";

class NButton implements BlockCustomComponent {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract(ev: BlockComponentPlayerInteractEvent) {
    if (!ev.block.permutation.getState("noxcrew:pushed")) {
      ev.block.dimension.playSound("noxcrew", ev.block.location);
      ev.block.setPermutation(ev.block.permutation.withState("noxcrew:pushed", true));
      system.runTimeout(() => {
        ev.block.setPermutation(ev.block.permutation.withState("noxcrew:pushed", false));
      }, TicksPerSecond * 1);
    }
  }
}
class RecyclingBin implements BlockCustomComponent {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract(ev: BlockComponentPlayerInteractEvent) {
    let c = ev.player?.getComponent("equippable");
    if (c?.getEquipment(EquipmentSlot.Mainhand)?.lockMode == ItemLockMode.none) {
      system.run(() => c?.setEquipment(EquipmentSlot.Mainhand));
      sound.play(ev.dimension, "trash", { location: ev.block.location });
    }
  }
}
class Bench implements BlockCustomComponent {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract(ev: BlockComponentPlayerInteractEvent) {
    if (
      ev.block.dimension.getEntitiesAtBlockLocation(ev.block).filter((e) => e.typeId == "noxcrew.ft:seat").length == 0
    ) {
      let r = ev.block.dimension.spawnEntity("noxcrew.ft:seat", ev.block.center());
      if (ev.player) r.getComponent("rideable")?.addRider(ev.player);
    }
  }
}
class Interactive implements BlockCustomComponent {
  constructor() {
    this.onPlayerInteract = this.onPlayerInteract.bind(this);
  }
  onPlayerInteract(arg: BlockComponentPlayerInteractEvent): void {}
}

class InteractiveItem implements ItemCustomComponent {
  constructor() {
    this.onUse = this.onUse.bind(this);
    this.onUseOn = this.onUseOn.bind(this);
  }
  onUse(arg: ItemComponentUseEvent) {}
  onUseOn(arg: any) {}
}

class Boost implements BlockCustomComponent {
  constructor() {
    this.onStepOn = this.onStepOn.bind(this);
  }
  onStepOn(ev: BlockComponentStepOnEvent) {
    let player = asPlayer(ev.entity);
    if (!player) return;
    if (gameInstances.ace_race.players[player.name]) {
      gameInstances.ace_race.stats[player.name].launchPad++;
    }
    sound.play(player, "launch", {});
    player.runCommand("function mccr/boost");
    system.runTimeout(() => {
      try {
        player.removeEffect("levitation");
      } catch (e) {}
    }, 6);
  }
}

class SpeedPad implements BlockCustomComponent {
  constructor() {
    this.onStepOn = this.onStepOn.bind(this);
  }
  onStepOn(ev: BlockComponentStepOnEvent, _: CustomComponentParameters) {
    let p = asPlayer(ev.entity);
    if (!p) return;
    if (gameInstances.ace_race.players[p.name]) {
      let sd = playerSessionData[p.name];
      if (!sd.onSpeedPad) {
        gameInstances.ace_race.stats[p.name].speed++;
        console.log("speed++");
        sd.onSpeedPad = true;
      }
    }
  }
  onStepOff(ev: BlockComponentStepOffEvent, arg1: CustomComponentParameters) {
    let p = asPlayer(ev.entity);
    if (!p) return;
    let sd = playerSessionData[p.name];
    system.runTimeout(() => {
      if (!(p.dimension.getBlockBelow(p.location)?.typeId == "noxcrew.ft:speed_pad")) {
        sd.onSpeedPad = false;
      }
    }, 5);
  }
}

export const blockCompoents = {
  n_button: new NButton(),
  recycling_bin: new RecyclingBin(),
  bench: new Bench(),
  interactive: new Interactive(),
  boost: new Boost(),
  speed_pad: new SpeedPad(),
};
export const itemCompoents = {
  interactive_item: new InteractiveItem(),
};
