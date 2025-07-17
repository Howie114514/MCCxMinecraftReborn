#Portals
#sand_of_time
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2140,dx=8,y=112,dy=3,z=2217,dz=1] run scriptevent mccr:enter_portal sot;plobby2sot;sot
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2156,dx=8,y=61,dy=3,z=111,dz=1] run scriptevent mccr:enter_portal lobby;psot2lobby;lobby

#ace_race
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2073,dx=0,y=133,dy=3,z=2140,dz=8] run scriptevent mccr:enter_portal ace_race;plobby2ace_race;ace_race
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=4243,dx=9,y=65,dy=3,z=2169,dz=1] run scriptevent mccr:enter_portal lobby;pace_race2lobby;lobby

#grid_runners
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2132,dx=9,y=111,dy=3,z=2084,dz=1] run scriptevent mccr:enter_portal grid_runners;plobby2grid_runners;grid_runners
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2081,dx=0,y=83,dy=3,z=4251,dz=8] run scriptevent mccr:enter_portal lobby;pgrid_runners2lobby;lobby

#meltdown
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=2209,dx=0,y=113,dy=3,z=2141,dz=8] run scriptevent mccr:enter_portal meltdown;plobby2meltdown;meltdown
execute as @a at @s if block ~~~ noxcrew.ft:fake_portal if entity @s[x=89,dx=1,y=65,dy=3,z=2164,dz=8] run scriptevent mccr:enter_portal lobby;pmeltdown2lobby;lobby