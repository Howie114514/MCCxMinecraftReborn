const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const json = JSON.parse(readFileSync("./floating_texts.json").toString());

for (const key in json) {
  if (Object.prototype.hasOwnProperty.call(json, key)) {
    const element = json[key];
    writeFileSync(
      resolve("./behavior_packs/mccr/dialogue/floating_text." + key + ".json"),
      JSON.stringify({
        format_version: "1.21.50",
        "minecraft:npc_dialogue": {
          scenes: [
            {
              scene_tag: `text_${key.replace(/\-/, "_")}`,
              npc_name: {
                rawtext: [{ translate: element }],
              },
              text: {
                rawtext: [],
              },
            },
          ],
        },
      })
    );
  }
}
