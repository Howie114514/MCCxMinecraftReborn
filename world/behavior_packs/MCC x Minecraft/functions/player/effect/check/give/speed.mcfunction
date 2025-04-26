## Check if player matches the conditions for speed boost and runs the effect application
## Ran as Player
## Called from player/effect/give

function player/effect/check/block/speed
execute if score .block_check var matches 1 run function player/effect/give/speed