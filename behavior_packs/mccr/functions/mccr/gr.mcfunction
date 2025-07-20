execute as @a[x=2159.5,y=64.0,z=4254.0,dx=0.1,dy=2.0,dz=3.0] run scriptevent mccr.gr:enter_gate 1
execute as @a[x=2191.5,y=64.0,z=4256.0,dx=0.1,dy=2.0,dz=-1.0] run scriptevent mccr.gr:enter_gate 2
execute as @a[x=2223.5,y=64.0,z=4255.0,dx=0.1,dy=2.0,dz=1.0] run scriptevent mccr.gr:enter_gate 3
execute as @a[x=2255.5,y=64.0,z=4256.0,dx=0.1,dy=2.0,dz=-1.0] run scriptevent mccr.gr:enter_gate 4

execute as @a[x=2300.3,y=60.73,z=4251.3,dx=0.0,dy=7.470000000000006,dz=9.399999999999636] run scriptevent mccr:end_game grid_runners

effect @e[tag=gr_animals] resistance 1 255 true
effect @e[tag=gr_animals] instant_health 1 255 true