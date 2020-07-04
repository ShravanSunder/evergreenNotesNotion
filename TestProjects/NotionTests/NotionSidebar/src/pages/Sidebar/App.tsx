import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reduxStore from 'aSidebar/reduxStore';
import { commands } from 'aCommon/commands';
import { extractUserData } from 'aNotion/notionCookies';
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
   let tab = await getCurrentTab();
   chrome.runtime.sendMessage({
      command: commands.fetchCookies,
      tabId: tab?.id,
   });
};

render(<App />, window.document.querySelector('#app-container'));

// // chrome.runtime.onMessage.addListener(async function (
// //    request,
// //    sender,
// //    sendResponse
// // ) {
// //    if (request.command === commands.receivedCookies) {
// //       console.log('received cookies', request.notionCookies);
// //       var data = await superagent
// //          .post('https://www.notion.so/api/v3/search')
// //          .set(
// //             'x-notion-active-user-header',
// //             '79888584-c56f-4b10-9e82-9411c5793cfa'
// //          )
// //          //.set('Cookie', request.notionCookies)
// //          .send({
// //             type: 'BlocksInSpace',
// //             query: 'search',
// //             spaceId: '8c4bb92b-8b88-4caa-9168-93ebe20f619c',
// //             limit: 20,
// //             filters: {
// //                isDeletedOnly: false,
// //                excludeTemplates: false,
// //                isNavigableOnly: false,
// //                requireEditPermissions: false,
// //                ancestors: [],
// //                createdBy: [],
// //                editedBy: [],
// //                lastEditedTime: {},
// //                createdTime: {},
// //             },
// //             sort: 'Relevance',
// //             source: 'quick_find',
// //          });
// //       console.log(data);
// //    }
// // });
