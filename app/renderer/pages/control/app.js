const peer = require("./peer-control");

const play = (stream) => {
  let video = document.getElementById("screen-video");
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
  };
};

peer.on("add-steam", (stream) => {
  play(stream);
});
