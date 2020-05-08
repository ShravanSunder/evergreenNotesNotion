import './App.css';
import 'typeface-roboto'

//react
import React, { Component, SyntheticEvent } from 'react';
//react-router
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

//pages
import { openExternalUrl } from './services/Chromely.Service.js'; 
import Home from './components/Home';
import About from './components/About';




const App: React.FC = () => (
  <Router>
      <div>
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path="*" component={Home} />
          </Switch>
      </div>
      <div className="dropdown-item">
          <Link to={'/showDevTools'} className="nav-link" onClick={showDevTools}>Show DevTools Remote</Link>
      </div>
  </Router>
);


export function showDevTools(event: SyntheticEvent) {
    event.preventDefault();
    openExternalUrl("http://command.com/democontroller/showdevtools");
}

export default App;
