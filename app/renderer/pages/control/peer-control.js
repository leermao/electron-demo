const EventEmitter = require("events");
const peer = new EventEmitter();
const { desktopCapturer, ipcRenderer } = require("electron");

const getScreenStream = async () => {
  const scoure = await desktopCapturer.getSources({
    types: ["screen"],
  });

  console.log(scoure);

  navigator.getUserMedia(
    {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: scoure[0].id,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height,
        },
      },
    },
    (steam) => {
      peer.emit("add-steam", steam);
    },
    (err) => {
      console.log(err);
    }
  );
};
getScreenStream();

peer.on("robot", (type, data) => {
  ipcRenderer.send("robot", type, data);
});

module.exports = peer;
