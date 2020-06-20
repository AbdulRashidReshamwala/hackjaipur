import React, { useState, useEffect } from "react";
import db from "../../utils/firebase";
import configuration from "../../utils/webRTCconfig";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import VideocamIcon from '@material-ui/icons/Videocam';
import CallEndSharpIcon from '@material-ui/icons/CallEndSharp';
import CallSharpIcon from '@material-ui/icons/CallSharp';
import TextField from '@material-ui/core/TextField';

let peerConnection = null
let remoteStream = null
let localStream = null

const registerPeerConnectionListeners = () => {
  console.log("I am called !!")
  peerConnection.addEventListener('icegatheringstatechange', () => {
    console.log(
      `ICE gathering state changed: ${peerConnection.iceGatheringState}`,
    )
  })

  peerConnection.addEventListener('connectionstatechange', () => {
    console.log(`Connection state change: ${peerConnection.connectionState}`)
  })

  peerConnection.addEventListener('signalingstatechange', () => {
    console.log(`Signaling state change: ${peerConnection.signalingState}`)
  })

  peerConnection.addEventListener('iceconnectionstatechange ', () => {
    console.log(
      `ICE connection state change: ${peerConnection.iceConnectionState}`,
    )
  })
}

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
  const [ roomId, setRoomId ] = useState();
  const [ roomById, setRoomById ] = useState()
  //const [ peerConnection, setPeerConnection ] = useState();
  const [ roomCreated, setRoomCreated ] = useState(false)
  const classes = useStyles();


  const joinRoomById = async (roomId) => {
    const roomRef = await db.collection('rooms').doc(`${roomId}`).get()
    console.log("This is roomID", roomId)
    console.log("Room Ref:", roomRef)
    // const roomSnapshot = await roomRef.get()
    console.log('Got room:', roomRef.exists)

    if (roomRef.exists) {
      console.log('Create PeerConnection with configuration: ', configuration)
      peerConnection = new RTCPeerConnection(configuration)
      registerPeerConnectionListeners()
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })

      peerConnection.addEventListener('track', (event) => {
        console.log('Got remote track:', event.streams[ 0 ])
        event.streams[ 0 ].getTracks().forEach((track) => {
          console.log('Add a track to the remoteStream:', track)
          remoteStream.addTrack(track)
        })
      })

    }
  }

  useEffect(() => {
    let c = new RTCPeerConnection(configuration);
    console.log(c);
    peerConnection = c
    //registerPeerConnectionListeners()
  }, []);

  const getUserMedia = async () => {
    try {
      let ms = await navigator.mediaDevices.getUserMedia(
        mediaStreamConstraints
      );
      document.querySelector("#my-stream").srcObject = ms;
      localStream = ms
      remoteStream =MediaStream()
      console.log(remoteStream)
      document.querySelector('#remoteVideo').srcObject = remoteStream
      console.log('Stream:', document.querySelector('#localVideo').srcObject)
    } catch {
      alert("No media Devices Found");
    }
  };

  const handleRoomChange = (e) => {
    console.log(e.target.value)
    setRoomById(e.target.value)
  }

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
      <Container maxWidth="lg" style={ { marginTop: '7rem', textAlign: 'center' } }>
        { roomId ? (<Typography color='textSecondary' variant="h4">RoomID : { roomId } </Typography>) : (<></>) }
        <Button startIcon={ <VideocamIcon /> } variant="contained" size="large" onClick={ getUserMedia } color="primary">
          Start Video
        </Button>
        <br />
        <div className="video">
          <video id="my-stream" autoPlay playsInline></video>
          <video id="remoteVideo" autoPlay playsInline></video>
        </div>
        <div className={ classes.root }>
          { roomCreated ? (<></>) : (<Button onClick={ createOffer } size="large" variant="contained" color="primary">
            Create Room
          </Button>) }
          <Button startIcon={ <CallSharpIcon /> } id="callButton" variant="contained" size="large" color="primary">
            Call
        </Button>

          <Button endIcon={ <CallEndSharpIcon /> } id="hangupButton" variant="contained" size="large" color="secondary">
            Hang
        </Button>
          <br />
          <TextField id="standard-basic" label="Enter Room ID" onChange={ (e) => {
            handleRoomChange(e)
          } } />
          <Button onClick={ () => {
            joinRoomById(roomById)
          } } id="callButton" variant="contained" size="large" color="primary">
            Join Room
        </Button>
        </div>
      </Container>
    </div>
  );
}

export default CreatePage

