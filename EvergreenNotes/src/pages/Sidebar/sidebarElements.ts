import { notionSidebarRootId } from '../Content/content';

export const notionFrameClass = 'notion-frame';
export const notionScrollerClass = 'notion-scroller';
export const notionNavClass = 'notion-sidebar-container';
export const notionBaseNewRootId = 'new-app-root';
export const notionAppInnerClass = 'notion-app-inner';

export const createNewRootElement = (notionApp: HTMLElement) => {
   let newRoot = document.createElement('div');
   document.body.appendChild(newRoot);
   newRoot.setAttribute('id', notionBaseNewRootId);

   let newApp = document.createElement('div');
   document.body.appendChild(newApp);

   let sidebarRoot = document.createElement('div');
   sidebarRoot.setAttribute('id', notionSidebarRootId);
   newRoot.appendChild(sidebarRoot);
   newRoot.appendChild(newApp);
   newApp.appendChild(notionApp);

   sidebarRoot.style.position = 'absolute';
   sidebarRoot.style.zIndex = '100';
   newApp.style.position = 'absolute';
};
