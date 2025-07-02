import { rmSync } from "fs";
import { join } from "path";

rmSync(join(import.meta.dirname, "../node_modules/@minecraft/server-ui/node_modules"), {
  recursive: true,
  force: true,
});
