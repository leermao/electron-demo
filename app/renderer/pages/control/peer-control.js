const EventEmitter = require("events");
const peer = new EventEmitter();
const { ipcRenderer } = require("electron");

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
async function createOffer() {
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

createOffer().then((offer) => {
  ipcRenderer.send("forward", "offer", { type: offer.type, sdp: offer.sdp });
});

async function setRemote(ans) {
  await pc.setRemoteDescription(ans);
}

ipcRenderer.on("answer", (e, data) => {
  setRemote(data);
});

window.setRemote = setRemote;

pc.onaddstream = function (e) {
  console.log("add-stream", e);
  peer.emit("add-steam", e.stream);
};

//p2p NAT穿透
pc.onicecandidate = (e) => {
  console.log("onicecandidate", JSON.stringify(e.candidate));

  if (e.candidate) {
    ipcRenderer.send("forward", "control-candidate", e.candidate);
  }
};

ipcRenderer.on("candidate", (e, condadite) => {
  addIceCandidate(condadite);
});

const candidates = [];
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate);
  }

  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
    }
  }
}

window.addIceCandidate = addIceCandidate;

module.exports = peer;
