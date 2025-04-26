## Update location value for player. Used to track current biome as well as lobby, oob, and finish locations
## Ran as Player
## Called from player/tick

scoreboard players set @s p.loc 0

execute if block ~ -63 ~ concrete 1 run scoreboard players operation @s p.loc = .ploc.lobby var
execute if block ~ -63 ~ concrete 2 run scoreboard players operation @s p.loc = .ploc.course var
execute if block ~ -62 ~ concrete 0 run scoreboard players operation @s[x=346,y=197,z=273,dx=28,dy=15,dz=46] p.loc = .ploc.finish var

execute unless score @s p.loc = @s p.loc.old run function player/loc/changed
scoreboard players operation @s p.loc.old = @s p.loc