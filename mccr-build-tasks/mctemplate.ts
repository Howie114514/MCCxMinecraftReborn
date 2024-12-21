import { copyFiles, zipTask } from "@minecraft/core-build-tasks";
import path from "node:path";
import { task } from "just-scripts";
import { execSync } from "child_process";

const worldName = "zryhdIMXSHQ=";
const worldPath = path.join(
  process.env["localappdata"] ?? "",
  "/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/minecraftWorlds",
  worldName
);
export default function () {
  copyFiles([worldPath, "./world_template"], "./dist/mctemplate");
  copyFiles(
    [
      path.join(
        process.env["localappdata"] ?? "",
        "/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_behavior_packs/mccr"
      ),
    ],
    "./dist/mctemplate/behavior_packs/mccr"
  );
  copyFiles(
    [
      path.join(
        process.env["localappdata"] ?? "",
        "/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang/development_resource_packs/mccr"
      ),
    ],
    "./dist/mctemplate/resource_packs/mccr"
  );
  copyFiles(["./dist/scripts"], "./dist/mctemplate/behavior_packs/mccr/scripts");
}
