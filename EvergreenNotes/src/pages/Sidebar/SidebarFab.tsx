import React, { useMemo } from 'react';
import Draggable from 'react-draggable';
import { Fab, ThemeProvider } from '@material-ui/core';
import { createAppTheme } from 'aNotion/components/theme';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

export const SidebarFab = (props: any) => {
   const isDark = true;

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
                     color: props.showFrame
                        ? theme.palette.layoutAccent.main
                        : theme.palette.layoutAccent.light,
                     backgroundColor: props.showFrame
                        ? theme.palette.referenceBorder.main
                        : theme.palette.fabBackground.main,
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
