execute as @a[x=62,y=75,z=2127,dx=5,dy=3,dz=0] run scriptevent mccr:end_game meltdown

execute as @a[x=54.30,y=66.00,z=2174.51,dx=5,dy=4,dz=0] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 1
execute as @a[x=39,y= 66,z= 2190,dx=0,dy=4,dz=5] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 2
execute as @a[x=7 ,y=66,z= 2186,dx=0,dy=4,dz=5] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 3
execute as @a[x=-18 ,y=67,z= 2160,dx=4,dy=4,dz=0] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 4
execute as @a[x=-18 ,y=68,z= 2128,dx=4,dy=4,dz=0] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 5
execute as @a[x=7 ,y=68,z= 2102,dx=0,dy=4,dz=4] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 6
execute as @a[x=47 ,y=69,z= 2094,dx=0,dy=4,dz=4] at @s if block ~~~ minecraft:structure_void run scriptevent mccr.md:enter_gate 7

execute at @e[type=noxcrew.ft:md_blaze,has_property={noxcrew.ft:frozen=false}] run execute as @e[family=md_mob,r=1] run event entity @s mccr:melt
execute as @e[type=minecraft:arrow] at @s if block ~~~ minecraft:structure_void run kill