import React, { useState, useEffect } from "react";
import db from "../../utils/firebase";
import adapter from "webrtc-adapter";
import configuration from "../../utils/webRTCconfig";

const mediaStreamConstraints = {
  video: true,
};

export default function CreatePage() {
  const [roomId, setRoomId] = useState();
  const [peerConnection, setPeerConnection] = useState();

  useEffect(() => {
    let c = new RTCPeerConnection(configuration);
    console.log(c);
    setPeerConnection(c);
  }, []);

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

  const createOffer = async () => {
    // registerPeerConnectionListeners();

    const offer = await peerConnection.createOffer();
    console.log(offer);

    await peerConnection.setLocalDescription(offer);

    const roomWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    const roomRef = await db.collection("rooms").add(roomWithOffer);
    setRoomId(roomRef.id);
  };
  return (
    <div style={{ margin: "5rem" }}>
      <h2>Room id {roomId ? roomId : "None"}</h2>
      <button onClick={getUserMedia}>hello</button>
      <video id="my-stream" autoPlay playsInline></video>
      <video id="remoteVideo" autoPlay playsInline></video>
      <div>
        <button id="startButton" onClick={createOffer}>
          Start
        </button>
        <button id="callButton">Call</button>
        <button id="hangupButton">Hang Up</button>
      </div>
    </div>
  );
}
