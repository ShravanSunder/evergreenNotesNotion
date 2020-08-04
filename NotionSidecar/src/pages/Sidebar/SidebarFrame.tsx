import React, { useState, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { Fab, ThemeProvider } from '@material-ui/core';
import EcoIcon from '@material-ui/icons/Eco';
import { useWindowSize } from '@react-hook/window-size';
import { theme } from 'aNotion/components/Theme';
import { green, lightGreen } from '@material-ui/core/colors';

export const mountSidebar = (sidebar: HTMLElement, tabId: number) => {
   console.log('render');
   chrome.extension.getURL('sidebar.html');

   ReactDOM.render(<LoadSidebarFrame />, sidebar);
};

export const LoadSidebarFrame = () => {
   let url = chrome.extension.getURL('sidebar.html');

   const [wWidth, wHeight] = useWindowSize();
   const [showFrame, setShowFrame] = useState(false);

   const handleClick = (e: SyntheticEvent) => {
      e.stopPropagation();
      setShowFrame(!showFrame);
   };

   return (
      <div>
         <ThemeProvider theme={theme}>
            <div style={{ zIndex: 5020 }}>
               <Draggable
                  axis="y"
                  handle=".handle"
                  position={undefined}
                  scale={1}>
                  <Fab
                     style={{
                        position: 'absolute',
                        top: 39,
                        left: wWidth - 60,
                        color: lightGreen[700],
                        backgroundColor: lightGreen[50],
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
         {showFrame && (
            <iframe
               style={{
                  position: 'absolute',
                  top: 56,
                  left: wWidth - wWidth * 0.25,
                  width: wWidth * 0.25 - 21,
                  height: wHeight - 51 - 9,
                  border: 0,
                  boxShadow: '-2px 0px 6px grey',
               }}
               title="Notion Sidebar Extension"
               src={url}></iframe>
         )}
      </div>
   );
};

//Icons made by <a href="https://www.flaticon.com/free-icon/contract_2942912" title="surang">surang</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
// Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
