import * as ws from "ws";

/**@type {ws.Server} */
let server;
/**@type {WebSocket}*/
let client;

export function createServer() {
  server = new ws.WebSocketServer({
    port: 1145,
  });
  server.on("connection", (c) => {
    client = c;
    console.log("[Websocket] connected");
    run(`tellraw @a {"rawtext":[{"text":"[§bmcpack devtools§r] connected"}]}`);
  });
}

async function run(cmd) {
  server.clients.forEach((c) => {
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
  });
}

export let runCommand = run;
