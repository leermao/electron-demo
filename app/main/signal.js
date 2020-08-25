const WebSocket = require("ws");
const EventEmitter = require("events");
const signal = new EventEmitter();

const ws = new WebSocket("ws://81.70.48.133:8011");

ws.on("open", () => {
  console.log("connect success");
});

ws.on("message", (message) => {
  let data = {};
  try {
    data = JSON.parse(message);
  } catch (error) {
    console.log(error);
  }

  console.log(data);
  signal.emit(data.event, data.data);
});

function send(event, data) {
  ws.send(JSON.stringify({ event, data }));
}

function invoke(event, data, answerEvent) {
  return new Promise((resolve, reject) => {
    send(event, data);

    signal.once(answerEvent, resolve);

    setTimeout(() => {
      reject("reject");
    }, 5000);
  });
}

signal.send = send;
signal.invoke = invoke;

module.exports = signal;
