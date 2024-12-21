import { ComplexGame } from "../game";
import { FTSounds } from "../sound";
import { Text } from "../text";
import { forIn } from "../utils";

export class GridRunners extends ComplexGame {
  music: FTSounds = "music_gr";
  constructor() {
    super();
  }
  start(): void {
    super.start();
    forIn(this.players, (p, n) => {
      if (p) {
        p.onScreenDisplay.setActionBar(new Text().tr("txt.title.grid_runners"));
      }
    });
  }
}
