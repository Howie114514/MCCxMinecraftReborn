## Check if player is standing on any blocks used for the jump boost effect
## Ran as Player
## Called from player/effect/check/block/jump

execute if block ~-0.5 ~ ~-0.5 noxcrew.ft:jump_pad -1 run scoreboard players set .block_check var 1
execute if score .block_check var matches 0 if block ~0.5 ~ ~-0.5 noxcrew.ft:jump_pad -1 run scoreboard players set .block_check var 1
execute if score .block_check var matches 0 if block ~-0.5 ~ ~0.5 noxcrew.ft:jump_pad -1 run scoreboard players set .block_check var 1
execute if score .block_check var matches 0 if block ~0.5 ~ ~0.5 noxcrew.ft:jump_pad -1 run scoreboard players set .block_check var 1