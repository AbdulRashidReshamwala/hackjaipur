import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
const firebase = require("firebase");

export default function CallPage() {
  let history = useHistory();

  useEffect(() => {
    //check for user loogged in state
    firebase.auth().onAuthStateChanged(async (_user) => {
      if (!_user) {
        history.push("/");
      }
    });
  }, []);
  return <div>hello</div>;
  //   const getUserMedia = async () => {
  //     try {
  //       let ms = await navigator.mediaDevices.getUserMedia(
  //         mediaStreamConstraints
  //       );
  //       document.querySelector("#my-stream").srcObject = ms;
  //     } catch {
  //       alert("No media Devices Found");
  //     }
  //   };
  //   return (
  //     <div>
  //       <button onClick={getUserMedia}>hello</button>
  //       <video id="my-stream" autoPlay playsInline></video>
  //       <video id="remoteVideo" autoPlay playsInline></video>
  //       <div>
  //         <button id="startButton">Start</button>
  //         <button id="callButton">Call</button>
  //         <button id="hangupButton">Hang Up</button>
  //       </div>
  //     </div>
  //   );
}
