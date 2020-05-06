import React, { Component } from 'react';
import { messageRouterGet } from '../services/Chromely.Service.js';


class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
        chromelyOjective: '',
        chromelyPlatform: '',
        chromelyVersion: ''
      };
  }

  render() {

    const { chromelyOjective } = this.state;
    const { chromelyPlatform } = this.state;
    const { chromelyVersion } = this.state;

      return (
          <div> </div>

    );
  }
}

export default Home;