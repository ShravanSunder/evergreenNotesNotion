import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reduxStore from 'aNotion/redux/reduxStore';
import { commands } from 'aCommon/commands';
import { extractUserData } from 'aNotion/services/notionCookies';
import { getCurrentTab } from 'aCommon/extensionHelpers';

export const App = () => {
   useEffect(() => {
      fetchCookies();
   }, []);

   return (
      <Provider store={reduxStore}>
         <div>sdjklfsjdfjs</div>;
      </Provider>
   );
};

const fetchCookies = async () => {
   let tab = await getCurrentTab()!;
   chrome.runtime.sendMessage({
      command: commands.fetchCookies,
      tabId: tab.id,
   });
};

render(<App />, window.document.querySelector('#app-container'));
