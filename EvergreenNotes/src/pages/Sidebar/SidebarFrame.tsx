import React, { useState, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import {
   Fab,
   ThemeProvider,
   makeStyles,
   Icon,
   SvgIcon,
   Zoom,
   Fade,
   Slide,
} from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import { useWindowSize } from '@react-hook/window-size';
import { theme } from 'aNotion/components/theme';
import { green, lightGreen, grey } from '@material-ui/core/colors';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';
import {
   appPositionTop,
   appPositionLeft,
   appWidth,
   appHeight,
} from './frameProperties';

export const mountSidebar = (sidebar: HTMLElement) => {
   console.log('render');
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

export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');
   let classes = useStyles();

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
         <AppFab
            wWidth={wWidth}
            showFrame={showFrame}
            handleClick={handleClick}
            handleDrag={handleDrag}></AppFab>
         (
         <Slide in={showFrame} direction={'left'}>
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
               title="Evergreen Notes"
               src={url}></iframe>
         </Slide>
         )
      </div>
   );
};

const AppFab = (props: any) => (
   <ThemeProvider theme={theme}>
      <div
         style={{
            zIndex: 1100,
            backgroundColor: '#00000000',
         }}>
         <Draggable
            axis="y"
            handle=".handle"
            position={undefined}
            bounds={{ top: -50, bottom: props.wHeight - 100 }}
            onDrag={props.handleDrag}
            scale={1}>
            <Fab
               style={{
                  position: 'absolute',
                  top: 66,
                  left: props.wWidth - 87,
                  color: props.showFrame ? grey[700] : lightGreen[800],
                  backgroundColor: props.showFrame
                     ? 'rgb(244, 252, 233, 0.5)'
                     : lightGreen[50],
                  zIndex: 1100,
               }}
               className="handle"
               variant="extended"
               size="small"
               color="primary"
               onClick={props.handleClick}
               aria-label="add">
               <MenuBookTwoToneIcon />
            </Fab>
         </Draggable>
      </div>
   </ThemeProvider>
);

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
