import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import flags from "../flags";
import tr, { itemName } from "../lang";

export const cosmetic_chest = (hats: string[]) => {
  let ad = new ActionFormData()
    .title({ rawtext: [{ translate: "txt.title.cosmetic" }, { text: flags.flag_cosmetic_modal }] })
    .body(tr("txt.ui.cosmetic"))
    .button(tr("txt.button.remove_hat"));
  //.show(ev.source);
  let addItem = (id: string) => {
    ad.button(itemName(id), `textures/items/hub/${id.replace(/noxcrew\.ft:/, "")}`);
  };
  hats.forEach((h) => {
    addItem(h);
  });
  return ad;
};

export const vendor_mascot = () => {
  let ad = new ActionFormData().title({
    rawtext: [{ translate: "txt.title.vendor_mascot" }, { text: flags.flag_vendor_modal }],
  });
  //.show(ev.source);
  let addItem = (color: string) => {
    let id = "noxcrew.ft:beanie_" + color;
    let ina = itemName(id);
    ina.rawtext?.push({ text: "\n\ue17b250" });
    ad.button(ina, `textures/items/hub/${id.replace(/noxcrew\.ft:/, "")}`);
  };
  addItem("aqua");
  addItem("blue");
  addItem("cyan");
  addItem("green");
  addItem("lime");
  addItem("orange");
  addItem("pink");
  addItem("purple");
  addItem("red");
  addItem("yellow");
  return ad;
};

export const vendor_hat = (hats: string[]) => {
  let ad = new ActionFormData().title({
    rawtext: [{ translate: "txt.title.vendor_hat" }, { text: flags.flag_vendor_modal }],
  });
  //.show(ev.source);
  let addItem = (id: string) => {
    ad.button(itemName(id), `textures/items/hub/${id.replace(/noxcrew\.ft:/, "")}`);
  };
  hats.forEach((h) => {
    addItem(h);
  });
  return ad;
};

export const vendor_food = (f: string[], price: number[]) => {
  let ad = new ActionFormData().title({
    rawtext: [{ translate: "txt.title.vendor_food" }, { text: flags.flag_vendor_modal }],
  });
  //.show(ev.source);
  let addItem = (id: string, p: number) => {
    let ina = itemName(id);
    ina.rawtext?.push({ text: "\n\ue17b" + p.toString() });
    ad.button(ina, `textures/items/hub/${id.replace(/noxcrew\.ft:/, "")}`);
  };
  f.forEach((food, i) => {
    addItem(food, price[i]);
  });
  return ad;
};

export const confirm = async (msg: string, title: string = " ") => {
  let md = new MessageFormData();
};

export const vendor_toys = (t: string[], price: number[]) => {
  let ad = new ActionFormData().title({
    rawtext: [{ translate: "txt.title.vendor_toy" }, { text: flags.flag_vendor_modal }],
  });
  //.show(ev.source);
  let addItem = (id: string, p: number) => {
    let ina = itemName(id);
    ina.rawtext?.push({ text: "\n\ue17b" + p.toString() });
    ad.button(ina, `textures/items/hub/${id.replace(/noxcrew\.ft:/, "")}`);
  };
  t.forEach((toy, i) => {
    addItem(toy, price[i]);
  });
  return ad;
};

export const info = () => {
  return new ActionFormData()
    .title("信息")
    .body(
      `===§lMCCxMinecraft §eReborn§r===
MCCxMinecraft活动服务器地图的社区还原版:一个以GPLv3为协议的开源项目

主要作者：HowieMC(https://github.com/Howie114514)
本项目的贡献者：
- §lNoxcrew及Mojang - 为玩家打造令人惊叹的地图§r
- mc火燃 - 代码及音效修复
- 一只呱呱捏 - 使用本项目的地图开服务器，使本项目获得大量有效的反馈
- 每一位向作者提出建议的朋友们

注意：本项目§l并非§rMojang、Microsoft或Noxcrew的项目。

Commit ID :${BUILD_ID}
版本 :1.0.0-beta
`
    )
    .button("好的");
};
