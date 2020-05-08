//react
import React, { Component } from 'react';
//react-router
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => (
  <Router>
      <div>
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path="*" component={Home} />
          </Switch>
      </div>
      <div className="dropdown-item">
          <Link to={'/showDevTools'} className="nav-link" onClick={this.showDevTools}>Show DevTools Remote</Link>
      </div>
  </Router>
);

export default App;
