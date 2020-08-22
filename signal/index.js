const webSocket = require("ws");
const wss = new webSocket.Server({
  port: 8081,
});

const code2ws = new Map();

wss.on("connection", (ws, req) => {
  // ws 端
  let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  code2ws.set(code, ws);

  ws.sendData = (event, data) => {
    console.log(event, data);
    ws.send(JSON.stringify({ event, data }));
  };

  ws.on("message", (message) => {
    console.log("ws.on message", message);

    let parsedMessage = {};
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.log(error);
      return;
    }

    let { event, data } = parsedMessage;
    if (event === "login") {
      ws.sendData("logined", { code });
    } else if (event === "control") {
      let remote = +data.remote;
      if (code2ws.has(remote)) {
        ws.sendData("controlled", { remote });
        ws.sendRemote = code2ws.get(remote).sendData;

        ws.sendRemote("be-controlled", { remote: code });
      }
    } else if (event === "forward") {
      ws.sendRemote(data.event, data.data);
    }
  });

  ws.on("close", () => {
    code2ws.delete(code);

    clearTimeout(ws._closeTimeout);
  });

  ws._closeTimeout = setTimeout(() => {
    ws.terminate();
  }, 10 * 60 * 1000);
});
