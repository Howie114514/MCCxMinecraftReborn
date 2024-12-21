import sys

f=open("./scripts/buildInfo.ts","w")
f.write(f"export const isDevMode = {sys.argv[1]}")
f.close()