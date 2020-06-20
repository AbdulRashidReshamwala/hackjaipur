import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

const firebase = require("firebase");
require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyAfGZjND6kgA3Sx7G9OYhnLRFdwjeeWXPc",
  authDomain: "hackjaipur-95690.firebaseapp.com",
  databaseURL: "https://hackjaipur-95690.firebaseio.com",
  projectId: "hackjaipur-95690",
  storageBucket: "hackjaipur-95690.appspot.com",
  messagingSenderId: "973190574578",
  appId: "1:973190574578:web:17f219227b1e074381fb6b",
  measurementId: "G-2JMTF41WH3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
