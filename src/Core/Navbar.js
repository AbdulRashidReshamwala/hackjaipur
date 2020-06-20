import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
const firebase = require("firebase");

//import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    color: "white",
    flexGrow: 1,
  },
  menuButton: {
    color: "white",
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  let history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const classes = useStyles();

  const signinWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        console.log("user signed in");
        history.push("/create");
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        alert("Unsucessfull");
      });
  };

  const signOut = () => {
    var user = firebase.auth().currentUser;
    if (user) {
      // User is signed in.
      firebase
        .auth()
        .signOut()
        .then(function () {
          // Sign-out successful.
          console.log("signed out");
          setIsLoggedIn(false);
        })
        .catch(function (error) {
          // An error happened.
          console.log(error);
        });
    } else {
      // No user is signed in.
      console.log("no users");
    }
  };

  return (
    <div className={classes.root}>
      <AppBar color="primary" position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Typography
            style={{ cursor: "pointer" }}
            onClick={() => <Redirect to="/" />}
            variant="h6"
            className={classes.title}
          >
            Dhoom
          </Typography>
          {!isLoggedIn ? (
            <Button color="inherit" onClick={signinWithGoogle}>
              {" "}
              Login
            </Button>
          ) : (
            <Button color="inherit" onClick={signOut}>
              {" "}
              Sign out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
