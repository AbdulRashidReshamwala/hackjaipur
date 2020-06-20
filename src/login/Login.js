import React from "react";
import styles from "./Login.module.css";

import { CssBaseline, Paper, Typography, Button } from "@material-ui/core";
const firebase = require("firebase");

export default class Login extends React.Component {
  render() {
    return (
      <div className={styles.Container}>
        <CssBaseline></CssBaseline>
        <Paper>
          <Typography component="h5" variant="h6" className={styles.heading}>
            Log In
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.signinWithGoogle()}
            className={styles.button}
          >
            Log In With Google
          </Button>
        </Paper>
      </div>
    );
  }

  signinWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        console.log("user signed in");
      })
      .catch(function (error) {
        var email = error.email;

        var credential = error.credential;
        console.log(email, credential);
      });
  };
}
