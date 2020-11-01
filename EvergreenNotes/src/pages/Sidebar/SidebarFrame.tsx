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
} from './frameProperties';
import { SidebarFab } from './SidebarFab';

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

const notionScrollDivClass = 'notion-scroller';
const notionAppId = 'notion-app';
export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');
   let classes = useStyles();

   const [wWidth, wHeight] = useWindowSize({ wait: 100 });
   const [showFrame, setShowFrame] = useState(false);
   const [wasDragging, setWasDragging] = useState(false);

   useEffect(() => {
      let notionApp = document.getElementById(notionAppId) as HTMLElement;

      if (notionApp != null) {
         if (showFrame) {
            notionApp.style.marginRight =
               (wWidth - appWidth(wWidth)).toString() + 'px';
         } else {
            // notionScrollDiv.style.marginRight = '0px';
         }
      }
   }, [wWidth, wHeight, showFrame]);

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
                  // boxShadow: '-2px 0px 6px grey',
               }}
               title="Evergreen Notes"
               src={url}></iframe>
         </Slide>
      </div>
   );
};
