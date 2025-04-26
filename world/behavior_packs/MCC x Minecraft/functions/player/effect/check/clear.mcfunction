## Check clear conditions based on active effect
## Ran as Player
## Called from player/effect/update

execute if score @s block_effect = .effect.boost var run function player/effect/check/clear/boost
execute if score @s block_effect = .effect.speed var run function player/effect/check/clear/speed
execute if score @s block_effect = .effect.jump var run function player/effect/check/clear/jump