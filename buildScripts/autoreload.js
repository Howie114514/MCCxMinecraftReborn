const ws = require("ws");
const server = new ws.Server({
  port: 1145,
});

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
  run(c, "say hello");
});

const http = require("http");

const httpserver = http.createServer((req, res) => {
  try {
    server.clients.forEach((c) => {
      run(c, "reload");
      run(c, "say reloaded");
      run(c, "script debugger connect localhost");
    });
  } catch (e) {
    res.end("error");
  }
  res.writeHead(200);
  res.end("success");
});

httpserver.listen(3000, () => {
  console.log("Server is running on port 3000");
});
