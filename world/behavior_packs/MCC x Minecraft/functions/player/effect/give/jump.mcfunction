## Apply effects when walking over a jump boost pad
## Ran as Player
## Called from player/effect/update

tag @s add this.player
playsound jump @s
playsound jump_neutral @a[tag=!this.player] ~ ~ ~
tag @s remove this.player

effect @s jump_boost 1000000 5 true

scoreboard players operation @s block_effect = .effect.jump var

tag @s remove jump_clear