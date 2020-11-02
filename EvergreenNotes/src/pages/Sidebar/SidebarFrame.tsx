import React, { useState, SyntheticEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
   makeStyles,
   Icon,
   SvgIcon,
   Zoom,
   Fade,
   Slide,
} from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import { useWindowSize } from '@react-hook/window-size';
import { green } from '@material-ui/core/colors';
import {
   appPositionTop,
   appPositionLeft,
   appWidth,
   appHeight,
   appScrollMargin,
} from './frameProperties';
import { SidebarFab } from './SidebarFab';
import { useDebounce, useDebouncedCallback } from 'use-debounce/lib';

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
         maxWait: 1000,
      }
   );

   useEffect(() => {
      setUpdateNotionScroller = debouncedUpdateFrame.callback;
      return () => {
         setUpdateNotionScroller = undefined;
      };
   }, []);

   useEffect(() => {
      if (updateFrame) {
         setUpdateFrame(false);
      }
   }, [updateFrame]);

   useEffect(() => {
      modifyNotionFrame(showFrame, wWidth);
      setUpdateFrame(false);
      console.log('updated frame');
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
   // let record = mutations.find((f) =>
   //    (f.removedNodes?.[0] as HTMLElement)?.classList?.contains(
   //       'notion-scroller'
   //    )
   // );

   // if (record != null && setUpdateNotionScroller != null) {
   //    setUpdateNotionScroller(true);
   //    //setMarginRight(record);
   // }
};

// const setMarginRight = (record: MutationRecord) => {
//    const oldNotionScroller = record.removedNodes[0] as HTMLElement;
//    if (oldNotionScroller.classList.contains('notion-scroller')) {
//       let { notionScrollDiv: newNotionScrollDiv } = getNotionScroll();

//       if (oldNotionScroller != null && newNotionScrollDiv != null) {
//          newNotionScrollDiv.style.marginRight =
//             oldNotionScroller.style.marginRight;
//       }
//    }
// };

const notionScrollDivClass = 'notion-scroller';
const notionFrameClass = 'notion-frame';
const notionAppId = 'notion-app';
var observer = new MutationObserver(styleChangedCallback);
const modifyNotionFrame = (showFrame: boolean, wWidth: number) => {
   let { isExpectedChild, notionScrollDiv, notionframe } = getNotionScroll();

   if (isExpectedChild && notionScrollDiv != null) {
      observer.disconnect();
      setFrameMargin(showFrame, notionScrollDiv, wWidth);
      observer.observe(notionframe, {
         childList: true,
      });
   }
};

const getNotionScroll = () => {
   let notionApp = document.getElementById(notionAppId) as HTMLElement;
   let notionframe = notionApp?.getElementsByClassName(
      notionFrameClass
   )?.[0] as HTMLElement;
   let notionScrollDiv = notionframe?.getElementsByClassName(
      notionScrollDivClass
   )?.[0] as HTMLElement;
   let isExpectedChild = notionScrollDiv?.parentElement === notionframe;
   return { isExpectedChild, notionScrollDiv, notionframe };
};

const setFrameMargin = (
   showFrame: boolean,
   notionScrollDiv: HTMLElement,
   wWidth: number
) => {
   if (showFrame) {
      notionScrollDiv.style.marginRight =
         (appWidth(wWidth) + appScrollMargin).toString() + 'px';
   } else {
      notionScrollDiv.style.marginRight = '0px';
   }
};
