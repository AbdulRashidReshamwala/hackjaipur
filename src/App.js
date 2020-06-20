import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CallPage from "./Pages/Call/CallPage";
import CreatePage from "./Pages/Create/CreatePage";
import LandingPage from './Pages/LandingPage/LandingPage'
import Navbar from "./Core/Navbar";
import Login from "./AuthPages/Login";


function App() {
  return (
    <div>
      <Router>
        <Navbar/>
        <Switch>
          <Route path="/create">
            <CreatePage />
          </Route>
          <Route path="/call">
            <CallPage />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
          <Route exact path="/login" component={ Login }/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
