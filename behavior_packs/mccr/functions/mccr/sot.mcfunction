execute as @a[x=2155,y=51,z=86,dx=10,dy=4,dz=0] at @s run scriptevent mccr.sot:finish
execute as @a[x=2155,y=51,z=86,dx=10,dy=4,dz=0] at @s run scriptevent mccr:end_game sot
#execute as @e[type=noxcrew.ft:coin_stack] at @s if entity @a[r=0.5] run mccr:trigger sot.collect @a[r=0.5]
#execute as @e[type=noxcrew.ft:sand_blocks] at @s if entity @a[r=0.5] run mccr:trigger sot.collect @a[r=0.5]
#execute as @e[type=noxcrew.ft:armor_podium] at @s if entity @a[r=0.5] run mccr:trigger sot.collect @a[r=0.5]
#execute as @e[type=noxcrew.ft:key_podium] at @s if entity @a[r=0.5] run mccr:trigger sot.collect @a[r=0.5]
execute as @e[type=noxcrew.ft:coin_stack] at @s if entity @a[r=0.5] run scriptevent mccr:trigger {"selector":{"maxDistance":0.5},"event":"sot.collect"}
execute as @e[type=noxcrew.ft:sand_blocks] at @s if entity @a[r=0.5] run scriptevent mccr:trigger {"selector":{"maxDistance":0.5},"event":"sot.collect"}
execute as @e[type=noxcrew.ft:armor_podium] at @s if entity @a[r=0.5] run scriptevent mccr:trigger {"selector":{"maxDistance":0.5},"event":"sot.collect"}
execute as @e[type=noxcrew.ft:key_podium] at @s if entity @a[r=0.5] run scriptevent mccr:trigger {"selector":{"maxDistance":0.5},"event":"sot.collect"}
