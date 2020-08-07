//import { hot } from 'react-hot-loader';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import reduxStore, { appDispatch } from 'aNotion/providers/reduxStore';
import { commands } from 'aCommon/commands';
import { activeTab } from 'aCommon/extensionHelpers';
import Layout from 'aNotion/components/Layout';
import { notionSiteActions } from 'aNotion/components/notionSiteSlice';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from 'aCommon/Components/ErrorFallback';
import {
   ThemeProvider,
   Paper,
   Box,
   makeStyles,
   Theme,
   createStyles,
   Zoom,
   Button,
} from '@material-ui/core';
import { theme } from 'aNotion/components/Theme';
import { useWindowSize } from '@react-hook/window-size';
import { SnackbarProvider } from 'notistack';
import { green, yellow, red, grey } from '@material-ui/core/colors';

const snackbarRoot = {
   color: grey[600],
   maxWidth: 290,
   zIndex: 1000,
   marginRight: 12,
   marginBottom: 18,
};
const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      info: { backgroundColor: grey[100], ...snackbarRoot },
      success: { backgroundColor: green[50], ...snackbarRoot },
      error: { backgroundColor: red[100], ...snackbarRoot },
      warning: {
         backgroundColor: yellow[50],
         ...snackbarRoot,
      },
   })
);

console.log('App loading...');
export const Sidebar = () => {
   useEffect(() => {
      setTabId();
   }, []);

   const [wWidth, wHeight] = useWindowSize();
   const classes = useStyles();

   const notistackRef = React.createRef() as any;
   const onClickDismiss = (key: any) => () => {
      notistackRef.current.closeSnackbar(key);
   };

   return (
      <React.StrictMode>
         <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Provider store={reduxStore}>
               <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <ThemeProvider theme={theme}>
                     <Box
                        height={wHeight - 9}
                        width={wWidth - 9}
                        style={{ overflow: 'visible' }}>
                        <SnackbarProvider
                           ref={notistackRef}
                           action={(key) => (
                              <Button onClick={onClickDismiss(key)}>
                                 Dismiss
                              </Button>
                           )}
                           classes={{
                              variantSuccess: classes.success,
                              variantError: classes.error,
                              variantWarning: classes.warning,
                              variantInfo: classes.info,
                           }}
                           autoHideDuration={1000}
                           maxSnack={1}
                           dense={true}
                           preventDuplicate
                           transitionDuration={{ enter: 250, exit: 100 }}
                           variant="info"
                           anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                           }}>
                           <Paper
                              elevation={3}
                              style={{
                                 padding: 6,
                                 margin: 6,
                                 height: wHeight - 30,
                                 width: wWidth - 30,
                                 overflowY: 'auto',
                                 overflowX: 'visible',
                                 scrollbarWidth: 'thin',
                              }}>
                              <Layout />
                           </Paper>
                        </SnackbarProvider>
                     </Box>
                  </ThemeProvider>
               </ErrorBoundary>
            </Provider>
         </ErrorBoundary>
      </React.StrictMode>
   );
};
const setTabId = async () => {
   let w = window as any;
   if (w.contentTabId === undefined) {
      let tab = await activeTab();
      let tabId = tab.id!;
      w.contentTabId = tabId;
      fetchCookies(tabId);
      appDispatch(notionSiteActions.currentPage(tab.url!));
   }
};
const fetchCookies = (tabId: number) => {
   console.log('send fetchCookies');
   chrome.runtime.sendMessage(
      {
         command: commands.fetchCookies,
         tabId: tabId,
      },
      () => {}
   );
};

export default Sidebar;