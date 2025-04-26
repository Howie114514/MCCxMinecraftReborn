## Primary tick run at 20hz
## Called from tick.json
execute unless score .mapstart var matches 1 if block 104 4 285 stone_button 11 run function mapstart

execute as @a at @s run function player/tick

scoreboard players set .p.incourse var 0
execute if entity @p[scores={course.state=1}] run scoreboard players set .p.incourse var 1

execute if score .p.incourse var matches 1 run function course/tick

scoreboard players add .effect.delay var 1
execute if score .effect.delay var matches 60.. run function replay/effects

# Music Queue
execute if score .music.state var = .music.state.lobby var run music queue music_hub
execute if score .music.state var = .music.state.course var run music queue music_ar