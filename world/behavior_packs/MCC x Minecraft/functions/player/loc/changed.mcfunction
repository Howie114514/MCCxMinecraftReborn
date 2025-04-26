## Run any checks when player changes location
## Ran as Player
## Called from player/loc/update

# Update the Hub when player returns to Hub
execute if score @s p.loc = .ploc.lobby var run function hub/update

# Update Spawnpoints
execute if score @s p.loc = .ploc.lobby var run spawnpoint @s 106 2 269
execute if score @s p.loc = .ploc.finish var run spawnpoint @s 363 202 294