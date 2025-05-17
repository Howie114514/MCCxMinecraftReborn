import { system, world } from "@minecraft/server";
import { Logger } from "./logger";

export namespace plugin {
  export enum BPMsgTypes {
    connect = 0x01,
    set_time = 0x02,
    set_property = 0x03,
    spawn_particle = 0x04,
  }
  export enum ResponseMsgTypes {
    success = 0x01,
    error = 0x02,
  }
  export interface PluginMessage {
    type: ResponseMsgTypes | BPMsgTypes;
    id: string;
    [x: string]: any;
  }
  export const pluginVersion = "1.0.0-beta";
  export function send<T extends { type: BPMsgTypes }>(data: T): Promise<PluginMessage> {
    return new Promise((resolve, reject) => {
      let id = Math.random().toString(32).slice(2);
      let l = system.afterEvents.scriptEventReceive.subscribe((e) => {
        try {
          let d: PluginMessage = JSON.parse(e.message);
          if (e.id == "mccr.plugin:communicate" && d.id == id) {
            system.afterEvents.scriptEventReceive.unsubscribe(l);
            resolve(d);
          }
        } catch (e) {}
      });
      try {
        world.getDimension("overworld").runCommand(`mccrc ${JSON.stringify(Object.assign({ id }, data))}`);
      } catch (e) {
        system.afterEvents.scriptEventReceive.unsubscribe(l);
      }
    });
  }
  export async function tryConnect() {
    let res = await send({ type: BPMsgTypes.connect });
    if (res.type == ResponseMsgTypes.success && res.version == pluginVersion) {
      Logger.info("检测Levilamina插件成功！版本：", res.version);
    }
  }
}
