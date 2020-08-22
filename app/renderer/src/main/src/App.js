import React, { useState, useEffect, Fragment } from "react";
// import { ipcRenderer } from "electron";
import "./App.css";
import "./peer-puppet.js";
const { ipcRenderer } = window.require("electron");

function App() {
  const [remoteCode, setRemoteCode] = useState("");
  const [localCode, setLocalCode] = useState("");
  const [controlText, setControlText] = useState("");

  const login = async () => {
    let code = await ipcRenderer.invoke("login");
    setLocalCode(code);
  };

  const handleControlState = (e, name, type) => {
    let text = "";

    if (type === 1) {
      text = `远程控制${name}`;
    } else if (type === 2) {
      text = `被${name}控制中`;
    }

    setControlText(text);
  };

  useEffect(() => {
    login();

    ipcRenderer.on("control-state-change", handleControlState);

    return () => {
      ipcRenderer.removeListener("control-state-change", handleControlState);
    };
  }, []);

  const startControl = (remoteCode) => {
    ipcRenderer.send("control", remoteCode);
  };

  return (
    <div className="App">
      {controlText === "" ? (
        <Fragment>
          <div> 你的控制码 {localCode}</div>
          <input
            type="text"
            value={remoteCode}
            onChange={(e) => setRemoteCode(e.target.value)}
          />
          <button
            onClick={() => {
              startControl(remoteCode);
            }}
          >
            确认
          </button>
        </Fragment>
      ) : (
        <div>{controlText}</div>
      )}
    </div>
  );
}

export default App;
