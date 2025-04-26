## Check which active tool needs to be checked
## Called from player/item/update

execute if score @s tool = .tool_gate.trident var run function player/item/trident
execute if score @s tool = .tool_gate.elytra var run function player/item/elytra