import { BlockPermutation } from "@minecraft/server";
import * as mc from "@minecraft/server";

declare module "@minecraft/vanilla-data" {
  export type BlockStateSuperset = Record<string, string | boolean | number>;
  export var MinecraftEntityTypes: Record<string, string> = {};
}
export {};
