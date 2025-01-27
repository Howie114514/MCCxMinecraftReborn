import { ItemLockMode, ItemStack, Player } from "@minecraft/server";
import { forIn } from "./utils";
import { Logger } from "./logger";
import { isReloaded } from "./main";

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

export namespace inventory {
  export function save(p: Player) {
    if (isReloaded) return;
    let inv = p.getComponent("inventory")?.container;
    if (inv) {
      let s = inv.size;
      let jsonInv: Record<string, JSONItem> = {};
      for (let i = 0; i < s; i++) {
        let a = inv.getItem(i);

        if (a) {
          jsonInv[i.toString()] = {
            lockMode: a.lockMode,
            amount: a.amount,
            id: a.typeId,
            nameTag: a.nameTag,
          };
        }
      }
      p.setDynamicProperty("mccr.lobby:inventory", JSON.stringify(jsonInv));
    }
    Logger.info(`保存${p.name}的物品栏成功！`);
  }
  export function set(
    p: Player,
    hb: Record<number, ItemStack | undefined | JSONItem>,
    { clearAll, lock }: SetHotbarOpt = { clearAll: true, lock: true }
  ) {
    if (clearAll) {
      p.getComponent("inventory")?.container?.clearAll();
    }
    forIn(hb, (i, index) => {
      let is;
      if (i) {
        if ((i as ItemStack).maxAmount) {
          is = i as ItemStack;
        } else {
          is = new ItemStack((i as JSONItem).id);
          is.amount = (i as JSONItem).amount;
          is.nameTag = (i as JSONItem).nameTag;
          is.lockMode = (i as JSONItem).lockMode;
        }
        if (lock) {
          is.lockMode = ItemLockMode.slot;
        }
      }
      p.getComponent("inventory")?.container?.setItem(parseInt(index), is);
    });
    Logger.info(`设置${p.name}的物品栏成功！`, JSON.stringify(hb));
  }
  export function hasItem(p: Player, id: string) {
    let inv = p.getComponent("inventory");
    let res = [];
    for (let slot = 0; slot < (inv?.container?.size ?? 0); slot++) {
      if (inv?.container?.getSlot(slot).getItem()?.typeId == id) return true;
    }
    return false;
  }
}
