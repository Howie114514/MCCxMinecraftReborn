## Check if player is standing on any blocks used for the launch effect
## Ran as Player
## Called from:
#		player/effect/check/give/boost
#		player/effect/check/clear/boost

scoreboard players set .block_check var 0
#execute if block ~ ~-1 ~ noxcrew.ft:launch_pad -1 run scoreboard players set .block_check var 1