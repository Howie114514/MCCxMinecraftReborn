def parseFloat(*args):
  res=[]
  for i in args:
    res.append(float(i))
  print(res)
  return res

while True:
  try:
    v=input(">")
    if v=="exit":
      break
    x,y,z,dx,dy,dz = v.split(" ")
    x,y,z,dx,dy,dz =parseFloat(x,y,z,dx,dy,dz)
    print(f"@a[x={x},y={y},z={z},dx={dx-x},dy={dy-y},dz={dz-z}]")
  except Exception as e:
    print(e)