import React, { useMemo } from 'react';
import Draggable from 'react-draggable';
import { Fab, ThemeProvider } from '@material-ui/core';
import { createAppTheme } from 'aNotion/components/theme';
import { lightGreen, grey } from '@material-ui/core/colors';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

export const SidebarFab = (props: any) => {
   const isDark = false;

   const theme = useMemo(() => {
      return createAppTheme(isDark);
   }, [isDark]);

   return (
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
               bounds={{ top: -40, bottom: props.wHeight - 200 }}
               onDrag={props.handleDrag}
               scale={1}>
               <Fab
                  style={{
                     position: 'absolute',
                     top: 52,
                     left: props.wWidth - 67,
                     color: props.showFrame ? grey[600] : lightGreen[800],
                     backgroundColor: props.showFrame
                        ? 'rgb(244, 252, 233, 0.5)'
                        : lightGreen[100],
                     zIndex: 1100,
                  }}
                  className="handle"
                  variant="extended"
                  size="small"
                  onClick={props.handleClick}
                  aria-label="add">
                  <MenuBookTwoToneIcon />
               </Fab>
            </Draggable>
         </div>
      </ThemeProvider>
   );
};
