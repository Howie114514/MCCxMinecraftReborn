## Apply effects when walking over a horizontal boost pad
## Ran as Player
## Called from player/effect/update

tag @s add this.player
playsound launch @s
playsound launch_neutral @a[tag=!this.player] ~ ~ ~
tag @s remove this.player

scoreboard players operation @s block_effect = .effect.boost var

execute if score @s boost_id matches 1 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id1
execute if score @s boost_id matches 2 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id2
execute if score @s boost_id matches 3 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id3
execute if score @s boost_id matches 4 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id4
execute if score @s boost_id matches 5 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id5
execute if score @s boost_id matches 6 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id6
execute if score @s boost_id matches 7 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id7
execute if score @s boost_id matches 8 run ride @s summon_rider noxcrew:rsf.launcher noxcrew:add_jump_boost.id8

effect @s levitation 1 1 true