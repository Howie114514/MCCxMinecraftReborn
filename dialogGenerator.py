import json
while True:
  try:
    [prefix,min,max] = input(">").split(" ")
    tmp = {
      "rawtext":[
      ]
    }
    for i in range(int(min),int(max)+1):
      tmp["rawtext"].append({
                "translate": f"{prefix}.dia{i}"
              })
      tmp["rawtext"].append(
              {
                "text": "\n\n"
              })
    print(json.dumps(tmp))
  except KeyboardInterrupt:
    print("Interrupted")
    exit()
  except Exception as e:
    print(e)