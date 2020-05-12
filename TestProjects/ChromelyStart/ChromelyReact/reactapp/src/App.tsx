import 'typeface-roboto'

//react
import React, { Component, SyntheticEvent } from 'react';
//react-router
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

//pages
import { openExternalUrl } from './services/Chromely.Service.js'; 
import { Home } from './components/Home';




const App: React.FC = () => (
  <Router>
      <div>
          <Switch>
                <Route exact path='/' component={Home} />
                <Route path="*" component={Home} />
          </Switch>
      </div>
  </Router>
);


export function showDevTools(event: SyntheticEvent) {
    event.preventDefault();
    openExternalUrl("http://command.com/democontroller/showdevtools");
}

export default App;
