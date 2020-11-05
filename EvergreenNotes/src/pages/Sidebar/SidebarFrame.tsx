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
         maxWait: 500,
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
};

const notionScrollDivClass = 'notion-scroller';
const notionFrameClass = 'notion-frame';
const notionAppId = 'notion-app';
const notionSidebarClass = 'notion-sidebar-container';
const notionCollectionScrollersClass =
   'notion-selectable notion-collection_view-block';

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

var observer = new MutationObserver(styleChangedCallback);
const modifyNotionFrame = (showFrame: boolean, wWidth: number) => {
   let {
      isExpectedChild,
      notionScrollDiv,
      notionframe,
      notionSidebar,
   } = getNotionScroll();

   if (isExpectedChild && notionScrollDiv != null) {
      observer.disconnect();
      setFrameWidth(showFrame, notionScrollDiv, wWidth, notionSidebar);
      observer.observe(notionframe, {
         childList: true,
         attributes: true,
         attributeFilter: ['style'],
      });
      observer.observe(notionScrollDiv, {
         attributes: true,
         attributeFilter: ['style'],
      });
   }
};

const setFrameWidth = (
   showFrame: boolean,
   notionScrollDiv: HTMLElement,
   wWidth: number,
   notionSidebar: HTMLElement
) => {
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
   } else {
      notionScrollDiv.style.width = wWidth - sidebarWidth + 'px';
      [
         ...notionScrollDiv.getElementsByClassName(
            notionCollectionScrollersClass
         ),
      ].forEach((f) => ((f as HTMLElement).style.maxWidth = ''));
   }
};
