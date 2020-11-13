import React, { useState, SyntheticEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, Slide } from '@material-ui/core';
import { useWindowSize } from '@react-hook/window-size';
import {
   appPositionTop,
   appPositionLeft,
   appWidth,
   appHeight,
   appScrollMargin,
} from './frameProperties';
import { SidebarFab } from './SidebarFab';
import { useDebouncedCallback } from 'use-debounce/lib';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render sidebar frame');
   chrome.extension.getURL('sidebar.html');

   ReactDOM.render(<LoadSidebarFrame />, sidebar);
};

const useStyles = makeStyles({
   imageIcon: {
      height: '100%',
   },
   iconRoot: {
      textAlign: 'center',
   },
});

var setUpdateNotionScroller:
   | React.Dispatch<React.SetStateAction<boolean>>
   | undefined = undefined;
var setUpdateSidebarContents:
   | React.Dispatch<React.SetStateAction<boolean>>
   | undefined = undefined;
export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');
   let classes = useStyles();

   const [wWidth, wHeight] = useWindowSize({ wait: 100 });
   const [showFrame, setShowFrame] = useState(false);
   const [wasDragging, setWasDragging] = useState(false);
   const [updateFrame, setUpdateFrame] = useState(false);
   const debouncedUpdateFrame = useDebouncedCallback(
      () => setUpdateFrame(true),
      200,
      {
         trailing: true,
         maxWait: 500,
      }
   );
   const debouncedSidebarContents = useDebouncedCallback(
      () => {
         let iframe = (document.getElementById(
            'evergreenNotesForNotion'
         ) as HTMLIFrameElement)?.contentWindow;
         if (iframe != null) {
            iframe?.postMessage('updateEvergreenSidebar', '*');
            console.log('send updateEvergreenSidebar message...');
         }
      },
      3000,
      {
         trailing: true,
         maxWait: 60000,
      }
   );

   useEffect(() => {
      setUpdateNotionScroller = debouncedUpdateFrame.callback;
      setUpdateSidebarContents = debouncedSidebarContents.callback;
      return () => {
         setUpdateNotionScroller = undefined;
         setUpdateSidebarContents = undefined;
      };
   }, []);

   useEffect(() => {
      modifyNotionFrameAndCreateListeners(showFrame, wWidth);
      setUpdateFrame(false);
   }, [wWidth, wHeight, showFrame, updateFrame]);

   const handleClick = (e: SyntheticEvent) => {
      console.log('evergreen launcher clicked');
      e.stopPropagation();
      if (!wasDragging) {
         setShowFrame(!showFrame);
      }
      setWasDragging(false);
   };
   const handleDrag = () => {
      setWasDragging(true);
   };

   return (
      <div>
         <SidebarFab
            wWidth={wWidth}
            showFrame={showFrame}
            handleClick={handleClick}
            handleDrag={handleDrag}></SidebarFab>
         <Slide in={showFrame} direction={'left'}>
            <iframe
               id="evergreenNotesForNotion"
               style={{
                  display: showFrame ? 'block' : 'none',
                  position: 'fixed',
                  top: appPositionTop(),
                  left: appPositionLeft(wWidth),
                  width: appWidth(wWidth),
                  height: appHeight(wHeight),
                  border: 0,
                  overflow: 'hidden',
               }}
               title="Evergreen Notes"
               src={url}></iframe>
         </Slide>
      </div>
   );
};

const styleChangedCallback = (mutations: MutationRecord[]) => {
   if (setUpdateNotionScroller != null) {
      setUpdateNotionScroller(true);
   }
};

const checkNodesForText = (nodes: NodeList): boolean => {
   for (let node of nodes) {
      if (node.nodeName === '#text') {
         return true;
      }
   }

   return false;
};

const checkForRemovedNodes = (nodes: NodeList): boolean => {
   for (let node of nodes) {
      let element = node as HTMLElement;
      if (
         element.attributes[0].name === 'data-block-id' &&
         element.classList.contains('notion-selectable')
      ) {
         return true;
      }
   }

   return false;
};

const contentChangedCallback = (mutations: MutationRecord[]) => {
   let hasChanged = mutations.some((m: MutationRecord) => {
      let result = false;

      if (m.type === 'characterData') {
         return true;
      } else if (m.type === 'childList') {
         // result = checkNodesForText(m.addedNodes);
         // if (result) return true;
         // result = checkNodesForText(m.removedNodes);
         // if (result) return true;
         //result = checkForRemovedNodes(m.removedNodes);
         //if (result) return true;
      }
      return result;
   });

   if (setUpdateSidebarContents != null && hasChanged) {
      setUpdateSidebarContents(true);
   }
};

const setContentChanged = () => {
   if (setUpdateSidebarContents != null) {
      setUpdateSidebarContents(true);
   }
};

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

var notionFrameBoundsObserver = new MutationObserver(styleChangedCallback);
var notionFrameContentObserver = new MutationObserver(contentChangedCallback);
const modifyNotionFrameAndCreateListeners = (
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
      notionFrameBoundsObserver.disconnect();
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
         // attributeFilter: ['style'],
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
