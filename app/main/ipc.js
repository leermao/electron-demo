const { ipcMain } = require("electron");
const { send: sendMainWindow } = require("./windows/main");
const {
  create: createControlWindow,
  send: sendControlWindow,
} = require("./windows/control");
const signal = require("./signal");

module.exports = () => {
  /**
   * 获取验证码
   *
   * 主进程发送signal.invoke invoke会发送向ws发送login事件
   * ws中判断login后，会向页面发送logined
   * 页面中通过signal.js中message接收 然后触发EventEmitter的emit
   * 页面通过signal.once /signal.on 监听emit
   */
  ipcMain.handle("login", async () => {
    const { code } = await signal.invoke("login", null, "logined");

    return code;
  });

  ipcMain.on("control", (e, remote) => {
    // createControlWindow();
    // sendMainWindow("control-state-change", remote, 1);
    signal.send("control", { remote });
  });

  /**
   * 控制端B 响应controlled
   */
  signal.on("controlled", (data) => {
    createControlWindow();
    sendMainWindow("control-state-change", data.remote, 1);
  });

  /**
   * 傀儡端A 响应be-controlled
   */
  signal.on("be-controlled", (data) => {
    sendMainWindow("control-state-change", data.remote, 2);
  });

  ipcMain.on("forward", (e, event, data) => {
    signal.send("forward", { event, data });
  });
  /**
   * 向傀儡端转发offer
   */
  signal.on("offer", (data) => {
    sendMainWindow("offer", data);
  });
  /**
   * 向控制端发送answer
   */
  signal.on("answer", (data) => {
    sendControlWindow("answer", data);
  });
  /**
   * 想控制端发送candidate
   */
  signal.on("puppet-candidate", (data) => {
    sendControlWindow("candidate", data);
  });

  signal.on("control-candidate", (data) => {
    sendMainWindow("candidate", data);
  });
};
