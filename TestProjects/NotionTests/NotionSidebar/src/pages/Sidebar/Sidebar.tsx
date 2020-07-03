import React from 'react';
import { render } from 'react-dom';
import { msgTypes } from '../Common/msgTypes';

///////////////

export const App = () => {
   // getCurrentCookies();
   //console.log(document.cookies);
   return (
      <React.Fragment>
         <div>sdjklfsjdfjs</div>
         <div>sdjklfsjdfjs</div>
      </React.Fragment>
   );
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
   if (request.msgType === msgTypes.cookies) {
      console.log('received cookies', request.notionCookies);
   }
});

render(<App />, window.document.querySelector('#app-container'));
