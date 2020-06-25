import "typeface-roboto";

//react
import React, { Component, SyntheticEvent } from "react";
//react-router
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

//pages
import { Home } from "./components/Home";

const App: React.FC = () => {
  setupApiPath();

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="*" component={Home} />
        </Switch>
      </div>
    </Router>
  );
};

const setupApiPath = () => {
  if (__CONFIG__.chromely === true) {
    window.vPath = "http://trak-chromely.com/";
  } else {
    window.vPath = "https://localhost:44381/";
  }
};

export default App;
