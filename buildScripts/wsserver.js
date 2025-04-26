import { Server } from "ws";

let server;

export function createServer() {
  server = new Server({
    port: 1145,
  });
}

function run(c, cmd) {
  c.send(
    JSON.stringify({
      body: {
        origin: {
          type: "player",
        },
        commandLine: cmd,
        version: 1,
      },
      header: {
        requestId: "00000000-0000-0000-0000-000000000000",
        messagePurpose: "commandRequest",
        version: 1,
        messageType: "commandRequest",
      },
    })
  );
}
server.on("connection", (c) => {
  console.log("连上了");
  run(c, `tellraw @a {"rawtext":[{"text":"[§bmcpack devtools§r] connected"}]}`);
});

export let runCommand = run;
