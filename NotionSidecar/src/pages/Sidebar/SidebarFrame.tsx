import React, { useState, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { Fab, ThemeProvider } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import { useWindowSize } from '@react-hook/window-size';
import { theme } from 'aNotion/components/Theme';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import {
   appPositionTop,
   appPositionLeft,
   appWidth,
   appHeight,
} from './appFrame';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render');
   chrome.extension.getURL('sidebar.html');

   ReactDOM.render(<LoadSidebarFrame />, sidebar);
};

export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');

   const [wWidth, wHeight] = useWindowSize();
   const [showFrame, setShowFrame] = useState(false);

   const [wasDragging, setWasDragging] = useState(false);

   const handleClick = (e: SyntheticEvent) => {
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
         <ThemeProvider theme={theme}>
            <div style={{ zIndex: 1100, backgroundColor: '#00000000' }}>
               <Draggable
                  axis="both"
                  bounds={{ left: 100, top: 0, right: 0, bottom: wHeight }}
                  handle=".handle"
                  position={undefined}
                  onDrag={handleDrag}
                  scale={1}>
                  <Fab
                     style={{
                        position: 'absolute',
                        top: 51,
                        left: wWidth - 60,
                        color: showFrame ? grey[400] : lightGreen[700],
                        backgroundColor: showFrame
                           ? '#00000000'
                           : lightGreen[50],
                        zIndex: 1100,
                     }}
                     className="handle"
                     variant="extended"
                     size="small"
                     color="primary"
                     onClick={handleClick}
                     aria-label="add">
                     <EcoIcon />
                  </Fab>
               </Draggable>
            </div>
         </ThemeProvider>
         (
         <iframe
            style={{
               visibility: showFrame ? 'visible' : 'hidden',
               position: 'absolute',
               top: appPositionTop(),
               left: appPositionLeft(wWidth),
               width: appWidth(wWidth),
               height: appHeight(wHeight),
               border: 0,
               overflow: 'hidden',
               // boxShadow: '-2px 0px 6px grey',
            }}
            title="Notion Sidecar"
            src={url}></iframe>
         )
      </div>
   );
};
