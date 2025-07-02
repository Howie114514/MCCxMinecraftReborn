import { system, world } from "@minecraft/server";
import { Logger } from "./logger";
import { plugin } from "./plugin";
import { runAfterStartup } from "./utils";

export enum envTypes {
  vanilla = "vanilla",
  LeviLamina = "LeviLamina",
  LevilaminaWithPlugin = "LeviLaminaWithPlugin",
}

var environment = { type: envTypes.vanilla };

runAfterStartup(() => {
  try {
    world.getDimension("overworld").runCommand(`mccr detect`);
    environment.type = envTypes.LevilaminaWithPlugin;
  } catch (e) {
    Logger.info(e);
  }
  Logger.info("======环境信息======");
  Logger.info("环境类型:", environment.type);
  Logger.info("开发者模式:", isDevMode);
  Logger.info("Commit ID:", BUILD_ID);
  if (environment.type == envTypes.LeviLamina) {
    Logger.warn("检测到当前正在使用插件服务端，建议安装相应插件以实现更好的功能");
    Logger.warn("支持的插件端：Levilamina");
  }
  if (environment.type == envTypes.LevilaminaWithPlugin) {
    plugin.tryConnect();
  }
});

export default environment;
