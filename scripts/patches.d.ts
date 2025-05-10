import { BlockPermutation } from "@minecraft/server";

declare module "@minecraft/vanilla-data" {
  export type BlockStateSuperset = Record<string, string | boolean | number>;
}
export {};
