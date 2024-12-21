import {
  BlockComponentPlayerInteractEvent,
  BlockComponentStepOnEvent,
  BlockCustomComponent,
  EquipmentSlot,
  ItemComponentUseEvent,
  ItemComponentUseOnEvent,
  ItemCustomComponent,
  ItemLockMode,
  system,
  TicksPerSecond,
  world,
} from "@minecraft/server";
import { sound } from "./sound";

class n_button implements BlockCustomComponent {
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
class recycling_bin implements BlockCustomComponent {
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
class bench implements BlockCustomComponent {
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
  constructor() {}
  onUse(arg: ItemComponentUseEvent) {}
  onUseOn(arg: any) {}
}

export const blockCompoents = {
  n_button: new n_button(),
  recycling_bin: new recycling_bin(),
  bench: new bench(),
  interactive: new Interactive(),
};
export const itemCompoents = {
  interactive_item: new InteractiveItem(),
};
