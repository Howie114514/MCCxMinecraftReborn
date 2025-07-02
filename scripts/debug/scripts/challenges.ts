import { DebugScript } from "..";
import { challenges } from "../../challenges";
import { forIn } from "../../utils";

export default {
  name: "challenges",
  run(loc, p) {
    forIn(challenges, (c) => {
      c.onFinish(p);
    });
  },
} as DebugScript;
