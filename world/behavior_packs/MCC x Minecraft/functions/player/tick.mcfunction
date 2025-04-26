## Player ticking functions
## Called from main_tick
## Ran as player

# First Join System
scoreboard players add @s first_join 0
execute if score .mapstart var matches 1 unless score @s first_join matches 1 run function player/first_join

# Ploc Update
function player/loc/update

# Update Items
function player/item/update


# Check for checkpoint
execute if score .mapstart var matches 1 if entity @e[type=noxcrew:rsf.checkpoint,c=1,x=~-7,y=~1,z=~-7,dx=14,dy=-7,dz=14] run function checkpoint/normal/check

# Check for tool gate
execute if score .mapstart var matches 1 if entity @e[type=noxcrew:rsf.toolswap_gate,c=1,x=~-5,y=~1,z=~-5,dx=10,dy=-5,dz=10] run function checkpoint/tool/check

# timer
execute if score @s t.running matches 1 run function timer/loop

# Apply block effects
function player/effect/update

# Replay Pad loc check
execute if score @s p.loc = .ploc.lobby var run function replay/pads/zstatic

# Course End return pad
execute if score @s p.loc = .ploc.finish var run function course/end_pad/check


# Hub Reset Gate check
execute if entity @s[x=128,y=1,z=266,dy=5,dz=6] if score @s course.state = .course_state.started var run function course/return
execute if entity @s[x=128,y=1,z=266,dy=5,dz=6] if score @s course.type = .course_type.biome var run function course/type/all

# Gamemode locking
execute if score .mapstart var matches 1 if entity @s[m=!adventure,tag=!dev] run gamemode adventure