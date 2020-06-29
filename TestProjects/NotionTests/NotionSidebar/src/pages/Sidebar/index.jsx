import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import Sidebar from './Sidebar';
import './index.css';

const App = () => {
   // useEffect(() => {
   //   chrome.storage.sync.get(['darkMode'], (result) => {
   //     if (result.darkMode !== undefined) {
   //       setDarkModeSetting(result.darkMode);
   //     } else {
   //       setDarkModeSetting('auto');
   //     }
   //   });

   //   // sync settings across tabs
   //   chrome.runtime.onMessage.addListener((request, sender, response) => {
   //     if (
   //       request.from === 'background' &&
   //       request.msg === 'UPDATE_DARK_MODE_STATUS'
   //     ) {
   //       const { toStatus } = request;
   //       setDarkModeSetting(toStatus);
   //     }
   //   });
   // }, []);

   return (
      <React.Fragment>
         <div>sdjklfsjdfjs</div>
         <div>sdjklfsjdfjs</div>
      </React.Fragment>
   );
};

render(<App />, window.document.querySelector('#app-container'));
