const { app } = require("electron");
const handleIpc = require("./ipc");
// const { create: createMainWindow } = require("./windows/main");
const { create: createControlWindow } = require("./windows/control");

app.on("ready", () => {
  // createMainWindow();
  createControlWindow();
  handleIpc();
  require("./robot")();
});
app.allowRendererProcessReuse = false;
