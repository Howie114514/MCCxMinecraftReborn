## Apply effects when walking over a speed boost pad
## Ran as Player
## Called from player/effect/update

tag @s add this.player
playsound speed @s
playsound speed_neutral @a[tag=!this.player] ~ ~ ~
tag @s remove this.player

effect @s speed 1000000 2 true

scoreboard players operation @s block_effect = .effect.speed var