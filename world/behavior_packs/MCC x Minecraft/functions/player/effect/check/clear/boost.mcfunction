## Check if player no longer matches the conditions for launch and clears the effect
## Ran as Player
## Called from player/effect/clear

function player/effect/check/block/boost
execute unless score .block_check var matches 1 run function player/effect/clear/boost