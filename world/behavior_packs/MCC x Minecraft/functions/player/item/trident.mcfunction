## Re-give trident if player is missing one, and apply enchantments
## Ran as Player
## Called from player/item/tools

execute unless entity @s[hasitem=[{item=trident,quantity=1,location=slot.hotbar,slot=0},{item=diamond_boots,quantity=1,location=slot.armor.feet,slot=0}]] run function checkpoint/tool/give/trident
execute if entity @s[hasitem={item=trident,quantity=1,location=slot.weapon.mainhand,slot=0}] run enchant @s riptide 1