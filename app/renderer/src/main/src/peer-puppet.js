const { desktopCapturer, ipcRenderer } = window.require("electron");
// createAnswer
// addStream

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
async function createAnswer(offer) {
  const screenStream = await getScreenStream();

  pc.addStream(screenStream);

  await pc.setRemoteDescription(offer);
  await pc.setLocalDescription(await pc.createAnswer());
  console.log("answer", JSON.stringify(pc.localDescription));
  return pc.localDescription;
}

pc.onicecandidate = (e) => {
  console.log("onicecandidate", JSON.stringify(e.candidate));

  if (e.candidate) {
    ipcRenderer.send("forward", "puppent-candidate", e.candidate);
  }
};

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

ipcRenderer.on("offer", async (e, offer) => {
  let awswer = await createAnswer(offer);

  ipcRenderer.send("forward", "awswer", { type: awswer.type, sdp: awswer.sdp });
});

window.createAnswer = createAnswer;
