## This function stops the music for the course
## Ran as: "server"
## Called From:
#  "behavior_packs\N-RSF-BP\functions\main_tick.mcfunction"

execute if score .music.state var = .music.state.course var run music play music_course_end
scoreboard players operation .music.state var = .music.state.lobby var