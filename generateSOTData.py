points = open("sotMobSpawnPoints.txt",encoding="utf-8").readlines()

result = '''/*
*  Auto generated
*/
import { Vector3 } from "@minecraft/server";

const points: Vector3[] = [
'''

for l in points:
  if not l.startswith("#"):
    x,y,z = l.replace("\n","").split(" ")
    result+=f'''  {{x:{x}, y: {y}, z:{z}}},\n'''
    
result+='''];

export default points
'''

open("./scripts/data/sotMobSpawnPoints.ts","w").write(result)