const { BrowserWindow } = require("electron");
const path = require("path");

let win = null;
const create = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile(
    path.resolve(__dirname, "../../renderer/pages/control/index.html")
  );

  win.webContents.openDevTools();
};

function send(channel, ...args) {
  win.webContents.send(channel, ...args);
}

module.exports = { create, send };
