const { ipcMain } = require("electron");
const { send: sendMainWindow } = require("./windows/main");
const {
  create: createControlWindow,
  send: sendControlWindow,
} = require("./windows/control");
const signal = require("./signal");

module.exports = () => {
  ipcMain.handle("login", async () => {
    const { code } = await signal.invoke("login", null, "logined");

    return code;
  });

  ipcMain.on("control", (e, remote) => {
    createControlWindow();
    sendMainWindow("control-state-change", remote, 1);
    // signal.send("control", { remote });
  });

  signal.on("controlled", (data) => {
    createControlWindow();
    sendMainWindow("control-state-change", data.remote, 1);
  });

  signal.on("be-controlled", (data) => {
    sendMainWindow("control-state-change", data.remote, 2);
  });

  ipcMain.on("forward", (e, event, data) => {
    console.log("信令服务转发", event);
    // signal.send("forward", { event, data });
  });

  signal.on("offer", (data) => {
    sendMainWindow("offer", data);
  });

  signal.on("answer", (data) => {
    sendControlWindow("answer", data);
  });

  signal.on("puppent-candidate", (data) => {
    sendControlWindow("candidate", data);
  });

  signal.on("control-candidate", (data) => {
    sendMainWindow("candidate", data);
  });
};
