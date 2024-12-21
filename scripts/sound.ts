import { Dimension, Player, PlayerSoundOptions, Vector3, WorldSoundOptions } from "@minecraft/server";

export type FTSoundDefinitions = {
  "321": {
    category: "ui";
    sounds: ["sounds/general/321"];
  };
  noxcrew: {
    category: "ui";
    sounds: ["sounds/noxcrew"];
  };
  "jagnes.1_0.dia1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia4": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia4";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia5": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia5";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia6": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia6";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia6_1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia6_1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0.dia6_2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0.dia6_2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.1_0": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.1_0";
        volume: 2.1;
      }
    ];
  };
  "jagnes.2_0": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.2_0";
        volume: 2.1;
      }
    ];
  };
  "jagnes.2_1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.2_1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.3_0": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.3_0";
        volume: 2.1;
      }
    ];
  };
  "jagnes.4_0": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.4_0";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_ace_race_portal1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_ace_race_portal1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_ace_race_portal2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_ace_race_portal2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_ace_race_portal3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_ace_race_portal3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_activity1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_activity1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_activity2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_activity2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_cave1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_cave1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_cave2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_cave2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_grid_runners_portal1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_grid_runners_portal1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_grid_runners_portal2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_grid_runners_portal2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_grid_runners_portal3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_grid_runners_portal3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_meltdown_portal1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_meltdown_portal1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_meltdown_portal2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_meltdown_portal2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_meltdown_portal3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_meltdown_portal3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_portal1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_portal1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_portal2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_portal2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_portal3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_portal3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_shop1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_shop1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_shop2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_shop2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_sot_portal1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_sot_portal1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_sot_portal2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_sot_portal2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_sot_portal3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_sot_portal3";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_trophy1": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_trophy1";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_trophy2": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_trophy2";
        volume: 2.1;
      }
    ];
  };
  "jagnes.help_trophy3": {
    category: "ui";
    sounds: [
      {
        name: "sounds/dialogue/jagnes.help_trophy3";
        volume: 2.1;
      }
    ];
  };
  "creator_ace.1_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.1_0"];
  };
  "creator_ace.2_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.2_0"];
  };
  "creator_ace.3_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_0"];
  };
  "creator_ace.3_1": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_1"];
  };
  "creator_ace.3_2": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_2"];
  };
  "creator_ace.3_3": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_3"];
  };
  "creator_ace.3_4": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_4"];
  };
  "creator_ace.3_5": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_ace.3_5"];
  };
  "creator_grid.1_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.1_0"];
  };
  "creator_grid.2_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.2_0"];
  };
  "creator_grid.3_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.3_0"];
  };
  "creator_grid.3_1": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.3_1"];
  };
  "creator_grid.3_2": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.3_2"];
  };
  "creator_grid.3_3": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.3_3"];
  };
  "creator_grid.3_4": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.3_4"];
  };
  "creator_grid.4_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_grid.4_0"];
  };
  "creator_melt.1_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.1_0"];
  };
  "creator_melt.2_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.2_0"];
  };
  "creator_melt.3_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_0"];
  };
  "creator_melt.3_1": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_1"];
  };
  "creator_melt.3_2": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_2"];
  };
  "creator_melt.3_3": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_3"];
  };
  "creator_melt.3_4": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_4"];
  };
  "creator_melt.3_5": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_melt.3_5"];
  };
  "creator_sands.1_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.1_0"];
  };
  "creator_sands.2_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.2_0"];
  };
  "creator_sands.3_0": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_0"];
  };
  "creator_sands.3_1": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_1"];
  };
  "creator_sands.3_2": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_2"];
  };
  "creator_sands.3_3": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_3"];
  };
  "creator_sands.3_4": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_4"];
  };
  "creator_sands.3_5": {
    category: "ui";
    max_distance: 15.001;
    sounds: ["sounds/dialogue/creator_sands.3_5"];
  };
  agnes_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/agnes_special1"];
  };
  agnes_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/agnes_special2"];
  };
  frog_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_special1"];
  };
  frog_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_special2"];
  };
  frog_special3: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_special3"];
  };
  frog_special4: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_special4"];
  };
  frog_transform1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_transform1"];
  };
  frog_transform2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/frog_transform2"];
  };
  hannah_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/hannah_special1"];
  };
  hannah_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/hannah_special2"];
  };
  hbomb_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/hbomb_special1"];
  };
  hbomb_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/hbomb_special2"];
  };
  jens_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/jens_special1"];
  };
  jens_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/jens_special2"];
  };
  seapeekay_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/seapeekay_special1"];
  };
  seapeekay_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/seapeekay_special2"];
  };
  smajor_special1: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/smajor_special1"];
  };
  smajor_special2: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/smajor_special2"];
  };
  vendor_food: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/vendor_food"];
  };
  vendor_hat: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/vendor_hat"];
  };
  vendor_mascot: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/vendor_mascot"];
  };
  vendor_toys: {
    category: "neutral";
    max_distance: 8.001;
    sounds: ["sounds/npcs/vendor_toys"];
  };
  ball_hit: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/ball_hit"];
  };
  ball_pop: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/ball_pop"];
  };
  balloon_helium: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/balloon_helium"];
  };
  disco_ball_idle: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/disco_ball_idle"];
  };
  disco_ball_spawn: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/disco_ball_spawn"];
  };
  disco_ball_music: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/hub/music/disco_ball_music";
        stream: true;
        volume: 1.5;
      }
    ];
  };
  eye: {
    category: "neutral";
    max_distance: 8.001;
    sounds: [
      {
        name: "sounds/hub/eye1";
        volume: 1;
      },
      {
        name: "sounds/hub/eye2";
        volume: 1;
      },
      {
        name: "sounds/hub/eye3";
        volume: 1;
      }
    ];
  };
  hieroglyphics_complete: {
    category: "ui";
    sounds: ["sounds/hub/hieroglyphics_complete"];
  };
  hieroglyphics_solve: {
    category: "ui";
    sounds: ["sounds/hub/hieroglyphics_solve"];
  };
  squeak: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/squeak"];
  };
  start_button_interact: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/start_button_interact"];
  };
  start_button_special: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/hub/start_button_special"];
  };
  music_hub: {
    category: "music";
    sounds: [
      {
        name: "sounds/hub/music/music_hub";
        volume: 0.3;
        stream: true;
      }
    ];
  };
  armor_upgrade: {
    category: "ui";
    sounds: ["sounds/general/armor_upgrade"];
  };
  cape_reward: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/cape_reward";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  death: {
    category: "ui";
    sounds: ["sounds/general/death"];
  };
  go: {
    category: "ui";
    sounds: ["sounds/general/go"];
  };
  scoreacquired: {
    category: "ui";
    sounds: ["sounds/general/scoreacquired"];
  };
  smallcoins: {
    category: "ui";
    sounds: ["sounds/general/smallcoins"];
  };
  bigcoins: {
    category: "ui";
    sounds: ["sounds/general/bigcoins"];
  };
  button_click: {
    category: "ui";
    sounds: ["sounds/general/button_click"];
  };
  button_select: {
    category: "ui";
    sounds: ["sounds/general/button_select"];
  };
  challenge_complete: {
    category: "ui";
    sounds: ["sounds/general/challenge_complete"];
  };
  leave_game: {
    category: "ui";
    sounds: ["sounds/general/leave_game"];
  };
  popup: {
    category: "ui";
    volume: 0.8;
    sounds: ["sounds/general/popup"];
  };
  purchase: {
    category: "ui";
    volume: 0.8;
    sounds: ["sounds/general/purchase"];
  };
  queue_cancel: {
    category: "ui";
    volume: 1.4;
    sounds: ["sounds/general/queue_cancel"];
  };
  queue_countdown: {
    category: "ui";
    volume: 1.4;
    sounds: ["sounds/general/queue_countdown"];
  };
  queue_joining: {
    category: "ui";
    volume: 1.4;
    sounds: ["sounds/general/queue_joining"];
  };
  queue_success: {
    category: "ui";
    volume: 1.4;
    sounds: ["sounds/general/queue_success"];
  };
  queue_teleport: {
    category: "ui";
    volume: 1.3;
    sounds: ["sounds/general/queue_teleport"];
  };
  quick_travel: {
    category: "ui";
    volume: 1.3;
    sounds: ["sounds/general/queue_teleport"];
  };
  respawn: {
    category: "ui";
    sounds: ["sounds/sot/rescue"];
  };
  reward_claim: {
    category: "ui";
    sounds: ["sounds/general/reward_claim"];
  };
  reward_recieve: {
    category: "ui";
    sounds: ["sounds/general/reward_recieve"];
  };
  trash: {
    category: "ui";
    sounds: ["sounds/general/trash"];
  };
  music_game_end: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_game_end";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_game_big_success: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_game_big_success";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_game_small_success: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_game_small_success";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_game_win: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_game_win";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_overtime_intro: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_overtime_intro";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_overtime_loop: {
    category: "music";
    sounds: [
      {
        name: "sounds/general/music_overtime_loop";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  balloon_animal: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/balloon_animal"];
  };
  bubble_blower: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/bubble_blower"];
  };
  confetti_tag: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/confetti_tag"];
  };
  party_popper: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/party_popper"];
  };
  player_gift: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/player_gift"];
  };
  silly_horn: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/items/silly_horn"];
  };
  door_vault: {
    category: "neutral";
    sounds: ["sounds/sot/door_vault"];
  };
  door_wood: {
    category: "neutral";
    sounds: ["sounds/sot/door_wood"];
  };
  gate_close: {
    category: "neutral";
    sounds: ["sounds/sot/gate_close"];
  };
  gate_open: {
    category: "neutral";
    sounds: ["sounds/sot/gate_open"];
  };
  gold_drop: {
    category: "neutral";
    max_distance: 10.001;
    sounds: [
      {
        name: "sounds/sot/gold_drop1";
        volume: 1;
      },
      {
        name: "sounds/sot/gold_drop2";
        volume: 1;
      },
      {
        name: "sounds/sot/gold_drop3";
        volume: 1;
      }
    ];
  };
  key_pickup_gold: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/sot/key_pickup_gold"];
  };
  key_pickup_vault: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/sot/key_pickup_vault"];
  };
  lock_in: {
    category: "ui";
    sounds: ["sounds/sot/lock_in"];
  };
  puzzle_complete: {
    category: "ui";
    sounds: ["sounds/sot/puzzle_complete"];
  };
  rescue: {
    category: "ui";
    sounds: ["sounds/sot/rescue"];
  };
  sand_falling: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/sot/sand_falling1";
        volume: 1;
      },
      {
        name: "sounds/sot/sand_falling2";
        volume: 1;
      }
    ];
  };
  sand_full: {
    category: "ui";
    sounds: ["sounds/sot/sand_full"];
  };
  sand_place: {
    category: "neutral";
    max_distance: 10.001;
    sounds: [
      {
        name: "sounds/sot/sand_place1";
        volume: 1;
      },
      {
        name: "sounds/sot/sand_place2";
        volume: 1;
      },
      {
        name: "sounds/sot/sand_place3";
        volume: 1;
      }
    ];
  };
  sand_sacrifice: {
    category: "ui";
    sounds: ["sounds/sot/sand_sacrifice"];
  };
  sands_grace_period: {
    category: "ui";
    sounds: ["sounds/sot/sands_grace_period"];
  };
  sandtimer_10sec: {
    category: "ui";
    sounds: ["sounds/sot/sandtimer_10sec"];
  };
  sandtimer_20sec: {
    category: "ui";
    sounds: ["sounds/sot/sandtimer_20sec"];
  };
  sandtimer_30sec: {
    category: "ui";
    sounds: ["sounds/sot/sandtimer_30sec"];
  };
  sparkle: {
    category: "neutral";
    max_distance: 15.001;
    sounds: [
      {
        name: "sounds/sot/sparkle1";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle2";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle3";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle4";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle5";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle6";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle7";
        volume: 0.7;
      },
      {
        name: "sounds/sot/sparkle8";
        volume: 0.7;
      }
    ];
  };
  statue_break: {
    category: "neutral";
    max_distance: 10.001;
    sounds: [
      {
        name: "sounds/sot/statue_break1";
        volume: 1;
      },
      {
        name: "sounds/sot/statue_break2";
        volume: 1;
      },
      {
        name: "sounds/sot/statue_break3";
        volume: 1;
      }
    ];
  };
  teamvault_open: {
    category: "ui";
    sounds: ["sounds/sot/teamvault_open"];
  };
  tomb_open: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/sot/tomb_open"];
  };
  vault_open: {
    category: "ui";
    sounds: ["sounds/sot/vault_open"];
  };
  treasure_chest_open: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/sot/treasure_chest_open"];
  };
  treasure_chest_wrong: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/sot/treasure_chest_wrong"];
  };
  music_sot: {
    category: "music";
    sounds: [
      {
        name: "sounds/sot/music/music_sot";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  blastoff: {
    category: "neutral";
    sounds: ["sounds/gr/blastoff"];
  };
  blockpush: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/blockpush"];
  };
  blockpush_solve: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/blockpush_solve"];
  };
  cake_sponge: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_sponge"];
  };
  cake_icing: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_icing"];
  };
  cake_cherries: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_cherries"];
  };
  cake_candle: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_candle"];
  };
  cake_complete: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_complete"];
  };
  cake_disappear: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/cake_disappear"];
  };
  finish: {
    category: "ui";
    sounds: ["sounds/gr/finish"];
  };
  food_correct: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/food_correct"];
  };
  gate_open_short: {
    category: "neutral";
    max_distance: 15.001;
    sounds: ["sounds/gr/gate_open_short"];
  };
  golf_knockback: {
    category: "neutral";
    max_distance: 15.001;
    sounds: [
      {
        name: "sounds/gr/golf_knockback1";
        volume: 0.9;
      },
      {
        name: "sounds/gr/golf_knockback2";
        volume: 0.9;
      },
      {
        name: "sounds/gr/golf_knockback3";
        volume: 0.9;
      }
    ];
  };
  home_stretch: {
    category: "ui";
    sounds: ["sounds/gr/home_stretch"];
  };
  gr_key_pickup: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/key_pickup"];
  };
  key_unlock: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/key_unlock"];
  };
  paintbrush_fire: {
    category: "neutral";
    max_distance: 15.001;
    sounds: [
      {
        name: "sounds/gr/paintbrush_fire1";
        volume: 0.9;
      },
      {
        name: "sounds/gr/paintbrush_fire2";
        volume: 0.9;
      },
      {
        name: "sounds/gr/paintbrush_fire3";
        volume: 0.9;
      }
    ];
  };
  paintpot: {
    category: "neutral";
    max_distance: 10.001;
    sounds: ["sounds/gr/paintpot"];
  };
  pipe_suck_start: {
    category: "ui";
    sounds: ["sounds/gr/pipe_suck_start"];
  };
  pipe_teleport: {
    category: "ui";
    sounds: ["sounds/gr/pipe_teleport"];
  };
  playersrequired: {
    category: "ui";
    sounds: ["sounds/gr/playersrequired"];
  };
  playersrequired_complete: {
    category: "ui";
    sounds: ["sounds/gr/playersrequired_complete"];
  };
  room_beast: {
    category: "ui";
    sounds: ["sounds/gr/room_beast"];
  };
  room_cake: {
    category: "ui";
    sounds: ["sounds/gr/room_cake"];
  };
  room_clean: {
    category: "ui";
    sounds: ["sounds/gr/room_clean"];
  };
  room_complete: {
    category: "ui";
    sounds: ["sounds/gr/room_complete"];
  };
  room_complete_enemy: {
    category: "ui";
    sounds: ["sounds/gr/room_complete_enemy"];
  };
  room_cook: {
    category: "ui";
    sounds: ["sounds/gr/room_cook"];
  };
  room_copy: {
    category: "ui";
    sounds: ["sounds/gr/room_copy"];
  };
  room_crossing: {
    category: "ui";
    sounds: ["sounds/gr/room_crossing"];
  };
  room_golf: {
    category: "ui";
    sounds: ["sounds/gr/room_golf"];
  };
  room_key: {
    category: "ui";
    sounds: ["sounds/gr/room_key"];
  };
  room_lamps: {
    category: "ui";
    sounds: ["sounds/gr/room_lamps"];
  };
  room_target: {
    category: "ui";
    sounds: ["sounds/gr/room_target"];
  };
  room_title: {
    category: "ui";
    sounds: ["sounds/gr/room_title"];
  };
  target_hit: {
    category: "neutral";
    max_distance: 15.001;
    sounds: [
      {
        name: "sounds/gr/target_hit1";
        volume: 0.9;
      },
      {
        name: "sounds/gr/target_hit2";
        volume: 0.9;
      },
      {
        name: "sounds/gr/target_hit3";
        volume: 0.9;
      }
    ];
  };
  teammate_finishline: {
    category: "ui";
    sounds: ["sounds/gr/teammate_finishline"];
  };
  music_gr: {
    category: "music";
    sounds: [
      {
        name: "sounds/gr/music/music_gr";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_gr_intro: {
    category: "music";
    sounds: [
      {
        name: "sounds/gr/music/music_gr_intro";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  music_gr_win: {
    category: "music";
    sounds: [
      {
        name: "sounds/gr/music/music_gr_win";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  castle_door: {
    category: "neutral";
    sounds: ["sounds/ar/castle_door"];
  };
  checkpoint_pass: {
    category: "ui";
    sounds: ["sounds/ar/checkpoint_pass"];
  };
  elytra_zone: {
    category: "ui";
    sounds: ["sounds/ar/elytra_zone"];
  };
  elytra_remove: {
    category: "ui";
    sounds: ["sounds/ar/elytra_remove"];
  };
  jump: {
    category: "ui";
    sounds: [
      {
        name: "sounds/ar/jump1";
        volume: 0.9;
      },
      {
        name: "sounds/ar/jump2";
        volume: 0.9;
      },
      {
        name: "sounds/ar/jump3";
        volume: 0.9;
      }
    ];
  };
  jump_alert: {
    category: "ui";
    sounds: ["sounds/ar/jump_alert"];
  };
  launch: {
    category: "ui";
    sounds: [
      {
        name: "sounds/ar/launch1";
        volume: 0.75;
      },
      {
        name: "sounds/ar/launch2";
        volume: 0.75;
      },
      {
        name: "sounds/ar/launch3";
        volume: 0.75;
      }
    ];
  };
  speed: {
    category: "ui";
    sounds: [
      {
        name: "sounds/ar/speed1";
        volume: 0.6;
      },
      {
        name: "sounds/ar/speed2";
        volume: 0.6;
      },
      {
        name: "sounds/ar/speed3";
        volume: 0.6;
      }
    ];
  };
  jump_neutral: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/ar/jump1";
        volume: 1.2;
      },
      {
        name: "sounds/ar/jump2";
        volume: 1.2;
      },
      {
        name: "sounds/ar/jump3";
        volume: 1.2;
      }
    ];
  };
  launch_neutral: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/ar/launch1";
        volume: 1.2;
      },
      {
        name: "sounds/ar/launch2";
        volume: 1.2;
      },
      {
        name: "sounds/ar/launch3";
        volume: 1.2;
      }
    ];
  };
  speed_neutral: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/ar/speed1";
        volume: 1;
      },
      {
        name: "sounds/ar/speed2";
        volume: 1;
      },
      {
        name: "sounds/ar/speed3";
        volume: 1;
      }
    ];
  };
  tutorial_ring: {
    category: "neutral";
    sounds: ["sounds/ar/tutorial_ring"];
  };
  tutorial_particle: {
    category: "neutral";
    sounds: ["sounds/ar/tutorial_ring"];
  };
  music_ar: {
    category: "music";
    sounds: [
      {
        name: "sounds/ar/music/music_ar";
        volume: 0.8;
        stream: true;
      }
    ];
  };
  enemy_shatter: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/md/enemy_shatter";
        volume: 1.7;
      }
    ];
  };
  enemy_spawn: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/md/enemy_spawn";
        volume: 1.7;
      }
    ];
  };
  freeze_bow_fire: {
    category: "neutral";
    sounds: [
      {
        name: "sounds/md/freeze_bow_fire1";
        volume: 1;
      },
      {
        name: "sounds/md/freeze_bow_fire2";
        volume: 1;
      },
      {
        name: "sounds/md/freeze_bow_fire3";
        volume: 1;
      }
    ];
  };
  freeze_bow_hit: {
    category: "neutral";
    sounds: ["sounds/md/freeze_bow_hit"];
  };
  meltdown_alarm_loop: {
    category: "ui";
    sounds: ["sounds/md/meltdown_alarm_loop"];
  };
  meltdown_alarm_start: {
    category: "ui";
    sounds: ["sounds/md/meltdown_alarm_start"];
  };
  meltdown_entrance: {
    category: "ui";
    sounds: [
      {
        name: "sounds/md/meltdown_entrance";
        volume: 0.7;
      }
    ];
  };
  meltdown_frozen: {
    category: "ui";
    sounds: [
      {
        name: "sounds/md/meltdown_frozen";
        volume: 0.7;
      }
    ];
  };
  room_clear: {
    category: "ui";
    sounds: ["sounds/md/room_clear"];
  };
  music_md: {
    category: "music";
    sounds: [
      {
        name: "sounds/md/music/music_md";
        volume: 0.8;
        stream: true;
      }
    ];
  };
};

export type FTSounds = keyof FTSoundDefinitions;

export namespace sound {
  export function play<T extends Player | Dimension>(
    arg1: Player | Dimension,
    id: FTSounds,
    options: T extends Player ? PlayerSoundOptions | undefined : WorldSoundOptions & { location: Vector3 }
  ) {
    let asPlayer = arg1 as Player;
    let asDim = arg1 as Dimension;
    if (asPlayer.name) {
      asPlayer.playSound(id, options);
    } else {
      asDim.playSound(id, (options as { location: Vector3 }).location);
    }
  }
}
