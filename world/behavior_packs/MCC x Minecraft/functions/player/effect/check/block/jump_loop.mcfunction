## Recurse to find ground position for jump boost check (required to avoid dropped jump boost inputs)
## Ran as Player
## Called from player/effect/check/block/jump

tp @e[type=noxcrew:rsf.raycaster,c=1] ~ ~-0.5 ~ true

execute positioned ~ ~-0.5 ~ unless entity @e[type=noxcrew:rsf.raycaster,c=1,r=0] run function player/effect/check/block/jump_finish
execute if entity @s[r=5] positioned ~ ~-0.5 ~ if entity @e[type=noxcrew:rsf.raycaster,c=1,r=0] positioned ~ ~-0.5 ~ run function player/effect/check/block/jump