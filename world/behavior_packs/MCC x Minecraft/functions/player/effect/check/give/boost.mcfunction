## Check if player matches the conditions for launch and runs the effect application
## Ran as Player
## Called from player/effect/give

function player/effect/check/block/boost
execute if score .block_check var matches 1 run function player/effect/give/boost