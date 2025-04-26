import os

def compile(data,dest):
  result = '''/*
*  Auto generated
*/


'''

  sj=0
  palette={
  }
  for l in data:
    if not l.startswith("#"):
      cmd = l.replace("\n","").replace("\\@","\uffff").split("@")
      if len(cmd)==2:
        if cmd[0]=="import":
          a,m=cmd[1].split(":")
          result+=f'''import {a} from {m.replace("\uffff","@")};\n\n'''
        if cmd[0]=="kv3":
          n,x,y,z=cmd[1].split(" ")
          result+=f'''{"  "*sj}{n}:{{x: {x},y: {y},z: {z}}},\n'''
        if cmd[0]=="kbv":
          n,x,y,z,x1,y1,z1=cmd[1].split(" ")
          result+=f'''{"  "*sj}{n}:createBlockVolumeArgs({{x:{x},y:{y},z:{z}}},{{x:{x1},y:{y1},z:{z1}}}),\n'''
        if cmd[0]=="bv":
          x,y,z,x1,y1,z1=cmd[1].split(" ")
          result+=f'''{"  "*sj}createBlockVolumeArgs({{x:{x},y:{y},z:{z}}},{{x:{x1},y:{y1},z:{z1}}}),\n'''
        if cmd[0]=="v3":
          x,y,z=cmd[1].split(" ")
          result+=f'''{"  "*sj}{{x: {x},y: {y},z: {z}}},\n'''
        if cmd[0]=="export const":
          t=cmd[1].split("/")
          ttxt=""
          if len(t)>1:
            ttxt+=":"
            for txt in t[1:]:
              ttxt+=" "+txt
          result+=f'''export const {t[0]}{ttxt}='''
        if cmd[0]=="export var":
          t=cmd[1].split("/")
          ttxt=""
          if len(t)>1:
            ttxt+=":"
            for txt in t[1:]:
              ttxt+=" "+txt
          result+=f'''export var {t[0]}{ttxt}='''
        if cmd[0]=="key":
          result+=f'''{"  "*sj}{cmd[1]}:'''
        if cmd[0]=="arr":
          result+=f'''[{cmd[1].replace(" ",",")}],'''
        if cmd[0]=="range":
          s,e=cmd[1].split("~")
          result+=f'''{str(list(range(int(s),int(e)+1)))},'''
        if cmd[0]=="palette set":
          c,id=cmd[1].split()
          palette[c] = id
        if cmd[0]=="blocklist":
          blocks = list(cmd[1])
          result+="["
          for b in blocks:
            if not b in palette:
              raise "方块不在调色板中"
            result+=f"\"{palette[b]}\","
          result+="],"

      else:
        if cmd[0]=="arrstart":
          result+=f'''[\n'''
          inarr=True
          sj+=1
        if cmd[0]=="arrend":
          sj-=1
          result+=f'''{"  "*sj}]'''
          result+="\n"
        if cmd[0]==",":
          result+=","
        if cmd[0]=="objstart":
          result+=f'''{{\n'''
          sj+=1
        if cmd[0]=="objend":
          sj-=1
          result+=f'''{"  "*sj}}}\n'''

  open(os.path.join(OUTPUT,dest),"w").write(result)

PATH = "./mcdata/"
OUTPUT = "./scripts/data/"

if __name__=="__main__":
  files=os.listdir(PATH)
  for f in files:
    if os.path.isfile(os.path.join(PATH,f)) and f.endswith(".mcdata"):
      fn = os.path.splitext(f)[0]
      compile(open(os.path.join(PATH,f),encoding="utf-8").readlines(),fn+".ts")
      print("Compiled",f,"->",fn+".ts")