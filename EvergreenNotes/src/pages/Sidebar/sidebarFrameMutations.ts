import { appWidth, appScrollMargin } from 'aSidebar/sidebarFrameProperties';
import {
   styleChangedCallback,
   contentChangedCallback,
   setContentChanged,
   notionFrameContentObserver,
   notionFrameBoundsObserver,
} from 'aSidebar/SidebarFrame';
import {
   postMessageToSidebar,
   EvergreenMessagingEnum,
} from './sidebarMessaging';

const notionScrollDivClass = 'notion-scroller';
const notionFrameClass = 'notion-frame';
const notionAppId = 'notion-app';
const notionSidebarClass = 'notion-sidebar-container';
const notionCollectionScrollersClass =
   'notion-selectable notion-collection_view-block';
const notionFocusPageDialogParentClass = 'notion-peek-renderer';

const getNotionScroll = () => {
   let notionApp = document.getElementById(notionAppId) as HTMLElement;
   let notionSidebar = notionApp?.getElementsByClassName(
      notionSidebarClass
   )?.[0] as HTMLElement;
   let notionframe = notionApp?.getElementsByClassName(
      notionFrameClass
   )?.[0] as HTMLElement;
   let notionScrollDiv = notionframe?.getElementsByClassName(
      notionScrollDivClass
   )?.[0] as HTMLElement;
   let isExpectedChild = notionScrollDiv?.parentElement === notionframe;
   return { isExpectedChild, notionScrollDiv, notionframe, notionSidebar };
};

export const modifyNotionFrameAndCreateListeners = (
   showFrame: boolean,
   wWidth: number
) => {
   let {
      isExpectedChild,
      notionScrollDiv,
      notionframe,
      notionSidebar,
   } = getNotionScroll();

   if (isExpectedChild && notionScrollDiv != null) {
      notionScrollDiv.removeEventListener('keypress', setContentChanged);

      notionFrameContentObserver.disconnect();
      notionFrameContentObserver.disconnect();
      setFrameWidth(showFrame, notionScrollDiv, wWidth, notionSidebar);

      notionScrollDiv.addEventListener('keypress', setContentChanged);

      notionFrameBoundsObserver.observe(notionframe, {
         childList: true,
         subtree: false,
         attributes: true,
         attributeFilter: ['style'],
      });
      notionFrameBoundsObserver.observe(notionScrollDiv, {
         childList: false,
         subtree: false,
         attributes: true,
         attributeFilter: ['style'],
      });
      notionFrameContentObserver.observe(notionScrollDiv, {
         childList: true,
         subtree: true,
         characterData: true,
         attributes: false,
      });
   }
};

const setFrameWidth = (
   showFrame: boolean,
   notionScrollDiv: HTMLElement,
   wWidth: number,
   notionSidebar: HTMLElement
) => {
   let notionApp = document.getElementById(notionAppId) as HTMLElement;
   const sidebarWidth = notionSidebar?.getBoundingClientRect()?.width ?? 0;
   const frameWidth =
      wWidth - appWidth(wWidth) - appScrollMargin - sidebarWidth;

   if (showFrame) {
      notionScrollDiv.style.width = frameWidth.toString() + 'px';
      [
         ...notionScrollDiv.getElementsByClassName(
            notionCollectionScrollersClass
         ),
      ].forEach(
         (f) => ((f as HTMLElement).style.maxWidth = frameWidth - 9 + 'px')
      );

      setNotionDialogMargin(notionApp, wWidth);
   } else {
      notionScrollDiv.style.width = wWidth - sidebarWidth + 'px';
      [
         ...notionScrollDiv.getElementsByClassName(
            notionCollectionScrollersClass
         ),
      ].forEach((f) => ((f as HTMLElement).style.maxWidth = ''));

      const dialogElements = notionApp.getElementsByClassName(
         notionFocusPageDialogParentClass
      ) as HTMLCollection;
      if ((dialogElements?.[0]?.children?.[1] as HTMLElement)?.style != null) {
         (dialogElements[0].children[1] as HTMLElement).style.marginRight =
            'auto';
      }
   }
};

const setNotionDialogMargin = (notionApp: HTMLElement, wWidth: number) => {
   const dialogElements = notionApp.getElementsByClassName(
      notionFocusPageDialogParentClass
   ) as HTMLCollection;
   if ((dialogElements?.[0]?.children?.[1] as HTMLElement)?.style != null) {
      (dialogElements[0].children[1] as HTMLElement).style.marginRight =
         appWidth(wWidth) + 'px';
   }
};

export const checkDomForNotionFrameChanges = (
   setUpdate: React.Dispatch<React.SetStateAction<boolean>> | undefined
) => {
   if (setUpdate == null) return;

   let notionApp = document.getElementById(notionAppId) as HTMLElement;
   const dialogElements = notionApp.getElementsByClassName(
      notionFocusPageDialogParentClass
   ) as HTMLCollection;

   if (dialogElements != null) {
      setUpdate(true);
   }
};

let hasDarkModeEnabled = false;
export const checkAndSendDarkModeStatus = () => {
   const isDark: boolean = document.body.classList.contains('dark') ?? false;

   if (hasDarkModeEnabled != isDark) {
      hasDarkModeEnabled = isDark;

      postMessageToSidebar({
         type: EvergreenMessagingEnum.darkModeChanged,
         payload: isDark,
      });
   }
};
