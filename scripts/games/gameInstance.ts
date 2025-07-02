import { BasicGame, ComplexGame, Lobby } from "../game";
import { AceRace } from "./ace_race";
import { GridRunners } from "./grid_runners";
import { Meltdown } from "./meltdown";
import { SandsOfTime } from "./sot";

export const gameInstances: {
  lobby: Lobby;
  ace_race: AceRace;
  sot: SandsOfTime;
  meltdown: Meltdown;
  grid_runners: GridRunners;
} & { [P in string]: ComplexGame | BasicGame } = {
  lobby: new Lobby(),
  ace_race: new AceRace(),
  sot: new SandsOfTime(),
  meltdown: new Meltdown(),
  grid_runners: new GridRunners(),
};
