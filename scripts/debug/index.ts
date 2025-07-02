import { Player, system, Vector3 } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { forIn } from "../utils";
import challenges from "./scripts/challenges";

export interface DebugScript<Return = any> {
  run: ((where: Vector3, player: Player) => Promise<Return>) | ((where: Vector3, player: Player) => Return);
  name: string;
}

export const debugScripts: Record<string, DebugScript> = {
  challenges,
};

export async function runDebugScript(s: DebugScript, p: Player) {
  try {
    let res = await s.run(p.location, p);

    system.run(() => {
      p.sendMessage({
        rawtext: [
          {
            text: `${s.name}的执行结果:\n成功\n`,
          },
          {
            text: `toString:${res}\n`,
          },
          {
            text: `JSON:${JSON.stringify(res)}`,
          },
        ],
      });
    });
  } catch (e) {
    system.run(() => {
      p.sendMessage(`${s.name}的执行结果:\n失败:${(e as Error).message}\n错误追踪：\n${(e as Error).stack}`);
    });
    return;
  }
}
export function debugScriptsDialog(p: Player) {
  let ad = new ActionFormData();
  ad.title("调试脚本");
  let btnMap: Record<number, () => void> = {};
  Object.values(debugScripts).forEach((s, i) => {
    btnMap[i] = () => {
      runDebugScript(s, p);
    };
    ad.button(s.name);
  });
  ad.show(p).then((r) => {
    if (!r.canceled) {
      btnMap[r.selection as number]();
    }
  });
}
