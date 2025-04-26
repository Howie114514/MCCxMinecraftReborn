## Check for effect blocks and apply/remove effects appropriately
## Ran as Player
## Called from player/tick

# Ensure effect score has a value
scoreboard players add @s block_effect 0

# Check active effect state
execute unless score @s block_effect = .effect.none var run function player/effect/check/clear
execute if score @s block_effect = .effect.none var run function player/effect/check/give