import React from 'react';
import ReactDOM from 'react-dom';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render');
   chrome.extension.getURL('sidebar.html');

   ReactDOM.render(<Sidebar />, sidebar);
};

export const Sidebar = () => {
   let url = chrome.extension.getURL('sidebar.html');

   return (
      <div>
         <iframe title="Notion Sidebar Extension" src={url}></iframe>
      </div>
   );
};
