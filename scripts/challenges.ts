import { Player, system } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, FormCancelationReason, uiManager } from "@minecraft/server-ui";
import { Text } from "./text";
import flags from "./flags";
import { Logger } from "./logger";
import { sound } from "./sound";
import { PlayerRecord } from "./types";
import { Queue } from "./queue";

export type Challenges =
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "cyan"
  | "aqua"
  | "blue"
  | "purple"
  | "pink"
  | "gr"
  | "sot"
  | "md"
  | "ar"
  | "challenge";

export const challengeColors: Challenges[] = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "cyan",
  "aqua",
  "blue",
  "purple",
  "pink",
  "gr",
  "sot",
  "md",
  "ar",
  "challenge",
];

interface ChallengeInfo {
  finished: boolean;
  progress: number;
}

const playerFormLock: PlayerRecord<boolean> = {};

class Challenge {
  id = 0;
  color: Challenges = "red";
  animal: string = "rabbit";
  maxProgress = 1;
  withProgress = true;
  default: ChallengeInfo = {
    finished: false,
    progress: 0,
  };
  constructor() {}
  getPlayerChallengeData(p: Player): ChallengeInfo {
    return JSON.parse((p.getDynamicProperty("mccr:challenge_data") as string) ?? "null")?.[this.color] ?? this.default;
  }
  setPlayerChallengeData(p: Player, d: ChallengeInfo) {
    let o: Record<Challenges, ChallengeInfo> = JSON.parse(
      (p.getDynamicProperty("mccr:challenge_data") as string) ?? "{}"
    );
    o[this.color] = d;
    p.setDynamicProperty("mccr:challenge_data", JSON.stringify(o));
  }
  updatePlayerChallengeData(p: Player, obj: Partial<ChallengeInfo>) {
    let o = this.getPlayerChallengeData(p);
    this.setPlayerChallengeData(p, Object.assign(o, obj));
  }
  toString(): string {
    return this.color + "_" + this.animal;
  }
  composeInfoUI(p: Player) {
    let ad = new ActionFormData();
    let data = this.getPlayerChallengeData(p);
    let s = this.toString();
    ad.title(new Text().tr("txt.ui.title.challenge_list").txt(flags.flag_challenge_info_modal))
      .body(
        new Text().tr(`txt.ui.progress.${this.toString()}_challenge`, this.withProgress ? data.progress.toString() : "")
      )
      .button(
        new Text()
          .tr(`txt.ui.title.${s}_challenge`)
          .txt(flags.image_flag + flags.title_flag + (data.finished ? "" : flags.locked)),
        "textures/ui/n/i_info/" + this.color + (data.finished ? "" : "_locked")
      )
      .button(
        new Text()
          .tr(`txt.ui.body1.${s}_challenge`)
          .txt("\n")
          .tr(`txt.ui.reward.${s}_challenge`)
          .txt(flags.image_flag + flags.content_flag + (data.finished ? "" : flags.locked)),
        "textures/ui/n/i_reward/" + this.color + (data.finished ? "" : "_locked")
      );
    return ad;
  }
  checkCape(p: Player) {
    let data = JSON.parse((p.getDynamicProperty("mccr:challenge_data") as string) ?? "{}");
    let finishedCount = 0;
    (Object.values(data) as { finished: boolean }[]).forEach((i: { finished: boolean }) => {
      if (i) finishedCount++;
    });
    console.log(finishedCount);
    if (finishedCount == 15) {
      console.log("cape");
      sound.play(p, "cape_reward", {});
      let ad = new ActionFormData()
        .title(new Text().tr("txt.ui.title.reward_unlocked").txt(flags.flag_unlock_screen))
        .button(new Text().tr("txt.ui.text.reward_unlocked").txt(flags.image_flag), "textures/ui/n/i_reward/cape")
        .button(new Text().tr("txt.ui.button.claim"));
      ad.show(p);
    }
  }
  onFinish(p: Player) {
    sound.play(p, "challenge_complete", {});
    system.runTimeout(() => {
      sound.play(p, "reward_recieve", {});
      let ad = new ActionFormData()
        .title(new Text().tr("txt.ui.title.reward_unlocked").txt(flags.flag_unlock_screen))
        .button(
          new Text().tr("txt.ui.text.reward_unlocked").txt(flags.image_flag),
          "textures/ui/n/i_reward/" + this.color
        )
        .button(new Text().tr("txt.ui.button.claim"));
      ad.show(p).then(() => {
        sound.play(p, "reward_claim", {});
        this.checkCape(p);
      });
    }, 40);
  }
  recordProgesss(pl: Player, p?: number) {
    let data: ChallengeInfo = this.getPlayerChallengeData(pl);
    if (data.finished) return;
    if (p != undefined && this.withProgress) {
      data.progress += p;
      if (data.progress >= this.maxProgress) {
        data.finished = true;
      }
    } else {
      data.finished = true;
    }
    if (data.finished) this.onFinish(pl);
    this.setPlayerChallengeData(pl, data);
  }
  reset(p: Player) {
    this.setPlayerChallengeData(p, { progress: 0, finished: false });
  }
}

class RedRabbit extends Challenge {
  id = 0;
  color: Challenges = "red";
  animal: string = "rabbit";
  maxProgress: number = 50;
}

class OrangeOcelot extends Challenge {
  id = 1;
  color: Challenges = "orange";
  animal: string = "ocelot";
  maxProgress: number = 100;
}

class YellowYak extends Challenge {
  id = 2;
  color: Challenges = "yellow";
  animal: string = "yak";
  maxProgress: number = 350;
}

class LimeLlama extends Challenge {
  id = 3;
  color: Challenges = "lime";
  animal: string = "llama";
  maxProgress: number = 10;
}

class GreenGecko extends Challenge {
  id = 4;
  animal: string = "gecko";
  color: Challenges = "green";
  maxProgress: number = 10;
}

class CyanCoyote extends Challenge {
  id = 5;
  animal: string = "coyote";
  color: Challenges = "cyan";
  maxProgress: number = 75;
}

class AquaAxolotl extends Challenge {
  id = 6;
  animal: string = "axolotl";
  color: Challenges = "aqua";
  withProgress: boolean = false;
}

class BlueBat extends Challenge {
  id = 7;
  animal: string = "bat";
  color: Challenges = "blue";
  maxProgress: number = 100;
}

class PurplePanda extends Challenge {
  id = 8;
  animal: string = "panda";
  color: Challenges = "purple";
  maxProgress: number = 200;
}

class PinkParrot extends Challenge {
  id = 9;
  animal: string = "parrot";
  maxProgress: number = 25;
  color: Challenges = "pink";
}

class GridRunnersChallenge extends Challenge {
  id = 10;
  color: Challenges = "gr";
  animal: string = "gr";
  withProgress: boolean = false;
  toString = () => "grid_runners";
}

class SOTChallenge extends Challenge {
  id = 11;
  color: Challenges = "sot";
  animal: string = "sot";
  withProgress: boolean = false;
  toString = () => "sot";
}

class MeltdownChallenge extends Challenge {
  id = 12;
  color: Challenges = "md";
  animal: string = "md";
  withProgress: boolean = false;
  toString = () => "meltdown";
}

class ARChallenge extends Challenge {
  id = 13;
  color: Challenges = "ar";
  animal: string = "ar";
  withProgress: boolean = false;
  toString = () => "ace_race";
}

class MysteryCave extends Challenge {
  id = 14;
  color: Challenges = "challenge";
  animal: string = "cave";
  maxProgress: number = 7;
  toString = () => "cave";
  composeInfoUI(p: Player) {
    let ad = new ActionFormData();
    let data = this.getPlayerChallengeData(p);
    let s = this.toString();
    ad.title(new Text().tr("txt.ui.title.challenge_list").txt(flags.flag_challenge_info_modal))
      .body(
        new Text().tr(`txt.ui.progress.${this.toString()}_challenge`, this.withProgress ? data.progress.toString() : "")
      )
      .button(
        new Text()
          .tr(`txt.ui.title.${s}_challenge`)
          .txt(flags.image_flag + flags.title_flag + (data.finished ? "" : flags.locked)),
        "textures/ui/n/i_info/challenge" + (data.finished ? "" : "_locked")
      )
      .button(
        new Text()
          .tr(`txt.ui.body1.${s}_challenge`)
          .txt("\n")
          .tr(`txt.ui.reward.${s}_challenge`)
          .txt(flags.image_flag + flags.content_flag + (data.finished ? "" : flags.locked)),
        "textures/ui/n/i_reward/crown" + (data.finished ? "" : "_locked")
      );
    return ad;
  }

  onFinish(p: Player) {
    sound.play(p, "challenge_complete", {});
    system.runTimeout(() => {
      sound.play(p, "reward_recieve", {});
      let ad = new ActionFormData()
        .title(new Text().tr("txt.ui.title.reward_unlocked").txt(flags.flag_unlock_screen))
        .button(new Text().tr("txt.ui.text.reward_unlocked").txt(flags.image_flag), "textures/ui/n/i_reward/crown")
        .button(new Text().tr("txt.ui.button.claim"));
      ad.show(p).then(() => {
        sound.play(p, "reward_claim", {});
        this.checkCape(p);
      });
    }, 40);
  }
}

export const challenges: Record<Challenges, Challenge> & { [P in string]: Challenge } = {
  red: new RedRabbit(),
  orange: new OrangeOcelot(),
  yellow: new YellowYak(),
  lime: new LimeLlama(),
  green: new GreenGecko(),
  cyan: new CyanCoyote(),
  aqua: new AquaAxolotl(),
  blue: new BlueBat(),
  purple: new PurplePanda(),
  pink: new PinkParrot(),
  gr: new GridRunnersChallenge(),
  sot: new SOTChallenge(),
  md: new MeltdownChallenge(),
  ar: new ARChallenge(),
  challenge: new MysteryCave(),
};

system.afterEvents.scriptEventReceive.subscribe((ev) => {
  if (ev.sourceEntity) {
    if (ev.id == "mccr.c:record") {
      let [c, n] = ev.message.split(";");
      challenges[c]?.recordProgesss(ev.sourceEntity as Player, parseInt(n));
    } else if (ev.id == "mccr.c:reset") {
      challenges[ev.message]?.reset(ev.sourceEntity as Player);
    }
  }
});
