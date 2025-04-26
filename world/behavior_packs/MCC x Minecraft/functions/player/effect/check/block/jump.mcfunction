## Start recursive check on jump pad blocks
## Ran as Player
## Called from:
#		player/effect/check/give/jump
#		player/effect/check/clear/jump

tp @e[type=noxcrew:rsf.raycaster,c=1] ~ ~ ~

scoreboard players set .block_check var 0
function player/effect/check/block/jump_loop

tp @e[type=noxcrew:rsf.raycaster,c=1] 106 2 269