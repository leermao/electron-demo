const { app } = require("electron");
const handleIpc = require("./ipc");
const { create: createMainWindow } = require("./windows/main");

app.on("ready", () => {
  createMainWindow();
  handleIpc();
});
