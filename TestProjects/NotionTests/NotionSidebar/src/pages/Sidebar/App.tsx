import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import reduxStore from 'aNotion/redux/reduxStore';
import { commands } from 'aCommon/commands';
import { getCurrentTab } from 'aCommon/extensionHelpers';
import { Layout } from 'aNotion/components/Layout';

export const App = () => {
   useEffect(() => {
      fetchCookies();
   }, []);

   return (
      <Provider store={reduxStore}>
         <Layout />
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
