const EventEmitter = require("events");
const peer = new EventEmitter();
// const { desktopCapturer, ipcRenderer } = require("electron");

// const getScreenStream = async () => {
//   const scoure = await desktopCapturer.getSources({
//     types: ["screen"],
//   });

//   console.log(scoure);

//   navigator.getUserMedia(
//     {
//       audio: false,
//       video: {
//         mandatory: {
//           chromeMediaSource: "desktop",
//           chromeMediaSourceId: scoure[0].id,
//           maxWidth: window.screen.width,
//           maxHeight: window.screen.height,
//         },
//       },
//     },
//     (stream) => {
//       peer.emit("add-steam", stream);
//     },
//     (err) => {
//       console.log(err);
//     }
//   );
// };
// getScreenStream();

// peer.on("robot", (type, data) => {
//   ipcRenderer.send("robot", type, data);
// });

const pc = new window.RTCPeerConnection();
async function CreateOffer() {
  // offer的SDP
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  });
  console.log("pc offer", JSON.stringify(offer));

  // setLocalDescription
  await pc.setLocalDescription(offer);

  // 返回localDescription
  return pc.localDescription;
}
CreateOffer();

async function setRemote(ans) {
  await pc.setRemoteDescription(ans);
}

window.setRemote = setRemote;

pc.onaddstream = function (e) {
  console.log("add-stream", e);
  peer.emit("add-steam", e.stream);
};

module.exports = peer;
