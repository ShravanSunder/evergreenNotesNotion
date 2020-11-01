import React from 'react';
import Draggable from 'react-draggable';
import { Fab, ThemeProvider } from '@material-ui/core';
import { theme } from 'aNotion/components/theme';
import { lightGreen, grey } from '@material-ui/core/colors';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

export const SidebarFab = (props: any) => (
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
                  left: props.wWidth - 67,
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
