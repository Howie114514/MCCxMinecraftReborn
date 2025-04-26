## Clear speed state when stepping off a boost block
## Ran as Player
## Called from player/effect/update

scoreboard players operation @s block_effect = .effect.none var
# The effect doesn't actually update if it isn't cleared first
effect @s speed 0
# Now actually apply the affect
effect @s speed 5 2 true