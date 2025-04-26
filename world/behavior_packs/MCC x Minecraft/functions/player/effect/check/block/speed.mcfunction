## Check if player is standing on any blocks used for the speed boost effect
## Ran as Player
## Called from:
#		player/effect/check/give/speed
#		player/effect/check/clear/speed

scoreboard players set .block_check var 0
execute if block ~ ~-1 ~ noxcrew.ft:speed_pad -1 run scoreboard players set .block_check var 1
execute if score .block_check var matches 0 if block ~ ~-1 ~ noxcrew.ft:speed_pad -1 run scoreboard players set .block_check var 1