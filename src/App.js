import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AboutPage from "./Pages/About/AboutPage";
import CallPage from "./Pages/Call/CallPage";
import CreatePage from "./Pages/Create/CreatePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/create">
          <CreatePage />
        </Route>
        <Route path="/call">
          <CallPage />
        </Route>
        <Route path="/">
          <AboutPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
