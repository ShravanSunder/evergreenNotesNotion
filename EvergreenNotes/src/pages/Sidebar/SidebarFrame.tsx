import React, { useState, SyntheticEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { makeStyles, Slide } from '@material-ui/core';
import { useWindowSize } from '@react-hook/window-size';
import {
   appPositionTop,
   appPositionLeft,
   appWidth,
   appHeight,
} from 'aSidebar/frameProperties';
import { SidebarFab } from 'aSidebar/SidebarFab';
import { useDebouncedCallback } from 'use-debounce/lib';
import {
   checkDomForNotionFrameChanges,
   modifyNotionFrameAndCreateListeners,
} from 'aSidebar/sidebarFrameMutations';
import { registerNavigateMessageHandler } from 'aSidebar/sidebarMessaging';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render sidebar frame');
   chrome.extension.getURL('sidebar.html');
   registerNavigateMessageHandler();

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

let setUpdateNotionFramesAndScroller:
   | React.Dispatch<React.SetStateAction<boolean>>
   | undefined = undefined;
let setUpdateSidebarContents:
   | React.Dispatch<React.SetStateAction<boolean>>
   | undefined = undefined;
let href = '';

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
            iframe?.postMessage('updateEvergreenSidebarData', '*');
         }
      },
      3000,
      {
         trailing: true,
         maxWait: 60000,
      }
   );

   useEffect(() => {
      setUpdateNotionFramesAndScroller = debouncedUpdateFrame.callback;
      setUpdateSidebarContents = debouncedSidebarContents.callback;

      const schedule = () => {
         if (window.location.href !== href) {
            checkDomForNotionFrameChanges(setUpdateNotionFramesAndScroller);
         }
         setTimeout(() => schedule(), 2000);
      };

      schedule();

      return () => {
         setUpdateNotionFramesAndScroller = undefined;
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

export const styleChangedCallback = (mutations: MutationRecord[]) => {
   if (setUpdateNotionFramesAndScroller != null) {
      setUpdateNotionFramesAndScroller(true);
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

export const contentChangedCallback = (mutations: MutationRecord[]) => {
   let hasChanged = mutations.some((m: MutationRecord) => {
      let result = false;

      if (m.type === 'characterData') {
         return true;
      } else if (m.type === 'childList') {
      }
      return result;
   });

   if (setUpdateSidebarContents != null && hasChanged) {
      setUpdateSidebarContents(true);
   }
};

export const setContentChanged = () => {
   if (setUpdateSidebarContents != null) {
      setUpdateSidebarContents(true);
   }
};

export let notionFrameBoundsObserver = new MutationObserver(
   styleChangedCallback
);
export let notionFrameContentObserver = new MutationObserver(
   contentChangedCallback
);
