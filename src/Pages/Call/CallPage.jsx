import React, { useState } from "react";
import adapter from "webrtc-adapter";

const mediaStreamConstraints = {
  video: true,
};
export default function CallPage() {
  const getUserMedia = async () => {
    try {
      let ms = await navigator.mediaDevices.getUserMedia(
        mediaStreamConstraints
      );
      document.querySelector("#my-stream").srcObject = ms;
    } catch {
      alert("No media Devices Found");
    }
  };
  return (
    <div>
      <button onClick={getUserMedia}>hello</button>
      <video id="my-stream" autoPlay playsInline></video>
      <video id="remoteVideo" autoPlay playsInline></video>
      <div>
        <button id="startButton">Start</button>
        <button id="callButton">Call</button>
        <button id="hangupButton">Hang Up</button>
      </div>
    </div>
  );
}
