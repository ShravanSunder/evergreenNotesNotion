import React, { Component } from 'react';
import './Options.css';
import { render } from 'react-dom';

class Options extends Component {
   render() {
      return <div className="OptionsContainer">Options Page</div>;
   }
}

render(<Options />, window.document.querySelector('#app-container'));

export default Options;
