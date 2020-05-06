import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import { openExternalUrl } from './services/Chromely.Service.js'; 

export default class App extends Component {
  constructor(props) {
    super(props);

    this.showDevTools = this.showDevTools.bind(this);
  }


  render() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path="*" component={Home} />
                </Switch>
            </div>
            <div className="dropdown-item">
                <Link to={'/showDevTools'} className="nav-link" onClick={this.showDevTools}>Show DevTools Remote</Link>
                <Link to={'/showDevTools'} className="nav-link" onClick={this.showDevTools}>Show DevTools Remote</Link>
            </div>
        </Router>
    );
  }
}

showDevTools(event) {
    event.preventDefault();
    openExternalUrl("http://command.com/democontroller/showdevtools");
}
