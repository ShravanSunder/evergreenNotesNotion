import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reduxStore from 'Sidebar/reduxStore';

export const App = () => {
   return (
      <Provider store={reduxStore}>
         <div>sdjklfsjdfjs</div>;
      </Provider>
   );
};

render(<App />, window.document.querySelector('#app-container'));

// chrome.runtime.onMessage.addListener(async function (
//    request,
//    sender,
//    sendResponse
// ) {
//    if (request.command === commands.receivedCookies) {
//       console.log('received cookies', request.notionCookies);
//       var data = await superagent
//          .post('https://www.notion.so/api/v3/search')
//          .set(
//             'x-notion-active-user-header',
//             '79888584-c56f-4b10-9e82-9411c5793cfa'
//          )
//          //.set('Cookie', request.notionCookies)
//          .send({
//             type: 'BlocksInSpace',
//             query: 'search',
//             spaceId: '8c4bb92b-8b88-4caa-9168-93ebe20f619c',
//             limit: 20,
//             filters: {
//                isDeletedOnly: false,
//                excludeTemplates: false,
//                isNavigableOnly: false,
//                requireEditPermissions: false,
//                ancestors: [],
//                createdBy: [],
//                editedBy: [],
//                lastEditedTime: {},
//                createdTime: {},
//             },
//             sort: 'Relevance',
//             source: 'quick_find',
//          });
//       console.log(data);
//    }
// });
