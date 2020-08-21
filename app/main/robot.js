const { ipcMain } = require("electron");
const robot = require("robotjs");
const vkey = require("vkey");

const handleMouse = (data) => {
  const { clientX, clientY, screen, video } = data;

  let x = (clientX * screen.width) / video.width;
  let y = (clientY * screen.height) / video.height;

  console.log(x, y);
  robot.moveMouse(x, y);
  robot.mouseClick();
};

const handleKey = (data) => {
  const { keyCode, meta, alt, ctrl, shift } = data;
  const modifiers = [];

  if (meta) modifiers.push(meta);
  if (alt) modifiers.push(alt);
  if (ctrl) modifiers.push(ctrl);
  if (shift) modifiers.push(shift);

  const key = vkey[keyCode].toLowerCase();
  if (key[0] != "<") {
    robot.keyTap(key, modifiers);
  }
};

module.exports = function () {
  ipcMain.on("robot", (e, type, data) => {
    if (type === "mouse") {
      handleMouse(data);
    } else if (type === "key") {
      handleKey(data);
    }
    console.log(type, data);
  });
};
