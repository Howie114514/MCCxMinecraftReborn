import { DebugScript } from "..";
import { challenges } from "../../challenges";
import { forIn } from "../../utils";

export default {
  name: "challenges",
  run(loc, p) {
    forIn(challenges, (c) => {
      if (!c.withProgress) c.recordProgesss(p);
      else c.recordProgesss(p, c.maxProgress);
    });
  },
} as DebugScript;
