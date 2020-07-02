import React from 'react';
import { render } from 'react-dom';

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

render(<App />, window.document.querySelector('#app-container'));
