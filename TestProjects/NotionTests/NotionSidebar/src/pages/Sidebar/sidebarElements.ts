import { notionSidebarRootId } from '../Content/content';

export const notionFrameClass = 'notion-frame';
export const notionScrollerClass = 'notion-scroller';
export const notionNavClass = 'notion-sidebar-container';
export const notionBaseNewRootId = 'new-app-root';
export const notionAppInnerClass = 'notion-app-inner';

export const toggleSidebar = () => {};
export const createNewRootElement = (notionApp: HTMLElement) => {
   let newRoot = document.createElement('div');
   document.body.appendChild(newRoot);
   newRoot.setAttribute('id', notionBaseNewRootId);

   let sidebarRoot = document.createElement('div');
   sidebarRoot.setAttribute('id', notionSidebarRootId);
   newRoot.appendChild(notionApp);
   newRoot.appendChild(sidebarRoot);
   newRoot.setAttribute(
      'style',
      `display:inline-flex; flex-wrap: nowrap; justify-content: flex-start;`
   );

   window.onresize = () => adjustSidebarWidth(notionApp);
};
export function adjustSidebarWidth(notionApp: HTMLElement) {
   let newRoot = document.getElementById(notionBaseNewRootId);
   let sidebarRoot = document.getElementById(notionSidebarRootId);
   let notionFrame = document.getElementsByClassName(
      notionFrameClass
   )[0] as HTMLElement;
   let notionNav = document.getElementsByClassName(
      notionNavClass
   )[0] as HTMLElement;
   let notionContentScroller = notionFrame.getElementsByClassName(
      notionScrollerClass
   )[0] as HTMLElement;
   let notionInnerAppCollection = [
      ...document.getElementsByClassName(notionAppInnerClass)[0].children,
   ];

   if (
      newRoot &&
      sidebarRoot &&
      notionApp &&
      notionFrame &&
      notionContentScroller
   ) {
      let wWidth = window.innerWidth;
      let nNavWidth = Math.round(notionNav.getBoundingClientRect().width);

      let sidebarWidth = Math.round(wWidth * 0.25) - 10;
      let newFrameWidth = wWidth - nNavWidth - sidebarWidth;
      let newAppWidth = newFrameWidth + nNavWidth + 10;

      //Todo add a obeserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
      notionFrame.style.maxWidth = `${newFrameWidth}px`;
      // notionContentScroller.style.maxWidth = `${newFrameWidth}px`;
      // [...notionInnerAppCollection].forEach((element) => {
      //    let e = element as HTMLElement;
      //    e.style.maxWidth = `${newAppWidth}px`;
      // });
      //notionApp.style.maxWidth = `${newAppWidth}px`;

      sidebarRoot.style.width = `${sidebarWidth}px`;
      sidebarRoot.style.maxWidth = `${sidebarWidth}px`;
      sidebarRoot.style.display = 'flex';
      sidebarRoot.style.flexWrap = 'nowrap';
      sidebarRoot.style.justifyContent = 'flex-start';
   }
}
