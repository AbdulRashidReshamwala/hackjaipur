import React, { useState, useEffect } from "react";
import db from "../../utils/firebase";
import configuration from "../../utils/webRTCconfig";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallEndSharpIcon from '@material-ui/icons/CallEndSharp';
import CallSharpIcon from '@material-ui/icons/CallSharp';

const mediaStreamConstraints = {
  video: true,
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));


const CreatePage = () => {
  const [roomId, setRoomId] = useState();
  const [ peerConnection, setPeerConnection ] = useState();
  const [ roomCreated, setRoomCreated ] = useState(false)
  const classes = useStyles();


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
    setRoomCreated(true)
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
    <div >
      <Container maxWidth="lg" style={ { marginTop: '7rem',textAlign:'center' } }>
          {console.log(roomId)}
        { roomId ? (<Typography color='textSecondary' variant="h4">RoomID : { roomId } </Typography>) : (<></>) }
        <Button startIcon={<VideocamIcon/>} variant="contained" size="large" onClick={ getUserMedia } color="primary">
          Start Video
        </Button>
          <br/>
        <div className="video">
          <video id="my-stream" autoPlay playsInline></video>
          <video id="remoteVideo" autoPlay playsInline></video>
          </div>
        <div className={ classes.root }>
          { roomCreated ? (<></>) : (<Button onClick={ createOffer } size="large" variant="contained" color="primary">
            Create Room
          </Button>)}
          <Button startIcon={<CallSharpIcon/>} id="callButton" variant="contained" size="large" color="primary">
            Call
        </Button>
          <Button endIcon={<CallEndSharpIcon/>} id="hangupButton" variant="contained" size="large" color="secondary">
            Hang
        </Button>
      </div>
      </Container>
    </div>
  );
}

export default CreatePage

{/* <div style={ { margin: "5rem" } }>
  <h2>Room id { roomId ? roomId : "None" }</h2>
  <button onClick={ getUserMedia }>hello</button>
  <video id="my-stream" autoPlay playsInline></video>
  <video id="remoteVideo" autoPlay playsInline></video>
  <div>
    <button id="startButton" onClick={ createOffer }>
      Start
        </button>
    <button id="callButton">Call</button>
    <button id="hangupButton">Hang Up</button>
  </div>
</div> */}