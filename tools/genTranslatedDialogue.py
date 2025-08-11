import sys
from os import path
import json

if sys.argv.__len__()<3:
  print("参数不足")
  exit(1)
else:
  f = open(f"./behavior_packs/mccr/dialogue/{sys.argv[1]}.json","w")
  lang = json.load(open(path.abspath(__file__+"/../lang.json"),encoding="utf-8"))
  json.dump({"format_version":"1.21.50","minecraft:npc_dialogue":{"scenes":[{"scene_tag":f"{sys.argv[1]}","npc_name":{"rawtext":[{"translate":sys.argv[2]}]},"text":{"rawtext":[]}}]}},f)
  print(f"dialogue change @e[name={lang[sys.argv[2]]}] {sys.argv[1]}")