import './App.css';
import 'typeface-roboto'

//react
import React, { Component } from 'react';
//react-router
import { BrowserRouter as Router, Switch, Route, Link, Redirection, Redirect } from 'react-router-dom';

//pages
import { openExternalUrl } from './services/Chromely.Service.js'; 
import Home from './components/Home';
import About from './components/About';



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


    showDevTools(event) {
        event.preventDefault();
        openExternalUrl("http://command.com/democontroller/showdevtools");
    }
}
