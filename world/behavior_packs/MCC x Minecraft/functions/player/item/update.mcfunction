## Call appropriate inventory checks based on what items the player currently has
## Ran as Player
## Called from player/tick

execute unless score @s tool = .tool_gate.boots var run function player/item/tools

execute if score .mapstart var matches 1 if score @s course.state = .course_state.started var unless entity @s[hasitem={item=noxcrew:rsf.restart_checkpoint,quantity=1,location=slot.hotbar,slot=8}] run replaceitem entity @s slot.hotbar 8 noxcrew:rsf.restart_checkpoint 1 0 {"minecraft:item_lock":{"mode":"lock_in_slot"}}

execute unless score @s p.loc = .ploc.lobby var unless entity @s[hasitem={item=noxcrew:rsf.return_to_hub,quantity=1,location=slot.hotbar,slot=4}] run replaceitem entity @s slot.hotbar 4 noxcrew:rsf.return_to_hub 1 0 {"minecraft:item_lock":{"mode":"lock_in_slot"}}
execute if score @s p.loc = .ploc.lobby var unless score @s course.state = .course_state.started var if entity @s[hasitem={item=noxcrew:rsf.return_to_hub,quantity=1,location=slot.hotbar,slot=4}] run clear @s noxcrew:rsf.return_to_hub

execute if score @s course.type = .course_type.biome var unless entity @s[hasitem={item=noxcrew:rsf.restart_biome,quantity=1,location=slot.hotbar,slot=6}] run replaceitem entity @s slot.hotbar 6 noxcrew:rsf.restart_biome 1 0 {"minecraft:item_lock":{"mode":"lock_in_slot"}}
execute unless score @s course.type = .course_type.biome var if entity @s[hasitem={item=noxcrew:rsf.restart_biome,quantity=1,location=slot.hotbar,slot=6}] run clear @s noxcrew:rsf.restart_biome