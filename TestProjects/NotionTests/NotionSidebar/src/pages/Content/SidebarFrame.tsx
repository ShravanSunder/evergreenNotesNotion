import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../Sidebar/sidebar';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render');
   chrome.extension.getURL('sidebar.html');

   ReactDOM.render(<LoadSidebarFrame />, sidebar);
};

export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');

   return (
      <div>
         <iframe title="Notion Sidebar Extension" src={url}></iframe>
      </div>
   );
};
