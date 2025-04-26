## Check give conditions for each effect. Only runs as many checks as needed, sorted in order of how many checks are required
## Ran as Player
## Called from player/effect/update

function player/effect/check/give/boost
execute if score @s block_effect = .effect.none var run function player/effect/check/give/speed
execute if score @s block_effect = .effect.none var run function player/effect/check/give/jump