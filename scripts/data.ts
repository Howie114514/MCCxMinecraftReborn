import { Player, Vector3 } from "@minecraft/server";

export type PlayerSessionData = {
  onSpeedPad?: boolean;
};
export const playerSessionData: Record<string, PlayerSessionData> = {};
