const peer = require("./peer-control");

let video = document.getElementById("screen-video");
const play = (stream) => {
  video.srcObject = stream;

  video.onloadedmetadata = () => {
    video.play();
  };
};

peer.on("add-steam", (stream) => {
  play(stream);
});

window.onkeydown = (e) => {
  const data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    ctrl: e.ctrlKey,
    alt: e.altKey,
  };

  peer.emit("robot", "key", data);
};

window.onmouseup = (e) => {
  const data = {
    clientX: e.clientX,
    clientY: e.clientY,
    video: {
      width: video.getBoundingClientRect().width,
      height: video.getBoundingClientRect().height,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
  };

  peer.emit("robot", "mouse", data);
};
