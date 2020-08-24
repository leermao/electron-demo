const EventEmitter = require("events");
const peer = new EventEmitter();
const { ipcRenderer } = require("electron");

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

createOffer();

// createOffer().then((offer) => {
//   console.log("A端发送offer");
//   // ipcRenderer.send("forward", "offer", { type: offer.type, sdp: offer.sdp });
// });

async function setRemote(answer) {
  await pc.setRemoteDescription(answer);
}

// ipcRenderer.on("answer", (e, answer) => {
//   console.log("A端收到awswer");
//   setRemote(answer);
// });

pc.onaddstream = function (e) {
  console.log("add-stream", e.stream);
  peer.emit("add-steam", e.stream);
};

//p2p NAT穿透
pc.onicecandidate = (e) => {
  console.log("onicecandidate", JSON.stringify(e.candidate));

  // if (e.candidate) {
  //   ipcRenderer.send("forward", "control-candidate", e.candidate);
  // }
};

// ipcRenderer.on("candidate", (e, condadite) => {

//   // addIceCandidate(condadite);
// });

let candidates = [];
async function addIceCandidate(candidate) {
  if (candidate) {
    candidates.push(candidate);
  }

  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]));
    }
    candidates = [];
  }
}

window.addIceCandidate = addIceCandidate;
window.setRemote = setRemote;

module.exports = peer;
