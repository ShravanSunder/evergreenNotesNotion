/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@material-ui/lab';
import {
   Typography,
   Grid,
   Box,
   Fade,
   CircularProgress,
} from '@material-ui/core';
//export default hot(Layout);
export const LoadingTab = () => {
   return (
      <Box style={{ padding: 6 }}>
         <Typography variant="h2">
            <Skeleton></Skeleton>
         </Typography>
         <LoadingDetails />
         <LoadingDetails />
         <LoadingDetails />
      </Box>
   );
};

export const LoadingSection = () => {
   return (
      <Box style={{ padding: 6 }}>
         <Typography variant="h4">
            <Skeleton></Skeleton>
         </Typography>

         <LoadingDetails />
         <LoadingDetails />
      </Box>
   );
};

export const LoadingLine = () => {
   return (
      <Box style={{ padding: 6 }}>
         <Typography variant="h6">
            <Skeleton></Skeleton>
         </Typography>
      </Box>
   );
};

const LoadingDetails = () => {
   return (
      <React.Fragment>
         <Typography variant="h6">
            <Skeleton></Skeleton>
         </Typography>
         <Typography variant="body2">
            <Skeleton></Skeleton>
            <Skeleton variant="rect" style={{ padding: 9 }} height={40} />;
            <Skeleton></Skeleton>
            <Skeleton></Skeleton>
         </Typography>
         <div style={{ paddingBottom: 18 }}></div>
      </React.Fragment>
   );
};

export const LoadingImage = () => {
   return <Skeleton variant="rect" style={{ padding: 9 }} height={40} />;
};

export const NothingToFind = () => {
   return (
      <Typography
         variant="h6"
         style={{ padding: 7, marginBottom: 15 }}
         gutterBottom>
         🙅🏽 We didn't find anything
      </Typography>
   );
};

export const LoadingUnknown = () => {
   const [loading, setLoading] = useState(false);
   useEffect(() => {
      setLoading(true);
   }, []);

   return (
      <>
         <Grid
            container
            justify="center"
            alignItems="center"
            style={{ minHeight: 100, minWidth: 100, marginTop: 100 }}>
            <Grid item>
               <Fade
                  in={loading}
                  style={{
                     transitionDelay: loading ? '500ms' : '0ms',
                  }}
                  unmountOnExit>
                  <CircularProgress />
               </Fade>
            </Grid>
         </Grid>
      </>
   );
};
