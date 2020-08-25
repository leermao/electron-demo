const { desktopCapturer, ipcRenderer } = window.require("electron");
// // createAnswer
// // addStream

const getScreenStream = async () => {
  const scoure = await desktopCapturer.getSources({
    types: ["screen"],
  });

  return new Promise((resolve, reject) => {
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
      (stream) => {
        resolve(stream);
        // peer.emit("add-steam", stream);
      },
      (err) => {
        reject(err);
        console.log(err);
      }
    );
  });
};

const pc = new window.RTCPeerConnection();
pc.ondatachannel = (e) => {
  console.log("datachannel", e);

  e.channel.onmessage = (e) => {
    let { type, data } = JSON.parse(e.data);
    ipcRenderer.send("robot", type, data);
  };
};

async function createAnswer(offer) {
  const screenStream = await getScreenStream();

  pc.addStream(screenStream);

  await pc.setRemoteDescription(offer);
  await pc.setLocalDescription(await pc.createAnswer());
  console.log("answer", JSON.stringify(pc.localDescription));
  return pc.localDescription;
}

pc.onicecandidate = (e) => {
  console.log("candidate", JSON.stringify(e.candidate));

  if (e.candidate) {
    ipcRenderer.send("forward", "puppet-candidate", e.candidate);
  }
};

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

/**
 * 接收到控制端发送的offer
 */
ipcRenderer.on("offer", async (e, offer) => {
  console.log("B端收到offer");
  let answer = await createAnswer(offer);
  console.log("B端发出awswer");
  ipcRenderer.send("forward", "answer", { type: answer.type, sdp: answer.sdp });
});

window.createAnswer = createAnswer;
window.addIceCandidate = addIceCandidate;
