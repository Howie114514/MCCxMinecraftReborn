## Re-give elytra if player is missing one
## Ran as Player
## Called from player/item/tools

execute unless entity @s[hasitem={item=elytra,quantity=1,location=slot.armor.chest,slot=0}] run function checkpoint/tool/give/elytra