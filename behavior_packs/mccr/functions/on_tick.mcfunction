execute as @a[m=spectator] at @s run particle minecraft:villager_happy
execute as @e[type=minecraft:armor_stand] at @s run tp @s @s

effect @a saturation 1 255 true

execute as @a[x=2325.0,y=62.0,z=4247.0,dx=1.0,dy=0.5,dz=-1.0,tag=!returning] at @s run scriptevent mccr.gr:return
execute as @a[x=2326.0,y=62.0,z=4265.0,dx=-1.0,dy=0.5,dz=-1.0,tag=!returning] at @s run scriptevent mccr.gr:return