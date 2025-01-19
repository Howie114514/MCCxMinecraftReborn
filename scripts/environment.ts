import { world } from "@minecraft/server";
import { overworld } from "./constants";
import { Logger } from "./logger";
import { isDevMode } from "./buildInfo";

export enum envTypes {
  vanilla = "vanilla",
  LeviLamina = "LeviLamina",
  LevilaminaWithPlugin = "LeviLaminaWithPlugin",
}

var environment = envTypes.vanilla;

world.afterEvents.worldInitialize.subscribe(() => {
  try {
    overworld.runCommand("ll list");
    environment = envTypes.LeviLamina;
    overworld.runCommand("mccr detect");
    environment = envTypes.LevilaminaWithPlugin;
  } catch (e) {}
  Logger.info("======环境信息======");
  Logger.info("环境类型:", environment);
  Logger.info("开发者模式:", isDevMode);
  if (environment == envTypes.LeviLamina) {
    Logger.warn("检测到当前正在使用插件服务端，建议安装相应插件以实现更好的功能");
    Logger.warn("支持的插件端：Levilamina");
  }
});

export default environment;
