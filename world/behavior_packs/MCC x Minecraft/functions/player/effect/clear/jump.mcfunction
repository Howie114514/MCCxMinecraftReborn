## Clear jump boost when stepping off of the jump pad
## Ran as Player
## Called from player/effect/update

scoreboard players operation @s[tag=jump_clear] block_effect = .effect.none var
effect @s[tag=jump_clear] jump_boost 0 0 true

tag @s add jump_clear