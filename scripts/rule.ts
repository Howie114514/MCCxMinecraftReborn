import { Player, system, TicksPerSecond, world } from "@minecraft/server";
import { Logger } from "./logger";
import { runAfterStartup } from "./utils";

export var rules: Record<string, string | number> = {
  md_min_players: 4,
  md_default_time: 105 * TicksPerSecond,
};

runAfterStartup(() => {
  try {
    Object.assign(rules, JSON.parse((world.getDynamicProperty("mccr:rules") as string) ?? "{}"));
  } catch (e) {
    Logger.warn("在加载规则集时发生错误");
    world.setDynamicProperty("mccr:rules", "{}");
  }
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  let sender = ev.sourceEntity as Player;
  if (ev.id == "mccr:set_rule") {
    let msg: string[] = ev.message.split(":");
    if (msg.length == 2) {
      if (rules[msg[0]]) {
        if (typeof rules[msg[0]] == "number") {
          let res = parseFloat(msg[1]);
          if (res != res) {
            sender.sendMessage("\u00a74错误的数字格式");
            return;
          }
          rules[msg[0]] = res;
        } else {
          rules[msg[0]] = msg[1];
        }
        world.setDynamicProperty("mccr:rules", JSON.stringify(rules));
        sender.sendMessage(`已将规则${msg[0]}设为${msg[1]}`);
      } else {
        sender.sendMessage("\u00a74无效的规则");
      }
    } else {
      sender.sendMessage("\u00a74格式必须为[规则]:[数字/字符串]");
    }
  }
  if (ev.id == "mccr:list_rules") {
    sender.sendMessage(`目前服务器的规则如下：\n${JSON.stringify(rules, undefined, 2)}`);
  }
  if (ev.id == "mccr:reset_rules") {
    world.setDynamicProperty("mccr:rules");
    rules = {
      md_min_players: 4,
      md_default_time: 105 * TicksPerSecond,
    };
    world.setDynamicProperty("mccr:rules", JSON.stringify(rules));
    sender.sendMessage(`已重置服务器规则为默认值`);
  }
});
