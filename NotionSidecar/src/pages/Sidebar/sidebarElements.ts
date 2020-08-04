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

   let newApp = document.createElement('div');
   document.body.appendChild(newApp);

   let sidebarRoot = document.createElement('div');
   sidebarRoot.setAttribute('id', notionSidebarRootId);
   newRoot.appendChild(sidebarRoot);
   newRoot.appendChild(newApp);
   newApp.appendChild(notionApp);

   sidebarRoot.style.position = 'absolute';
   sidebarRoot.style.zIndex = '5000';
   newApp.style.position = 'absolute';
   // newRoot.setAttribute(
   //    'style',
   //    `display:inline-flex; flex-wrap: nowrap; justify-content: flex-start;`
   // );

   //window.onresize = () => adjustSidebarWidth(notionApp);
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
      let nNavHeight = Math.round(notionNav.getBoundingClientRect().height);

      //sidebarRoot
      // let sidebarWidth = Math.max(Math.round(wWidth * 0.25) - 10, 315);
      // let newFrameWidth = wWidth - nNavWidth - sidebarWidth;
      // let newAppWidth = newFrameWidth + nNavWidth + 10;

      //Todo add a obeserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
      //notionFrame.style.maxWidth = `${newFrameWidth}px`;
      // notionContentScroller.style.maxWidth = `${newFrameWidth}px`;
      // [...notionInnerAppCollection].forEach((element) => {
      //    let e = element as HTMLElement;
      //    e.style.maxWidth = `${newAppWidth}px`;
      // });
      //notionApp.style.maxWidth = `${newAppWidth}px`;
      // sidebarRoot.style.position = 'absolute';
      // sidebarRoot.style.zIndex = '100000';
      //dragElement(sidebarRoot);
      // sidebarRoot.style.height = `${nNavHeight}px`;
      // sidebarRoot.style.width = `${sidebarWidth}px`;
      // sidebarRoot.style.maxWidth = `${sidebarWidth}px`;
      // sidebarRoot.style.display = 'flex';
      // sidebarRoot.style.flexWrap = 'nowrap';
      // sidebarRoot.style.justifyContent = 'flex-start';
   }
}

function dragElement(elmnt: HTMLElement) {
   let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

   elmnt.onmousedown = dragMouseDown;

   function dragMouseDown(e: MouseEvent) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
   }

   function elementDrag(e: MouseEvent) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
      elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
   }

   function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
   }
}
