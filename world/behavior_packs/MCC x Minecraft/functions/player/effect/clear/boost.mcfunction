## Clear boost effect once launched by the booster
## Ran as Player
## Called from player/effect/update

scoreboard players operation @s block_effect = .effect.none var
effect @s levitation 0