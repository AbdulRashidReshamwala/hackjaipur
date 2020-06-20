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
  peerConnection.addEventListener('icegatheringstatechange', (e) => {
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


  const joinRoomById = async (roomId)=> {
    const roomRef = db.collection('rooms').doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
    console.log("This is roomID", roomId) 
    console.log("Room Ref:", roomSnapshot)
    console.log('Got room:', roomSnapshot.exists)

    if (roomSnapshot.exists) {
      console.log('Create PeerConnection with configuration: ', configuration)
      peerConnection = new RTCPeerConnection(configuration)
      registerPeerConnectionListeners()
      

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
      })

      /// Code for collecting ICE candidates below
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above

      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[ 0 ]);
        event.streams[ 0 ].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
        });
      });

      // Code for creating SDP answer below
      const offer = roomSnapshot.data().offer;
      console.log('Got offer:', offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      console.log('Created answer:', answer);
      await peerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await roomRef.update(roomWithAnswer);
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    // Listening for remote ICE candidates above
    }
    }

  useEffect(() => {
    let c = new RTCPeerConnection(configuration);
    console.log(c);
    peerConnection=c
  }, []);

  const getUserMedia = async () => {
    try {
      let ms = await navigator.mediaDevices.getUserMedia(
        mediaStreamConstraints
      );
      document.querySelector("#my-stream").srcObject = ms;
      localStream = ms
      remoteStream = new MediaStream()
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
    const roomRef = await db.collection('rooms').doc();

    // Code for collecting ICE candidates below
    const callerCandidatesCollection = roomRef.collection('callerCandidates');

    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      callerCandidatesCollection.add(event.candidate.toJSON());
    });
  // Code for collecting ICE candidates above
    
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
    const roomRefs = await db.collection("rooms").add(roomWithOffer);
    setRoomId(roomRefs.id);

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[ 0 ]);
      event.streams[ 0 ].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Listening for remote session description below
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  // Listen for remote ICE candidates above
  };
  return (
    <div >
      <Container maxWidth="lg" style={ { marginTop: '7rem',textAlign:'center' } }>
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
          <br />
          <TextField id="standard-basic" label="Enter Room ID" onChange={ (e) => {
            handleRoomChange(e)
          }} />
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

