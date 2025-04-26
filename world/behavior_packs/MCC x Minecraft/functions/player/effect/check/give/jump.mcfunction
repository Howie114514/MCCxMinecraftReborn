## Check if player matches the conditions for jump boost and runs the effect application
## Ran as Player
## Called from player/effect/give

function player/effect/check/block/jump
execute if score .block_check var matches 1 run function player/effect/give/jump